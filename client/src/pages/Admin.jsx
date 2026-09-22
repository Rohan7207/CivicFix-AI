import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { masterIssueService } from "../services/masterIssueService";

function getStatusClasses(status) {
  const value = String(status || "").toUpperCase();

  if (value === "FIXED" || value === "CLOSED") {
    return "border-green-200 bg-green-50 text-green-700";
  }

  if (value === "IN_PROGRESS") {
    return "border-amber-200 bg-amber-50 text-amber-700";
  }

  if (value === "REOPENED") {
    return "border-rose-200 bg-rose-50 text-rose-700";
  }

  return "border-purple-200 bg-purple-50 text-purple-700";
}

function formatStatusLabel(status = "") {
  const value = String(status || "").toUpperCase();

  if (value === "REPORTED") return "Reported";
  if (value === "IN_PROGRESS") return "In Progress";
  if (value === "FIXED") return "Fixed";
  if (value === "CLOSED") return "Closed";
  if (value === "REOPENED") return "Reopened";

  return status || "Not available";
}

function getPriorityClasses(priority) {
  const value = String(priority || "").toUpperCase();

  if (value === "HIGH") {
    return "bg-red-50 text-red-700";
  }

  if (value === "MEDIUM") {
    return "bg-amber-50 text-amber-700";
  }

  if (value === "LOW") {
    return "bg-green-50 text-green-700";
  }

  if (value === "CRITICAL") {
    return "bg-red-100 text-red-800";
  }

  return "bg-slate-100 text-slate-600";
}

function formatDate(timestamp) {
  if (!timestamp) {
    return "Not available";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatCoordinates(value) {
  if (value === null || value === undefined || value === "") {
    return "Not available";
  }

  return Number(value).toFixed(6);
}

function Admin() {
  const navigate = useNavigate();
  const { user, logout } = useUser();

  const [masterIssues, setMasterIssues] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");

  const [selectedIssue, setSelectedIssue] = useState(null);

  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const [loadError, setLoadError] = useState("");
  const [detailsError, setDetailsError] = useState("");
  const [statusError, setStatusError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadMasterIssues = async () => {
      if (!user || user.role !== "ADMIN") {
        setMasterIssues([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setLoadError("");

        const result = await masterIssueService.listMasterIssues({
          page: 1,
          limit: 100,
        });

        if (!ignore) {
          setMasterIssues(result.masterIssues || []);
        }
      } catch (error) {
        console.error("Unable to load master issues:", error);

        if (!ignore) {
          setMasterIssues([]);
          setLoadError(error.message || "Unable to load master issues.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadMasterIssues();

    return () => {
      ignore = true;
    };
  }, [user]);

  const normalizedIssues = useMemo(() => {
    return masterIssues.map((issue) => ({
      ...issue,

      id: issue.id,

      title: issue.title || "Civic Issue",

      category: issue.category || issue.ai_category || "Not available",

      department: issue.department_name || issue.department || "Not available",

      departmentCode: issue.department_code || "Not available",

      location:
        issue.address || issue.complaint_address || "Location not provided",

      latitude: issue.complaint_latitude ?? issue.latitude ?? null,

      longitude: issue.complaint_longitude ?? issue.longitude ?? null,

      reportCount: Number(
        issue.complaint_count ?? issue.similar_complaint_count ?? 0,
      ),

      priority: issue.priority_level || "Not available",

      status: String(issue.status || "REPORTED").toUpperCase(),

      code: issue.code || "Not available",

      description: issue.description || "No description available.",

      severity: issue.severity || "Not available",

      priorityScore: issue.priority_score ?? null,

      evidenceLevel: issue.evidence_level || null,

      createdAt: formatDate(issue.created_at),

      updatedAt: formatDate(issue.updated_at),
    }));
  }, [masterIssues]);

  const filteredIssues = useMemo(() => {
    if (statusFilter === "All") {
      return normalizedIssues;
    }

    return normalizedIssues.filter((issue) => issue.status === statusFilter);
  }, [normalizedIssues, statusFilter]);

  const totalIssues = normalizedIssues.length;

  const reportedIssues = normalizedIssues.filter(
    (issue) => issue.status === "REPORTED",
  ).length;

  const inProgressIssues = normalizedIssues.filter(
    (issue) => issue.status === "IN_PROGRESS",
  ).length;

  const resolvedIssues = normalizedIssues.filter(
    (issue) => issue.status === "FIXED" || issue.status === "CLOSED",
  ).length;

  const openMasterIssue = async (issue) => {
    try {
      setDetailsLoading(true);
      setDetailsError("");
      setSelectedIssue(null);

      const result = await masterIssueService.getMasterIssueById(issue.id);

      const detailedIssue = result.masterIssue || result;

      setSelectedIssue({
        ...issue,
        ...detailedIssue,

        id: detailedIssue.id ?? issue.id,

        title: detailedIssue.title || issue.title,

        category:
          detailedIssue.category || detailedIssue.ai_category || issue.category,

        department:
          detailedIssue.department_name ||
          detailedIssue.department ||
          issue.department,

        departmentCode: detailedIssue.department_code || issue.departmentCode,

        location:
          detailedIssue.address ||
          detailedIssue.complaint_address ||
          issue.location,

        latitude:
          detailedIssue.complaint_latitude ??
          detailedIssue.latitude ??
          issue.latitude,

        longitude:
          detailedIssue.complaint_longitude ??
          detailedIssue.longitude ??
          issue.longitude,

        reportCount: Number(
          detailedIssue.complaint_count ??
            detailedIssue.similar_complaint_count ??
            issue.reportCount,
        ),

        priority: detailedIssue.priority_level || issue.priority,

        status: String(
          detailedIssue.status || issue.status || "REPORTED",
        ).toUpperCase(),

        code: detailedIssue.code || issue.code,

        description: detailedIssue.description || issue.description,

        createdAt: formatDate(detailedIssue.created_at || issue.created_at),

        updatedAt: formatDate(detailedIssue.updated_at || issue.updated_at),
      });
    } catch (error) {
      console.error("Unable to load master issue details:", error);

      setDetailsError(error.message || "Unable to load master issue details.");
    } finally {
      setDetailsLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      setUpdatingStatus(true);
      setStatusError("");

      const result = await masterIssueService.updateMasterIssueStatus(
        id,
        newStatus,
      );

      const updatedIssue = result.masterIssue || result;

      const normalizedStatus = String(
        updatedIssue.status || newStatus,
      ).toUpperCase();

      setMasterIssues((previous) =>
        previous.map((issue) =>
          Number(issue.id) === Number(id)
            ? {
                ...issue,
                ...updatedIssue,
                status: normalizedStatus,
              }
            : issue,
        ),
      );

      setSelectedIssue((previous) =>
        previous
          ? {
              ...previous,
              ...updatedIssue,
              status: normalizedStatus,
            }
          : previous,
      );
    } catch (error) {
      console.error("Unable to update master issue status:", error);

      setStatusError(error.message || "Unable to update master issue status.");
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

          <p className="text-sm font-medium text-slate-600">
            Loading master issues...
          </p>
        </div>
      </div>
    );
  }

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

            <p className="mt-0.5 text-xs text-slate-500">Admin Panel</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-800">
                {user?.full_name || "Admin"}
              </p>

              <p className="text-xs text-slate-500">Administrator</p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {String(user?.full_name || "A")
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
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Master Issues
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Review fused civic issues and manage their status.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">
              Total Master Issues
            </p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {totalIssues}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">Reported</p>

            <p className="mt-2 text-3xl font-bold text-purple-600">
              {reportedIssues}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">In Progress</p>

            <p className="mt-2 text-3xl font-bold text-amber-600">
              {inProgressIssues}
            </p>
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm font-medium text-slate-500">Resolved</p>

            <p className="mt-2 text-3xl font-bold text-green-600">
              {resolvedIssues}
            </p>
          </div>
        </div>

        {/* Master Issues */}
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Section Header */}
          <div className="border-b border-slate-200 px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  Manage Master Issues
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Click a master issue to view its details.
                </p>
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-11 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="All">All Status</option>
                <option value="REPORTED">Reported</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="FIXED">Fixed</option>
                <option value="CLOSED">Closed</option>
                <option value="REOPENED">Reopened</option>
              </select>
            </div>
          </div>

          {/* Error */}
          {loadError && (
            <div className="border-b border-red-100 bg-red-50 px-6 py-4">
              <p className="text-sm font-medium text-red-700">{loadError}</p>
            </div>
          )}

          {/* Desktop Table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Master Issue
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Category
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Department
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Location
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Reports
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Priority
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredIssues.map((issue) => (
                  <tr
                    key={issue.id}
                    onClick={() => openMasterIssue(issue)}
                    className="cursor-pointer border-b border-slate-100 transition hover:bg-blue-50/50"
                  >
                    <td className="px-6 py-5">
                      <p className="mt-1 text-xs font-medium text-blue-600">
                        {issue.code}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm text-slate-600">
                      {issue.category}
                    </td>

                    <td className="px-6 py-5">
                      <p className="text-sm text-slate-700">
                        {issue.department}
                      </p>

                      {issue.departmentCode !== "Not available" && (
                        <p className="mt-1 text-xs text-slate-400">
                          {issue.departmentCode}
                        </p>
                      )}
                    </td>

                    <td className="max-w-[220px] px-6 py-5">
                      <p className="truncate text-sm text-slate-600">
                        {issue.location}
                      </p>
                    </td>

                    <td className="px-6 py-5 text-sm font-semibold text-slate-700">
                      {issue.reportCount}
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(
                          issue.priority,
                        )}`}
                      >
                        {issue.priority}
                      </span>
                    </td>

                    <td className="px-6 py-5">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          issue.status,
                        )}`}
                      >
                        {formatStatusLabel(issue.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="divide-y divide-slate-100 md:hidden">
            {filteredIssues.map((issue) => (
              <div
                key={issue.id}
                onClick={() => openMasterIssue(issue)}
                className="cursor-pointer p-5 transition hover:bg-blue-50/50"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="mt-1 text-xs font-medium text-blue-600">
                      {issue.code}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                      issue.status,
                    )}`}
                  >
                    {formatStatusLabel(issue.status)}
                  </span>
                </div>

                <div className="mt-4 grid gap-2 text-sm">
                  <p className="text-slate-600">
                    <span className="font-medium text-slate-800">
                      Category:
                    </span>{" "}
                    {issue.category}
                  </p>

                  <p className="text-slate-600">
                    <span className="font-medium text-slate-800">
                      Department:
                    </span>{" "}
                    {issue.department}
                  </p>

                  <p className="text-slate-600">
                    <span className="font-medium text-slate-800">
                      Location:
                    </span>{" "}
                    {issue.location}
                  </p>

                  <p className="text-slate-600">
                    <span className="font-medium text-slate-800">Reports:</span>{" "}
                    {issue.reportCount}
                  </p>

                  <p className="text-slate-600">
                    <span className="font-medium text-slate-800">
                      Priority:
                    </span>{" "}
                    {issue.priority}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {filteredIssues.length === 0 && (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                !
              </div>

              <h3 className="mt-4 text-base font-semibold text-slate-900">
                No master issues found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                There are no master issues for the selected status.
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

      {/* Master Issue Modal */}
      {(selectedIssue || detailsLoading) && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 px-4 py-6"
          onClick={() => {
            if (!detailsLoading) {
              setSelectedIssue(null);
              setDetailsError("");
              setStatusError("");
            }
          }}
        >
          <div
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {detailsLoading ? (
              <div className="flex min-h-[300px] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

                  <p className="text-sm font-medium text-slate-600">
                    Loading master issue...
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5">
                  <div className="min-w-0 pr-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-blue-600">
                      Master Issue
                    </p>

                    <p className="mt-1 text-sm font-medium text-blue-600">
                      {selectedIssue.code}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIssue(null);
                      setDetailsError("");
                      setStatusError("");
                    }}
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-2xl leading-none text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                    aria-label="Close"
                  >
                    ×
                  </button>
                </div>

                {/* Modal Content */}
                <div className="space-y-7 p-6">
                  {detailsError && (
                    <div className="rounded-xl border border-red-100 bg-red-50 p-4">
                      <p className="text-sm font-medium text-red-700">
                        {detailsError}
                      </p>
                    </div>
                  )}

                  {/* Issue Information */}
                  <section>
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Issue Information
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs text-slate-400">Master Issue</p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {selectedIssue.title}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs text-slate-400">Category</p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {selectedIssue.category}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs text-slate-400">Department</p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {selectedIssue.department}
                        </p>

                        {selectedIssue.departmentCode !== "Not available" && (
                          <p className="mt-1 text-xs text-slate-400">
                            {selectedIssue.departmentCode}
                          </p>
                        )}
                      </div>

                      <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs text-slate-400">Priority</p>

                        <span
                          className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getPriorityClasses(
                            selectedIssue.priority,
                          )}`}
                        >
                          {selectedIssue.priority}
                        </span>
                      </div>

                      <div className="rounded-xl border border-slate-200 p-4 sm:col-span-2">
                        <p className="text-xs text-slate-400">Description</p>

                        <p className="mt-2 text-sm leading-6 text-slate-700">
                          {selectedIssue.description}
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
                        {selectedIssue.location}
                      </p>

                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
                        <div>
                          <p className="text-xs text-slate-400">Latitude</p>

                          <p className="mt-1 text-sm font-medium text-slate-700">
                            {formatCoordinates(selectedIssue.latitude)}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs text-slate-400">Longitude</p>

                          <p className="mt-1 text-sm font-medium text-slate-700">
                            {formatCoordinates(selectedIssue.longitude)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Master Issue Information */}
                  <section>
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Master Issue Information
                    </h3>

                    <div className="grid gap-4 sm:grid-cols-3">
                      <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs text-slate-400">Reports</p>

                        <p className="mt-1 text-xl font-bold text-slate-900">
                          {selectedIssue.reportCount}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs text-slate-400">Created</p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {selectedIssue.createdAt}
                        </p>
                      </div>

                      <div className="rounded-xl border border-slate-200 p-4">
                        <p className="text-xs text-slate-400">Last Updated</p>

                        <p className="mt-1 font-semibold text-slate-900">
                          {selectedIssue.updatedAt}
                        </p>
                      </div>
                    </div>
                  </section>

                  {/* Status */}
                  <section>
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Current Status
                    </h3>

                    <div className="rounded-xl border border-slate-200 p-4">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${getStatusClasses(
                          selectedIssue.status,
                        )}`}
                      >
                        {formatStatusLabel(selectedIssue.status)}
                      </span>
                    </div>
                  </section>

                  {/* Update Status */}
                  <section>
                    <h3 className="mb-3 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Update Status
                    </h3>

                    <select
                      value={selectedIssue.status}
                      disabled={updatingStatus}
                      onChange={(e) =>
                        updateStatus(selectedIssue.id, e.target.value)
                      }
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <option value="REPORTED">Reported</option>

                      <option value="IN_PROGRESS">In Progress</option>

                      <option value="FIXED">Fixed</option>
                    </select>

                    {updatingStatus && (
                      <p className="mt-2 text-xs text-slate-500">
                        Updating status...
                      </p>
                    )}

                    {statusError && (
                      <p className="mt-2 text-sm font-medium text-red-600">
                        {statusError}
                      </p>
                    )}
                  </section>
                </div>

                {/* Modal Footer */}
                <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIssue(null);
                      setDetailsError("");
                      setStatusError("");
                    }}
                    className="rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                  >
                    Close
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
