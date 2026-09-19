import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

const initialReports = [
  {
    id: "CF-1024",
    issue: "Large pothole near main road",
    category: "Road & Pothole",
    description:
      "There is a large pothole on the main road which is causing difficulty for vehicles and could be dangerous for two-wheelers.",
    location: "MG Road, Bengaluru",
    latitude: "12.9716",
    longitude: "77.5946",
    citizen: "Rahul Kumar",
    email: "rahul.kumar@example.com",
    date: "Sep 10, 2026",
    status: "In Progress",
    priority: "High",
    aiCategory: "Road & Pothole",
    confidence: 94,
    imageUrl:
      "https://images.unsplash.com/photo-1621929515183-7f4e4c0b4c7d?auto=format&fit=crop&w=1200&q=80",
  },

  {
    id: "CF-1023",
    issue: "Street light not working",
    category: "Street Light",
    description:
      "The street light has not been working for several days, making the road difficult to use at night.",
    location: "Indiranagar 12th Main",
    latitude: "12.9784",
    longitude: "77.6408",
    citizen: "Priya Sharma",
    email: "priya.sharma@example.com",
    date: "Sep 9, 2026",
    status: "Pending",
    priority: "Medium",
    aiCategory: "Street Light",
    confidence: 91,
    imageUrl:
      "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1200&q=80",
  },

  {
    id: "CF-1022",
    issue: "Garbage collection issue",
    category: "Garbage",
    description:
      "Garbage has not been collected from the area and waste has started accumulating near the roadside.",
    location: "Koramangala 5th Block",
    latitude: "12.9352",
    longitude: "77.6245",
    citizen: "Arjun Patel",
    email: "arjun.patel@example.com",
    date: "Sep 8, 2026",
    status: "Resolved",
    priority: "Medium",
    aiCategory: "Garbage",
    confidence: 96,
    imageUrl:
      "https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&w=1200&q=80",
  },

  {
    id: "CF-1021",
    issue: "Broken footpath",
    category: "Footpath",
    description:
      "The footpath is damaged and several tiles are broken, making it difficult for pedestrians to walk safely.",
    location: "Whitefield Main Road",
    latitude: "12.9698",
    longitude: "77.7499",
    citizen: "Aman Singh",
    email: "aman.singh@example.com",
    date: "Sep 7, 2026",
    status: "Pending",
    priority: "Low",
    aiCategory: "Footpath",
    confidence: 89,
    imageUrl:
      "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=1200&q=80",
  },

  {
    id: "CF-1020",
    issue: "Water leakage",
    category: "Water Leakage",
    description:
      "A water pipe appears to be leaking near the road and water is continuously flowing onto the street.",
    location: "HSR Layout",
    latitude: "12.9116",
    longitude: "77.6389",
    citizen: "Neha Rao",
    email: "neha.rao@example.com",
    date: "Sep 6, 2026",
    status: "In Progress",
    priority: "High",
    aiCategory: "Water Leakage",
    confidence: 93,
    imageUrl:
      "https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=1200&q=80",
  },
];

function getStatusClasses(status) {
  if (status === "Resolved") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (status === "In Progress") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  return "border-purple-200 bg-purple-50 text-purple-700";
}

function getPriorityClasses(priority) {
  if (priority === "High") {
    return "bg-red-50 text-red-700";
  }

  if (priority === "Medium") {
    return "bg-amber-50 text-amber-700";
  }

  return "bg-slate-100 text-slate-600";
}

function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const [reports, setReports] = useState(initialReports);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports = useMemo(() => {
    return reports.filter((report) => {
      const searchText = search.toLowerCase().trim();

      const matchesSearch =
        !searchText ||
        report.id.toLowerCase().includes(searchText) ||
        report.issue.toLowerCase().includes(searchText) ||
        report.location.toLowerCase().includes(searchText) ||
        report.citizen.toLowerCase().includes(searchText);

      const matchesStatus =
        statusFilter === "All" || report.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [reports, search, statusFilter]);

  const totalReports = reports.length;

  const pendingReports = reports.filter(
    (report) => report.status === "Pending"
  ).length;

  const inProgressReports = reports.filter(
    (report) => report.status === "In Progress"
  ).length;

  const resolvedReports = reports.filter(
    (report) => report.status === "Resolved"
  ).length;

  const updateStatus = (id, newStatus) => {
    setReports((currentReports) =>
      currentReports.map((report) =>
        report.id === id
          ? {
              ...report,
              status: newStatus,
            }
          : report
      )
    );

    setSelectedReport((currentReport) =>
      currentReport && currentReport.id === id
        ? {
            ...currentReport,
            status: newStatus,
          }
        : currentReport
    );
  };

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

      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">

          <div>
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-xl font-bold tracking-tight text-blue-700"
            >
              CivicFix AI
            </button>

            <p className="mt-0.5 text-xs text-slate-500">
              Admin Panel
            </p>
          </div>

          <div className="flex items-center gap-3">

            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {user?.full_name || "Admin"}
              </p>

              <p className="text-xs text-slate-500">
                Administrator
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {(user?.full_name || "A").charAt(0).toUpperCase()}
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">

        {/* Page heading */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Reports Overview
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review citizen complaints and manage their status.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">
              Total Reports
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalReports}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">
              Pending
            </p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {pendingReports}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">
              In Progress
            </p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {inProgressReports}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">
              Resolved
            </p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {resolvedReports}
            </p>
          </div>

        </div>

        {/* Manage Reports */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

          {/* Section heading */}
          <div className="border-b border-slate-200 px-6 py-5">

            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Manage Reports
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Click a report to view complete information.
                </p>
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-3 sm:flex-row">

                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search reports..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100 sm:w-72"
                />

                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

              </div>

            </div>
          </div>

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">

            <table className="w-full">

              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Report
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Location
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Citizen
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Date
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredReports.map((report) => (
                  <tr
                    key={report.id}
                    onClick={() => setSelectedReport(report)}
                    className="cursor-pointer border-b border-slate-100 transition hover:bg-blue-50/50"
                  >

                    <td className="px-6 py-5">

                      <p className="font-semibold text-slate-900">
                        {report.issue}
                      </p>

                      <p className="mt-1 text-xs font-medium text-blue-600">
                        {report.id}
                      </p>

                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {report.location}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {report.citizen}
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {report.date}
                    </td>

                    <td
                      className="px-6 py-5"
                      onClick={(e) => e.stopPropagation()}
                    >

                      <select
                        value={report.status}
                        onChange={(e) =>
                          updateStatus(report.id, e.target.value)
                        }
                        className={`rounded-xl border px-4 py-2 text-sm font-medium outline-none ${getStatusClasses(
                          report.status
                        )}`}
                      >
                        <option value="Pending">
                          Pending
                        </option>

                        <option value="In Progress">
                          In Progress
                        </option>

                        <option value="Resolved">
                          Resolved
                        </option>
                      </select>

                    </td>

                  </tr>
                ))}

              </tbody>

            </table>

          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-slate-100 md:hidden">

            {filteredReports.map((report) => (
              <div
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="cursor-pointer p-5 transition hover:bg-blue-50/50"
              >

                <div className="flex items-start justify-between gap-4">

                  <div className="min-w-0">

                    <p className="font-semibold text-slate-900">
                      {report.issue}
                    </p>

                    <p className="mt-1 text-xs font-medium text-blue-600">
                      {report.id}
                    </p>

                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                      report.status
                    )}`}
                  >
                    {report.status}
                  </span>

                </div>

                <div className="mt-4 space-y-2 text-sm">

                  <p className="text-slate-600">
                    <span className="font-medium text-slate-800">
                      Location:
                    </span>{" "}
                    {report.location}
                  </p>

                  <p className="text-slate-600">
                    <span className="font-medium text-slate-800">
                      Citizen:
                    </span>{" "}
                    {report.citizen}
                  </p>

                  <p className="text-slate-600">
                    <span className="font-medium text-slate-800">
                      Date:
                    </span>{" "}
                    {report.date}
                  </p>

                </div>

              </div>
            ))}

          </div>

          {/* Empty state */}
          {filteredReports.length === 0 && (
            <div className="px-6 py-16 text-center">

              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                !
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                No reports found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try changing your search or status filter.
              </p>

            </div>
          )}

        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-5 text-center text-sm text-slate-500 sm:px-6 lg:px-8">
          © 2026 CivicFix AI. Admin Panel.
        </div>
      </footer>

      {/* Report Details Modal */}
      {selectedReport && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4 py-6"
          onClick={() => setSelectedReport(null)}
        >

          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">

              <div className="min-w-0 pr-4">

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
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-2xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                aria-label="Close"
              >
                ×
              </button>

            </div>

            {/* Modal Content */}
            <div className="space-y-7 p-6">

              {/* Submitted By */}
              <section>

                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Submitted By
                </h3>

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">

                  <div className="flex items-center gap-4">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700">
                      {selectedReport.citizen
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div>

                      <p className="font-semibold text-slate-900">
                        {selectedReport.citizen}
                      </p>

                      <p className="mt-1 text-sm text-slate-500">
                        Citizen
                      </p>

                    </div>

                  </div>

                  {/* Email Only */}
                  <div className="mt-4 border-t border-slate-200 pt-4">

                    <p className="text-xs text-slate-400">
                      Email
                    </p>

                    <p className="mt-1 break-all text-sm font-medium text-slate-700">
                      {selectedReport.email || "Not available"}
                    </p>

                  </div>

                </div>

              </section>

              {/* Issue Information */}
              <section>

                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Issue Information
                </h3>

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
                      {selectedReport.category || "Not available"}
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-200 p-4 sm:col-span-2">

                    <p className="text-xs text-slate-400">
                      Description
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-700">
                      {selectedReport.description ||
                        "No description provided."}
                    </p>

                  </div>

                </div>

              </section>

              {/* Location */}
              <section>

                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Location
                </h3>

                <div className="rounded-xl border border-slate-200 p-4">

                  <p className="font-semibold text-slate-900">
                    {selectedReport.location}
                  </p>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2">

                    <div>

                      <p className="text-xs text-slate-400">
                        Latitude
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {selectedReport.latitude ||
                          "Not available"}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-slate-400">
                        Longitude
                      </p>

                      <p className="mt-1 text-sm font-medium text-slate-700">
                        {selectedReport.longitude ||
                          "Not available"}
                      </p>

                    </div>

                  </div>

                </div>

              </section>

              {/* Report Status */}
              <section>

                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Report Status
                </h3>

                <div className="grid gap-4 sm:grid-cols-3">

                  <div className="rounded-xl border border-slate-200 p-4">

                    <p className="text-xs text-slate-400">
                      Status
                    </p>

                    <div className="mt-2">

                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          selectedReport.status
                        )}`}
                      >
                        {selectedReport.status}
                      </span>

                    </div>

                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">

                    <p className="text-xs text-slate-400">
                      Submitted
                    </p>

                    <p className="mt-1 font-semibold text-slate-900">
                      {selectedReport.date}
                    </p>

                  </div>

                  <div className="rounded-xl border border-slate-200 p-4">

                    <p className="text-xs text-slate-400">
                      Priority
                    </p>

                    <div className="mt-2">

                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(
                          selectedReport.priority
                        )}`}
                      >
                        {selectedReport.priority ||
                          "Not analyzed"}
                      </span>

                    </div>

                  </div>

                </div>

              </section>

              {/* Update Status */}
              <section>

                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  Update Status
                </h3>

                <select
                  value={selectedReport.status}
                  onChange={(e) =>
                    updateStatus(
                      selectedReport.id,
                      e.target.value
                    )
                  }
                  className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="In Progress">
                    In Progress
                  </option>

                  <option value="Resolved">
                    Resolved
                  </option>

                </select>

              </section>

              {/* Submitted Evidence */}
              {selectedReport.imageUrl && (
                <section>

                  <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                    Submitted Evidence
                  </h3>

                  <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">

                    <img
                      src={selectedReport.imageUrl}
                      alt={selectedReport.issue}
                      className="max-h-[420px] w-full object-cover"
                    />

                  </div>

                </section>
              )}

              {/* AI Analysis */}
              <section>

                <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                  AI Analysis
                </h3>

                <div className="rounded-xl border border-blue-100 bg-blue-50 p-5">

                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>

                      <p className="text-xs text-blue-500">
                        Detected Category
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {selectedReport.aiCategory ||
                          "Not analyzed"}
                      </p>

                    </div>

                    <div>

                      <p className="text-xs text-blue-500">
                        Confidence
                      </p>

                      <p className="mt-1 font-semibold text-slate-900">
                        {selectedReport.confidence
                          ? `${selectedReport.confidence}%`
                          : "Not analyzed"}
                      </p>

                    </div>

                  </div>

                </div>

              </section>

            </div>

            {/* Modal Footer */}
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

export default Admin;