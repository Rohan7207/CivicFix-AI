import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const reports = [
  {
    id: "CF-1024",
    issue: "Large pothole near main road",
    category: "Road & Pothole",
    description:
      "There is a large pothole on the main road which is causing difficulty for vehicles and could be dangerous for two-wheelers.",
    location: "MG Road, Bengaluru",
    date: "Sep 10, 2026",
    status: "In Progress",
    priority: "High",
  },
  {
    id: "CF-1019",
    issue: "Street light not working",
    category: "Street Light",
    description:
      "The street light has not been working for several days, making the road difficult to use at night.",
    location: "Indiranagar 12th Main",
    date: "Sep 5, 2026",
    status: "Pending",
    priority: "Medium",
  },
  {
    id: "CF-1012",
    issue: "Garbage collection issue",
    category: "Garbage",
    description:
      "Garbage has not been collected from the area and waste has started accumulating near the roadside.",
    location: "Koramangala 5th Block",
    date: "Aug 29, 2026",
    status: "Resolved",
    priority: "Medium",
  },
];

function getStatusClasses(status) {
  if (status === "Resolved") {
    return "bg-green-50 text-green-700 border-green-200";
  }

  if (status === "In Progress") {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  return "bg-purple-50 text-purple-700 border-purple-200";
}

function MyReports() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const [selectedReport, setSelectedReport] = useState(null);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="text-xl font-bold tracking-tight text-blue-700"
          >
            CivicFix AI
          </button>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {user?.full_name || "Citizen"}
              </p>

              <p className="text-xs text-slate-500">
                Citizen
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {(user?.full_name || "C")
                .charAt(0)
                .toUpperCase()}
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

      {/* Main */}
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Back */}
        <button
          type="button"
          onClick={() => navigate("/dashboard")}
          className="mb-6 text-sm font-medium text-blue-600 transition hover:text-blue-700"
        >
          ← Back to Dashboard
        </button>

        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Reports
          </h1>

          <p className="mt-2 text-sm text-slate-500 sm:text-base">
            View and track the civic issues you have reported.
          </p>
        </div>

        {/* Reports */}
        <div className="space-y-4">

          {reports.map((report) => (
            <button
              key={report.id}
              type="button"
              onClick={() => setSelectedReport(report)}
              className="w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:border-blue-200 hover:shadow-md sm:p-6"
            >

              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                {/* Report information */}
                <div className="min-w-0">

                  <div className="flex flex-wrap items-center gap-2">

                    <span className="text-xs font-semibold text-blue-600">
                      {report.id}
                    </span>

                    <span className="text-slate-300">
                      •
                    </span>

                    <span className="text-xs text-slate-500">
                      {report.date}
                    </span>

                  </div>

                  <h2 className="mt-2 text-lg font-semibold text-slate-900">
                    {report.issue}
                  </h2>

                  <p className="mt-2 text-sm text-slate-500">
                    {report.location}
                  </p>

                </div>

                {/* Status */}
                <span
                  className={`inline-flex w-fit shrink-0 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                    report.status
                  )}`}
                >
                  {report.status}
                </span>

              </div>

              {/* Bottom information */}
              <div className="mt-5 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-3">

                <div>
                  <p className="text-xs text-slate-400">
                    Category
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {report.category}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Priority
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {report.priority}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    Reported
                  </p>

                  <p className="mt-1 text-sm font-medium text-slate-700">
                    {report.date}
                  </p>
                </div>

              </div>

              <div className="mt-4 text-right text-sm font-medium text-blue-600">
                View details →
              </div>

            </button>
          ))}

        </div>

        {/* Empty state */}
        {reports.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
              +
            </div>

            <h2 className="mt-4 text-lg font-semibold text-slate-900">
              No reports yet
            </h2>

            <p className="mt-2 text-sm text-slate-500">
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

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-6xl px-4 py-5 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          © 2026 CivicFix AI
        </div>
      </footer>

      {/* Report Details Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4 py-6"
          onClick={() => setSelectedReport(null)}
        >

          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="sticky top-0 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">

              <div className="pr-4">

                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                  Report Details
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                  {selectedReport.issue}
                </h2>

                <p className="mt-1 text-sm font-medium text-blue-600">
                  {selectedReport.id}
                </p>

              </div>

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-2xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                ×
              </button>

            </div>

            {/* Details */}
            <div className="space-y-5 p-6">

              {/* Status */}
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                <p className="text-xs font-medium text-slate-400">
                  Current Status
                </p>

                <span
                  className={`mt-2 inline-flex rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusClasses(
                    selectedReport.status
                  )}`}
                >
                  {selectedReport.status}
                </span>

              </div>

              {/* Issue */}
              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="text-xs text-slate-400">
                    Issue
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedReport.issue}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="text-xs text-slate-400">
                    Category
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedReport.category}
                  </p>

                </div>

              </div>

              {/* Description */}
              <div className="rounded-xl border border-slate-200 p-4">

                <p className="text-xs text-slate-400">
                  Description
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-700">
                  {selectedReport.description}
                </p>

              </div>

              {/* Location */}
              <div className="rounded-xl border border-slate-200 p-4">

                <p className="text-xs text-slate-400">
                  Location
                </p>

                <p className="mt-1 font-semibold text-slate-900">
                  {selectedReport.location}
                </p>

              </div>

              {/* Other details */}
              <div className="grid gap-4 sm:grid-cols-2">

                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="text-xs text-slate-400">
                    Priority
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedReport.priority}
                  </p>

                </div>

                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="text-xs text-slate-400">
                    Submitted
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {selectedReport.date}
                  </p>

                </div>

              </div>

            </div>

            {/* Footer */}
            <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">

              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default MyReports;