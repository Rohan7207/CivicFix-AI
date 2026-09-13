import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function ReportIssue() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Location services are not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        setLocation(
          `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        );
      },
      () => {
        alert(
          "Unable to get your location. Please allow location access."
        );
      }
    );
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!image) {
      alert("Please upload a photo of the issue.");
      return;
    }

    if (!description.trim()) {
      alert("Please describe the issue.");
      return;
    }

    if (!category) {
      alert("Please select an issue category.");
      return;
    }

    if (!location) {
      alert("Please provide the issue location.");
      return;
    }

    console.log({
      image,
      category,
      description,
      location,
    });

    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50">
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
              className="text-sm font-medium text-slate-600 hover:text-blue-600"
            >
              Dashboard
            </Link>
          </div>
        </header>

        <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4 py-12">
          <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm sm:p-10">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-green-100 text-4xl">
              ✓
            </div>

            <h2 className="mt-6 text-2xl font-bold text-slate-900">
              Report Submitted!
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-500">
              Your civic issue has been submitted successfully. CivicFix AI
              will analyze the report and help route it to the appropriate
              authority.
            </p>

            <div className="mt-6 rounded-xl bg-blue-50 p-4 text-left">
              <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                Report status
              </p>

              <p className="mt-1 font-semibold text-slate-900">
                Submitted · Awaiting AI Analysis
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/dashboard"
                className="flex-1 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Go to Dashboard
              </Link>

              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setImage(null);
                  setPreview("");
                  setDescription("");
                  setLocation("");
                  setCategory("");
                }}
                className="flex-1 rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Report Another
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navbar */}
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
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            ← Dashboard
          </Link>
        </div>
      </header>

      {/* Page */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1.5 text-xs font-semibold text-blue-700">
            <span>📍</span>
            Civic Issue Report
          </div>

          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            Report an Issue
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
            Help improve your community by reporting a civic problem. Add a
            photo, location, and description so authorities can respond
            faster.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h3 className="font-bold text-slate-900">
                1. Add a Photo
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                A clear photo helps our AI identify the issue.
              </p>
            </div>

            {preview ? (
              <div className="relative overflow-hidden rounded-2xl border border-slate-200">
                <img
                  src={preview}
                  alt="Issue preview"
                  className="h-72 w-full object-cover"
                />

                <div className="absolute bottom-4 left-4 right-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-md hover:bg-slate-50"
                  >
                    Change Photo
                  </button>

                  <button
                    type="button"
                    onClick={removeImage}
                    className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group flex w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 px-6 py-12 text-center transition hover:border-blue-400 hover:bg-blue-50"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-2xl transition group-hover:scale-105">
                  📷
                </div>

                <p className="mt-4 font-semibold text-slate-900">
                  Upload a photo
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  JPG, PNG or WEBP · Max 10 MB
                </p>

                <span className="mt-4 rounded-lg bg-white px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm">
                  Choose Photo
                </span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleImageChange}
              className="hidden"
            />
          </section>

          {/* Category */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h3 className="font-bold text-slate-900">
                2. Issue Category
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Select the category that best describes the problem.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {[
                { name: "Road & Pothole", icon: "🛣️" },
                { name: "Street Light", icon: "💡" },
                { name: "Garbage", icon: "🗑️" },
                { name: "Water & Drainage", icon: "💧" },
                { name: "Traffic", icon: "🚦" },
                { name: "Other", icon: "📋" },
              ].map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setCategory(item.name)}
                  className={`rounded-xl border p-4 text-left transition ${
                    category === item.name
                      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100"
                      : "border-slate-200 bg-white hover:border-blue-200 hover:bg-slate-50"
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>

                  <p className="mt-2 text-sm font-semibold text-slate-800">
                    {item.name}
                  </p>
                </button>
              ))}
            </div>
          </section>

          {/* Description */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h3 className="font-bold text-slate-900">
                3. Describe the Issue
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Tell us what happened and provide any useful details.
              </p>
            </div>

            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows="5"
              maxLength="1000"
              placeholder="Example: There is a large pothole near the bus stop. It becomes difficult to see at night and vehicles have to suddenly change lanes..."
              className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

            <div className="mt-2 text-right text-xs text-slate-400">
              {description.length}/1000
            </div>
          </section>

          {/* Location */}
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-5">
              <h3 className="font-bold text-slate-900">
                4. Issue Location
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Add the location where the problem is happening.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">
                  📍
                </span>

                <input
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Enter location or address"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="button"
                onClick={getLocation}
                className="rounded-xl border border-blue-200 bg-blue-50 px-5 py-3 text-sm font-semibold text-blue-700 transition hover:bg-blue-100"
              >
                📍 Use My Location
              </button>
            </div>

            <div className="mt-4 flex gap-3 rounded-xl bg-slate-50 p-4">
              <span>🔒</span>

              <p className="text-xs leading-5 text-slate-500">
                Your location is used only to help authorities identify where
                the issue is located and route it to the correct department.
              </p>
            </div>
          </section>

          {/* AI Info */}
          <section className="rounded-2xl border border-blue-100 bg-blue-50 p-5 sm:p-6">
            <div className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
                ✨
              </div>

              <div>
                <h3 className="font-bold text-slate-900">
                  AI-powered analysis
                </h3>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  After submission, CivicFix AI will analyze your report,
                  identify the likely issue type and help prioritize it for
                  the appropriate authority.
                </p>
              </div>
            </div>
          </section>

          {/* Submit */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-xl bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md"
            >
              Submit Report →
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default ReportIssue;