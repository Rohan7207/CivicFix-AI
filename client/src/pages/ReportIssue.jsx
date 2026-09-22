import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../services/api";

function getBackendStatusLabel(status = "") {
  const value = String(status || "").toUpperCase();

  if (value === "PENDING_AI_ANALYSIS") return "Pending AI Analysis";
  if (value === "REPORTED") return "Reported";
  if (value === "IN_PROGRESS") return "In Progress";
  if (value === "FIXED") return "Fixed";
  if (value === "CLOSED") return "Closed";
  if (value === "REOPENED") return "Reopened";

  return status || "Not available";
}

function ReportIssue() {
  const navigate = useNavigate();

  const fileInputRef = useRef(null);
  const voiceInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");

  const [voice, setVoice] = useState(null);

  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const [submitted, setSubmitted] = useState(false);
  const [submittedComplaint, setSubmittedComplaint] = useState(null);

  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");

  // ----------------------------------------
  // PHOTO HANDLING
  // ----------------------------------------

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];

    const maxSize = 10 * 1024 * 1024; // 10 MB

    if (!allowedTypes.includes(file.type)) {
      setError("Please upload a JPEG, PNG, or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      setError("Photo size must be 10 MB or smaller.");
      event.target.value = "";
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setImage(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ----------------------------------------
  // VOICE HANDLING
  // ----------------------------------------

  const handleVoiceChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");

    const allowedTypes = [
      "audio/mpeg",
      "audio/mp3",
      "audio/wav",
      "audio/x-wav",
      "audio/webm",
      "audio/ogg",
      "audio/mp4",
      "audio/m4a",
    ];

    const maxSize = 25 * 1024 * 1024; // 25 MB

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Please upload a supported audio file such as MP3, WAV, WEBM, OGG, or M4A.",
      );
      event.target.value = "";
      return;
    }

    if (file.size > maxSize) {
      setError("Voice file size must be 25 MB or smaller.");
      event.target.value = "";
      return;
    }

    setVoice(file);
  };

  const removeVoice = () => {
    setVoice(null);

    if (voiceInputRef.current) {
      voiceInputRef.current.value = "";
    }
  };

  // ----------------------------------------
  // LOCATION
  // ----------------------------------------

  const getLocation = () => {
    setError("");

    if (!navigator.geolocation) {
      setError("Location services are not supported by your browser.");
      return;
    }

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setLatitude(latitude);
        setLongitude(longitude);

        setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`);

        setLocationLoading(false);
      },
      (locationError) => {
        console.error("Location error:", locationError);

        setLocationLoading(false);

        setError(
          "Unable to get your location. Please allow location access and try again.",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  // ----------------------------------------
  // SUBMIT REPORT
  // ----------------------------------------

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Photo is mandatory
    if (!image) {
      setError("Please upload a photo of the issue.");
      return;
    }

    // Description is optional according to the API
    if (description.length > 1000) {
      setError("Description cannot exceed 1000 characters.");
      return;
    }

    // Latitude and longitude are mandatory
    if (latitude === null || longitude === null) {
      setError(
        "Please use 'Use My Location' to provide the issue coordinates.",
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      // Required
      formData.append("photo", image);
      formData.append("latitude", String(latitude));
      formData.append("longitude", String(longitude));

      // Optional
      if (description.trim()) {
        formData.append("description", description.trim());
      }

      if (location.trim()) {
        formData.append("address", location.trim());
      }

      if (voice) {
        formData.append("voice", voice);
      }

      const response = await api.post("/api/complaints", formData);

      if (!response.success) {
        throw Object.assign(
          new Error(
            response.error?.message ||
              response.message ||
              "Failed to submit report.",
          ),
          {
            code: response.error?.code || response.code || "REQUEST_FAILED",
          },
        );
      }

      setSubmittedComplaint(response.data?.complaint || null);
      setSubmitted(true);
    } catch (error) {
      console.error("Report submission failed:", error);

      if (error.code === "NOT_CIVIC_ISSUE") {
        setError(
          "This image does not appear to show a civic issue. Please upload a clear photo of a local issue and try again.",
        );
        return;
      }

      if (error.code === "MULTIPLE_ISSUES_DETECTED") {
        setError(
          "The submitted evidence shows multiple issues. Please upload a photo focused on one issue at a time.",
        );
        return;
      }

      setError(
        error.message || "Unable to submit your report. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  // ----------------------------------------
  // RESET FORM
  // ----------------------------------------

  const resetForm = () => {
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSubmitted(false);
    setSubmittedComplaint(null);

    setImage(null);
    setPreview("");

    setVoice(null);

    setDescription("");
    setLocation("");

    setLatitude(null);
    setLongitude(null);

    setError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    if (voiceInputRef.current) {
      voiceInputRef.current.value = "";
    }
  };

  // ----------------------------------------
  // REPORT FORM
  // ----------------------------------------

  return (
    <div className="min-h-screen bg-slate-50">
      {/* SUCCESS SCREEN */}
      {submitted ? (
        <>
          <header className="border-b border-slate-200 bg-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                  C
                </div>

                <div>
                  <h1 className="text-lg font-bold text-slate-900">
                    CivicFix <span className="text-blue-600">AI</span>
                  </h1>
                </div>
              </Link>

              <Link
                to="/dashboard"
                className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
              >
                Dashboard
              </Link>
            </div>
          </header>

          <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-8">
            <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm sm:p-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 text-3xl text-green-600">
                ✓
              </div>

              <h2 className="mt-5 text-2xl font-bold text-slate-900">
                Report Submitted!
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Your civic issue has been submitted successfully. CivicFix AI
                will analyze it and route it to the appropriate department.
              </p>

              {submittedComplaint?.id && (
                <div className="mt-5 rounded-xl bg-slate-50 p-3 text-left">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Report ID
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    #{submittedComplaint.id}
                  </p>
                </div>
              )}

              <div className="mt-3 rounded-xl bg-blue-50 p-3 text-left">
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Report Status
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {getBackendStatusLabel(
                    submittedComplaint?.status || "PENDING_AI_ANALYSIS",
                  )}
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {submittedComplaint?.status === "PENDING_AI_ANALYSIS"
                    ? "Your report is currently being analyzed by CivicFix AI."
                    : "Your report has been submitted and processed."}
                </p>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/dashboard"
                  className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Go to Dashboard
                </Link>

                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Report Another
                </button>
              </div>
            </div>
          </main>
        </>
      ) : (
        <>
          {/* NAVBAR */}
          <header className="sticky top-0 z-50 border-b border-slate-200 bg-white">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                  C
                </div>

                <div>
                  <h1 className="text-lg font-bold text-slate-900">
                    CivicFix <span className="text-blue-600">AI</span>
                  </h1>

                  <p className="hidden text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:block">
                    Report an Issue
                  </p>
                </div>
              </Link>

              <Link
                to="/dashboard"
                className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                ← Dashboard
              </Link>
            </div>
          </header>

          {/* PAGE */}
          <main className="mx-auto max-w-3xl px-4 py-6 sm:px-6 lg:px-8">
            {/* HEADING */}
            <div className="mb-5">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                <span>📍</span>
                Civic Issue Report
              </div>

              <h2 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                Report an Issue
              </h2>

              <p className="mt-1.5 max-w-2xl text-sm leading-5 text-slate-500">
                Add a clear photo and location. You can also include a
                description or voice note to help CivicFix understand the issue.
              </p>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-5 flex gap-3 rounded-xl border border-red-200 bg-red-50 p-3">
                <span className="text-red-600">⚠️</span>

                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Unable to submit report
                  </p>

                  <p className="mt-0.5 text-sm text-red-700">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* PHOTO */}
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">Photo</h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                      A clear photo helps CivicFix AI identify the issue.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                    Required
                  </span>
                </div>

                {preview ? (
                  <div className="relative overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={preview}
                      alt="Issue preview"
                      className="h-52 w-full object-cover sm:h-60"
                    />

                    <div className="absolute bottom-3 left-3 right-3 flex gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-lg bg-white px-3 py-2 text-xs font-semibold text-slate-700 shadow-md transition hover:bg-slate-50"
                      >
                        Change Photo
                      </button>

                      <button
                        type="button"
                        onClick={removeImage}
                        className="rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white shadow-md transition hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="group flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-5 py-7 text-center transition hover:border-blue-400 hover:bg-blue-50"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl transition group-hover:scale-105">
                      📷
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      Choose Photo
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      JPG, PNG or WEBP · Max 10 MB
                    </p>
                  </button>
                )}

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </section>

              {/* DESCRIPTION */}
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900">Description</h3>

                    <p className="mt-0.5 text-xs text-slate-500">
                      Add any useful details about the issue.
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-500">
                    Optional
                  </span>
                </div>

                <textarea
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  rows={3}
                  maxLength={1000}
                  placeholder="Example: Large pothole near the bus stop..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />

                <div className="mt-1.5 text-right text-xs text-slate-400">
                  {description.length}/1000
                </div>
              </section>

              {/* SUPPORTING EVIDENCE */}
              <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4">
                  <h3 className="font-bold text-slate-900">
                    Additional Details
                  </h3>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Voice is optional. Location is required.
                  </p>
                </div>

                {/* VOICE */}
                <div className="border-b border-slate-100 pb-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-800">
                      Voice Description
                    </h4>

                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
                      Optional
                    </span>
                  </div>

                  {voice ? (
                    <div className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                          🎤
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-slate-800">
                            {voice.name}
                          </p>

                          <p className="text-xs text-slate-500">
                            {(voice.size / (1024 * 1024)).toFixed(2)} MB
                          </p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={removeVoice}
                        className="shrink-0 rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => voiceInputRef.current?.click()}
                      className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-blue-400 hover:bg-blue-50"
                    >
                      <span>🎤</span>
                      Add Voice Recording
                    </button>
                  )}

                  <p className="mt-2 text-[11px] text-slate-400">
                    MP3, WAV, WEBM, OGG or M4A · Max 25 MB
                  </p>

                  <input
                    ref={voiceInputRef}
                    type="file"
                    accept="audio/mpeg,audio/mp3,audio/wav,audio/x-wav,audio/webm,audio/ogg,audio/mp4,audio/m4a"
                    onChange={handleVoiceChange}
                    className="hidden"
                  />
                </div>

                {/* LOCATION */}
                <div className="pt-4">
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-slate-800">
                      Issue Location
                    </h4>

                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-600">
                      Required
                    </span>
                  </div>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-base">
                        📍
                      </span>

                      <input
                        type="text"
                        value={location}
                        readOnly
                        placeholder="Use your current location"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 text-sm text-slate-900 outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={getLocation}
                      disabled={locationLoading}
                      className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {locationLoading
                        ? "Getting Location..."
                        : "📍 Use My Location"}
                    </button>
                  </div>

                  {latitude !== null && longitude !== null && (
                    <div className="mt-2 rounded-lg bg-green-50 px-3 py-2">
                      <p className="text-xs font-medium text-green-700">
                        ✓ Location captured successfully
                      </p>
                    </div>
                  )}

                  <div className="mt-2 flex gap-2 rounded-lg bg-slate-50 px-3 py-2.5">
                    <span className="text-sm">🔒</span>

                    <p className="text-[11px] leading-5 text-slate-500">
                      Your location helps CivicFix identify where the issue is
                      and route it to the correct department.
                    </p>
                  </div>
                </div>
              </section>

              {/* SUBMIT */}
              <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  disabled={loading}
                  className="rounded-xl border border-slate-200 bg-white px-6 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-xl bg-blue-600 px-7 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Submitting Report..." : "Submit Report →"}
                </button>
              </div>
            </form>
          </main>
        </>
      )}
    </div>
  );
}

export default ReportIssue;
