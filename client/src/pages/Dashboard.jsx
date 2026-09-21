import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { complaintService } from "../services/complaintService";

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

function Dashboard() {
  const navigate = useNavigate();
  const { user, loading, logout } = useUser();
  const [reports, setReports] = useState([]);
  const [reportsLoading, setReportsLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const loadReports = async () => {
      if (!user) {
        setReports([]);
        setReportsLoading(false);
        return;
      }

      try {
        const result = await complaintService.listComplaints({
          page: 1,
          limit: 50,
        });

        if (!ignore) {
          setReports(result.complaints || []);
        }
      } catch (error) {
        console.error("Failed to load dashboard reports:", error);

        if (!ignore) {
          setReports([]);
        }
      } finally {
        if (!ignore) {
          setReportsLoading(false);
        }
      }
    };

    loadReports();

    return () => {
      ignore = true;
    };
  }, [user]);

  const stats = useMemo(() => {
    const total = reports.length;

    const reported = reports.filter(
      (report) => String(report.status || "").toUpperCase() === "REPORTED",
    ).length;
    const inProgress = reports.filter(
      (report) => String(report.status || "").toUpperCase() === "IN_PROGRESS",
    ).length;
    const fixed = reports.filter(
      (report) => String(report.status || "").toUpperCase() === "FIXED",
    ).length;
    const closed = reports.filter(
      (report) => String(report.status || "").toUpperCase() === "CLOSED",
    ).length;

    return [
      {
        label: "Total Reports",
        value: String(total),
        description: "All submitted reports",
        icon: "📋",
        bg: "bg-blue-50",
        iconBg: "bg-blue-100",
        text: "text-blue-700",
      },

      {
        label: "Reported",
        value: String(reported),
        description: "Successfully submitted reports",
        icon: "📝",
        bg: "bg-violet-50",
        iconBg: "bg-violet-100",
        text: "text-violet-700",
      },
      {
        label: "In Progress",
        value: String(inProgress),
        description: "Currently being handled",
        icon: "🔧",
        bg: "bg-amber-50",
        iconBg: "bg-amber-100",
        text: "text-amber-700",
      },
      {
        label: "Fixed / Closed",
        value: String(fixed + closed),
        description: "Successfully resolved",
        icon: "✓",
        bg: "bg-green-50",
        iconBg: "bg-green-100",
        text: "text-green-700",
      },
    ];
  }, [reports]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (loading || reportsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />

            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-2xl text-white shadow-sm">
              🏙️
            </div>
          </div>

          <div className="mt-5 text-center">
            <h2 className="text-lg font-bold text-slate-900">CivicFix-AI</h2>

            <p className="mt-1 text-sm text-slate-500">
              Preparing your dashboard
            </p>
          </div>

          <div className="mt-4 flex gap-1.5">
            <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.3s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600 [animation-delay:-0.15s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-blue-600" />
          </div>
        </div>
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
              CF
            </div>

            <div>
              <h1 className="text-lg font-bold text-slate-900">
                CivicFix <span className="text-blue-600">AI</span>
              </h1>

              <p className="hidden text-[10px] font-medium uppercase tracking-wider text-slate-400 sm:block">
                Citizen Dashboard
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="hidden rounded-lg px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 sm:block"
            >
              Home
            </Link>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
              {user?.full_name?.charAt(0)?.toUpperCase() || "C"}
            </div>

            <button
              type="button"
              className="hidden text-sm font-medium text-slate-500 transition hover:text-red-600 sm:block"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section className="mb-6">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-4 text-white shadow-sm sm:p-6">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                  <span>👋</span>
                  Welcome back
                </div>

                <h2 className="text-xl font-bold sm:text-2xl">
                  {user?.full_name || "Citizen"}
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100 ">
                  Track your civic reports, follow their progress, and help make
                  your community a better place.
                </p>
              </div>

              <Link
                to="/report"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-50"
              >
                <span className="text-lg">+</span>
                Report an Issue
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4 xl:grid-cols-5">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className={`rounded-2xl border border-slate-200 ${stat.bg} p-5`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>

                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {stat.value}
                  </p>
                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} text-xl`}
                >
                  {stat.icon}
                </div>
              </div>

              <p className={`mt-3 text-xs font-medium ${stat.text}`}>
                {stat.description}
              </p>
            </div>
          ))}
        </section>

        {/* Quick Actions */}
        <section className="mb-8">
          <h3 className="mb-4 text-lg font-bold text-slate-900">
            Quick Actions
          </h3>

          <div className="grid gap-4 md:grid-cols-2">
            {/* Report Issue */}
            <Link
              to="/report"
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-xl">
                  📍
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">
                    Report an Issue
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Report potholes, garbage, street lights and other civic
                    problems.
                  </p>
                </div>

                <span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
                  →
                </span>
              </div>
            </Link>

            {/* My Reports */}
            <button
              type="button"
              onClick={() => navigate("/my-reports")}
              className="group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-xl">
                  📊
                </div>

                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900">
                    View My Reports
                  </h4>

                  <p className="mt-1 text-sm text-slate-500">
                    Track all your submitted civic issues and their status.
                  </p>
                </div>

                <span className="text-xl text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600">
                  →
                </span>
              </div>
            </button>
          </div>
        </section>

        {/* Civic Tip */}
        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
              💡
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Help us improve your city
              </h3>

              <p className="mt-1 text-xs leading-6 text-slate-600">
                Clear photos and accurate locations help CivicFix identify
                issues faster and route them to the right department.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© 2026 CivicFix AI. Making communities better together.</p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;
