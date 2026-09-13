import { Link } from "react-router-dom";

function Dashboard() {
  const stats = [
    {
      label: "My Reports",
      value: "12",
      description: "Total reports submitted",
      icon: "📋",
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      text: "text-blue-700",
    },
    {
      label: "In Progress",
      value: "4",
      description: "Issues being resolved",
      icon: "🔧",
      bg: "bg-amber-50",
      iconBg: "bg-amber-100",
      text: "text-amber-700",
    },
    {
      label: "Resolved",
      value: "6",
      description: "Issues successfully fixed",
      icon: "✓",
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      text: "text-green-700",
    },
    {
      label: "Pending",
      value: "2",
      description: "Waiting for verification",
      icon: "⏳",
      bg: "bg-purple-50",
      iconBg: "bg-purple-100",
      text: "text-purple-700",
    },
  ];

  const reports = [
    {
      id: "CF-1024",
      title: "Large pothole near main road",
      location: "MG Road, Bengaluru",
      date: "Sep 10, 2026",
      status: "In Progress",
      statusClass: "bg-amber-100 text-amber-700",
      icon: "🕳️",
    },
    {
      id: "CF-1018",
      title: "Street light not working",
      location: "Indiranagar 12th Main",
      date: "Sep 7, 2026",
      status: "Resolved",
      statusClass: "bg-green-100 text-green-700",
      icon: "💡",
    },
    {
      id: "CF-1011",
      title: "Garbage collection issue",
      location: "Koramangala 5th Block",
      date: "Sep 4, 2026",
      status: "Pending",
      statusClass: "bg-purple-100 text-purple-700",
      icon: "🗑️",
    },
  ];

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
              S
            </div>

            <button
              type="button"
              className="hidden text-sm font-medium text-slate-500 transition hover:text-red-600 sm:block"
              onClick={() => alert("Logout will be connected to the backend soon.")}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome */}
        <section className="mb-8">
          <div className="rounded-2xl bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white shadow-sm sm:p-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium backdrop-blur">
                  <span>👋</span>
                  Welcome back
                </div>

                <h2 className="text-2xl font-bold sm:text-3xl">
                  Hello, Citizen!
                </h2>

                <p className="mt-2 max-w-xl text-sm leading-6 text-blue-100 sm:text-base">
                  Track your civic reports, follow their progress, and help
                  make your community a better place.
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
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

            <Link
              to="/reports"
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
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
            </Link>
          </div>
        </section>

        {/* Recent Reports */}
        <section className="mb-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Recent Reports
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Keep track of your latest civic reports.
              </p>
            </div>

            <Link
              to="/reports"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {reports.map((report) => (
              <div
                key={report.id}
                className="flex flex-col gap-4 p-5 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-xl">
                  {report.icon}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-semibold text-slate-900">
                      {report.title}
                    </h4>

                    <span className="text-xs text-slate-400">
                      {report.id}
                    </span>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>📍 {report.location}</span>
                    <span>📅 {report.date}</span>
                  </div>
                </div>

                <span
                  className={`w-fit rounded-full px-3 py-1.5 text-xs font-semibold ${report.statusClass}`}
                >
                  {report.status}
                </span>

                <button
                  type="button"
                  className="w-fit text-sm font-medium text-blue-600 hover:text-blue-700"
                  onClick={() =>
                    alert(`Details for ${report.id} will be connected soon.`)
                  }
                >
                  View
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Civic Tip */}
        <section className="rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-xl shadow-sm">
              💡
            </div>

            <div>
              <h3 className="font-bold text-slate-900">
                Help us improve your city
              </h3>

              <p className="mt-1 text-sm leading-6 text-slate-600">
                Clear photos and accurate locations help our AI identify
                issues faster and help authorities respond more effectively.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-center text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            © 2026 CivicFix AI. Making communities better together.
          </p>

          <Link
            to="/"
            className="font-medium text-blue-600 hover:text-blue-700"
          >
            Back to Home
          </Link>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;