import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { complaintService } from "../services/complaintService";

function getStatusClasses(status) {
  const value = String(status || "").toUpperCase();

  if (value === "FIXED" || value === "CLOSED") {
    return "bg-green-50 text-green-700 border-green-200";
  }

  if (value === "IN_PROGRESS") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (value === "REOPENED") {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  if (value === "REPORTED") {
    return "bg-blue-50 text-blue-700 border-blue-200";
  }

  if (value === "PENDING_AI_ANALYSIS") {
    return "bg-purple-50 text-purple-700 border-purple-200";
  }

  return "bg-slate-50 text-slate-600 border-slate-200";
}

function formatStatusLabel(status = "") {
  const value = String(status || "").toUpperCase();

  if (value === "PENDING_AI_ANALYSIS") return "Pending AI Analysis";
  if (value === "REPORTED") return "Reported";
  if (value === "IN_PROGRESS") return "In Progress";
  if (value === "FIXED") return "Fixed";
  if (value === "CLOSED") return "Closed";
  if (value === "REOPENED") return "Reopened";

  return status || "Not available";
}

function getStatusMessage(status = "") {
  const value = String(status || "").toUpperCase();

  if (value === "PENDING_AI_ANALYSIS") {
    return "Your report is being analyzed by CivicFix AI.";
  }

  if (value === "REPORTED") {
    return "Your report has been submitted successfully and is now recorded by CivicFix.";
  }

  if (value === "IN_PROGRESS") {
    return "This issue is currently being worked on by the responsible department.";
  }

  if (value === "FIXED") {
    return "This issue has been marked as fixed. Please check the location if verification is required.";
  }

  if (value === "CLOSED") {
    return "This issue has been resolved and the report has been closed.";
  }

  if (value === "REOPENED") {
    return "This issue was reopened because it still requires attention.";
  }

  return "Your report status has been updated.";
}

function formatDate(timestamp) {
  if (!timestamp) {
    return "Recently";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Recently";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatValue(value, fallback = "Not available") {
  if (value === null || value === undefined || value === "") {
    return fallback;
  }

  return value;
}

function MyReports() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedReportLoading, setSelectedReportLoading] = useState(false);
  const [selectedReportError, setSelectedReportError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadReports = async () => {
      setLoading(true);
      setLoadError("");

      try {
        const result = await complaintService.listComplaints({
          page: 1,
          limit: 50,
        });

        if (!ignore) {
          setReports(result.complaints || []);
        }
      } catch (error) {
        console.error("Unable to load reports:", error);

        if (!ignore) {
          setReports([]);
          setLoadError(
            error?.message || "Unable to load your reports. Please try again.",
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadReports();

    return () => {
      ignore = true;
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const handleViewDetails = async (reportId) => {
    setSelectedReport(null);
    setSelectedReportError("");
    setSelectedReportLoading(true);

    try {
      const result = await complaintService.getComplaintById(reportId);

      const reportFromList = reports.find((report) => report.id === reportId);

      setSelectedReport({
        ...reportFromList,
        ...(result.complaint || result),
        evidence: result.evidence || [],
      });
    } catch (error) {
      console.error("Unable to load report details:", error);

      setSelectedReportError(
        error?.message || "Unable to load report details.",
      );
    } finally {
      setSelectedReportLoading(false);
    }
  };

  const closeModal = () => {
    setSelectedReport(null);
    setSelectedReportError("");
    setSelectedReportLoading(false);
  };

  const normalizedReports = reports.map((report) => ({
    ...report,
    issue:
      report.master_issue_title ||
      report.short_summary ||
      report.description ||
      "Civic Issue Report",
    location: report.address || "Location not provided",
    date: formatDate(report.created_at),
    status: String(report.status || "").toUpperCase(),
    category: report.category || "Not available",
    priority: report.priority || "Not available",
  }));

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="text-sm font-medium text-slate-600">
            Loading your reports...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* NAVBAR */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-xl font-bold tracking-tight text-blue-700"
          >
            CivicFix <span className="text-slate-900">AI</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {user?.full_name || "Citizen"}
              </p>

              <p className="text-xs text-slate-500">Citizen</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {(user?.full_name || "C").charAt(0).toUpperCase()}
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 hover:text-slate-900"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-6xl px-4 py-7 sm:px-6 lg:px-8">
        {/* BACK */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-5 text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          ← Back to Dashboard
        </button>

        {/* HEADING */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Reports
          </h1>

          <p className="mt-1.5 text-sm text-slate-500 sm:text-base">
            Track the civic issues you have reported.
          </p>
        </div>

        {/* LOAD ERROR */}
        {loadError && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4">
            <div className="flex gap-3">
              <span className="text-red-600">⚠️</span>

              <div>
                <p className="text-sm font-semibold text-red-800">
                  Unable to load reports
                </p>

                <p className="mt-1 text-sm text-red-700">{loadError}</p>
              </div>
            </div>
          </div>
        )}

        {/* REPORT LIST */}
        {normalizedReports.length > 0 && (
          <div className="space-y-4">
            {normalizedReports.map((report) => (
              <article
                key={report.id}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-6"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  {/* REPORT INFO */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-semibold text-blue-600">
                        Report #{report.id}
                      </span>

                      <span className="text-slate-300">•</span>

                      <span className="text-xs text-slate-500">
                        {report.date}
                      </span>
                    </div>

                    <h2 className="mt-2 text-lg font-semibold text-slate-900">
                      {report.issue}
                    </h2>

                    <p className="mt-1.5 text-sm text-slate-500">
                      📍 {report.location}
                    </p>
                  </div>

                  {/* STATUS */}
                  <span
                    className={`inline-flex w-fit shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                      report.status,
                    )}`}
                  >
                    {formatStatusLabel(report.status)}
                  </span>
                </div>

                {/* SUMMARY */}
                <div className="mt-5 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-3">
                  <div>
                    <p className="text-xs text-slate-400">Category</p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {report.category}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Priority</p>

                    <p className="mt-1 text-sm font-medium capitalize text-slate-700">
                      {report.priority}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400">Reported</p>

                    <p className="mt-1 text-sm font-medium text-slate-700">
                      {report.date}
                    </p>
                  </div>
                </div>

                {/* ACTION */}
                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => handleViewDetails(report.id)}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-blue-600 transition hover:bg-blue-50 hover:text-blue-700"
                  >
                    View Details →
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {normalizedReports.length === 0 && !loadError && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-14 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-600">
              +
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No reports yet
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-slate-500">
              You have not submitted any civic reports yet.
            </p>

            <button
              type="button"
              onClick={() => navigate("/report")}
              className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              Report an Issue
            </button>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="mt-8 border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          © 2026 CivicFix AI
        </div>
      </footer>

      {/* REPORT DETAILS MODAL */}
      {(selectedReport || selectedReportLoading || selectedReportError) && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 px-4 py-5"
          onClick={closeModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            {/* HEADER */}
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                  Report Details
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  {selectedReport?.id
                    ? `Report #${selectedReport.id}`
                    : "Complaint Details"}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close details"
              >
                ×
              </button>
            </div>

            {/* LOADING */}
            {selectedReportLoading && (
              <div className="flex items-center justify-center px-6 py-16">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

                  <p className="text-sm font-medium text-slate-600">
                    Loading report details...
                  </p>
                </div>
              </div>
            )}

            {/* ERROR */}
            {!selectedReportLoading && selectedReportError && (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-50 text-xl">
                  ⚠️
                </div>

                <h3 className="mt-4 text-base font-semibold text-slate-900">
                  Unable to load details
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  {selectedReportError}
                </p>

                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            )}

            {/* DETAILS */}
            {!selectedReportLoading &&
              !selectedReportError &&
              selectedReport && (
                <div className="space-y-5 p-5 sm:p-6">
                  {/* STATUS */}
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                          Current Status
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-800">
                          {formatStatusLabel(selectedReport.status)}
                        </p>
                      </div>

                      <span
                        className={`inline-flex shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                          selectedReport.status,
                        )}`}
                      >
                        {formatStatusLabel(selectedReport.status)}
                      </span>
                    </div>

                    {/* STATUS MESSAGE */}
                    <div className="mt-3 border-t border-slate-200 pt-3">
                      <p className="text-sm leading-5 text-slate-600">
                        {getStatusMessage(selectedReport.status)}
                      </p>
                    </div>
                  </div>

                  {/* REPORT INFORMATION */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-slate-900">
                      Report Information
                    </h3>

                    <div className="rounded-xl border border-slate-200">
                      {/* DESCRIPTION */}
                      <div className="border-b border-slate-100 p-4">
                        <p className="text-xs text-slate-400">Description</p>

                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          {formatValue(
                            selectedReport.description,
                            "No description provided.",
                          )}
                        </p>
                      </div>

                      {/* LOCATION */}
                      <div className="border-b border-slate-100 p-4">
                        <p className="text-xs text-slate-400">Location</p>

                        <p className="mt-1 text-sm leading-6 text-slate-700">
                          {formatValue(
                            selectedReport.address,
                            "Location not provided.",
                          )}
                        </p>
                      </div>

                      {/* CATEGORY / PRIORITY */}
                      {(selectedReport.category || selectedReport.priority) && (
                        <div className="grid grid-cols-2 gap-4 p-4">
                          {selectedReport.category && (
                            <div>
                              <p className="text-xs text-slate-400">Category</p>

                              <p className="mt-1 text-sm font-medium text-slate-700">
                                {selectedReport.category}
                              </p>
                            </div>
                          )}

                          {selectedReport.priority && (
                            <div>
                              <p className="text-xs text-slate-400">Priority</p>

                              <p className="mt-1 text-sm font-medium capitalize text-slate-700">
                                {selectedReport.priority}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      <div className="border-b border-slate-100 p-4">
                        <p className="text-xs text-slate-400">
                          Similar Reports
                        </p>
                        <p className="mt-1 text-sm font-medium text-slate-700">
                          {selectedReport.similar_complaint_count || 1} reports
                          about this issue
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* VOICE */}
                  {(() => {
                    const voiceEvidence = selectedReport.evidence?.find(
                      (item) => item.type === "VOICE",
                    );

                    return voiceEvidence?.imagekit_url ? (
                      <div>
                        <h3 className="mb-2 text-sm font-semibold text-slate-900">
                          Voice Description
                        </h3>

                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                          <audio
                            controls
                            className="w-full"
                            src={voiceEvidence.imagekit_url}
                          >
                            Your browser does not support audio playback.
                          </audio>
                        </div>
                      </div>
                    ) : null;
                  })()}

                  {/* DATES */}
                  <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-5">
                    <div>
                      <p className="text-xs text-slate-400">Submitted</p>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {formatDate(selectedReport.created_at)}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-slate-400">Last Updated</p>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {formatDate(selectedReport.updated_at)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {/* FOOTER */}
            {!selectedReportLoading && (
              <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default MyReports;
