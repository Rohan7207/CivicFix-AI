function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">

      {/* ================= NAVBAR ================= */}
      <nav className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-xl">
              🏙️
            </div>

            <div className="text-xl font-extrabold tracking-tight">
              CivicFix
              <span className="text-blue-600"> AI</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#home"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Home
            </a>

            <a
              href="#how-it-works"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              How It Works
            </a>

            <a
              href="#features"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Features
            </a>

            <a
              href="#about"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              About
            </a>
          </div>

          {/* Navbar Buttons */}
          <div className="flex items-center gap-2">
            <button className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:block">
              Login
            </button>

            <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* ================= HERO ================= */}
      <section
        id="home"
        className="overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50"
      >
        <div className="mx-auto grid min-h-[650px] max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-20">

          {/* Hero Text */}
          <div className="text-center lg:text-left">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700">
              🤖 AI-Powered Civic Reporting
            </div>

            <h1 className="text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
              Make Your City
              <span className="block text-blue-600">
                Better, Together.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-600 lg:mx-0">
              Report civic issues in seconds. CivicFix AI analyzes your
              complaint, detects duplicate issues, prioritizes problems,
              and helps authorities resolve them faster.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">

              <button className="rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 hover:shadow-xl">
                📍 Report an Issue
              </button>

              <button className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-600">
                Explore Nearby Issues →
              </button>

            </div>

            {/* Stats */}
            <div className="mx-auto mt-12 grid max-w-lg grid-cols-3 gap-5 border-t border-slate-200 pt-7 lg:mx-0">

              <div>
                <div className="text-xl font-extrabold sm:text-2xl">
                  2,450+
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Issues Reported
                </div>
              </div>

              <div>
                <div className="text-xl font-extrabold sm:text-2xl">
                  1,820+
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  Issues Resolved
                </div>
              </div>

              <div>
                <div className="text-xl font-extrabold sm:text-2xl">
                  94%
                </div>
                <div className="mt-1 text-xs text-slate-500">
                  AI Accuracy
                </div>
              </div>

            </div>
          </div>

          {/* ================= HERO CARD ================= */}
          <div className="relative mx-auto w-full max-w-lg">

            {/* Decorative background */}
            <div className="absolute -inset-5 rounded-[2rem] bg-blue-100/50 blur-3xl"></div>

            <div className="relative rounded-3xl border border-slate-200 bg-white p-4 shadow-2xl">

              {/* Card Header */}
              <div className="flex items-center justify-between px-2 py-3">
                <div className="flex items-center gap-2 font-bold">
                  <span>📍</span>
                  Your City
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-emerald-600">
                  <span>●</span>
                  Live
                </div>
              </div>

              {/* Fake Map */}
              <div className="relative h-72 overflow-hidden rounded-2xl bg-emerald-50">

                {/* Roads */}
                <div className="absolute left-[-10%] top-[45%] h-10 w-[120%] rotate-[-15deg] border-y-4 border-slate-200 bg-white"></div>

                <div className="absolute left-[52%] top-[-20%] h-[140%] w-10 rotate-[20deg] border-x-4 border-slate-200 bg-white"></div>

                <div className="absolute left-0 top-1/3 h-px w-full bg-slate-200"></div>

                <div className="absolute bottom-1/4 left-0 h-px w-full bg-slate-200"></div>

                {/* Issue markers */}
                <div className="absolute left-[18%] top-[22%] flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow-lg">
                  🗑️
                </div>

                <div className="absolute right-[18%] top-[25%] flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow-lg">
                  💡
                </div>

                <div className="absolute right-[22%] bottom-[20%] flex h-11 w-11 items-center justify-center rounded-full bg-white text-xl shadow-lg">
                  🕳️
                </div>

                {/* Location */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl drop-shadow-lg">
                  📍
                </div>
              </div>

              {/* Issue Preview */}
              <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-xl">
                  🕳️
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-bold text-slate-800">
                    Road Pothole
                  </div>

                  <div className="text-xs text-slate-500">
                    AI detected • High Priority
                  </div>
                </div>

                <span className="hidden rounded-md bg-blue-100 px-2 py-1 text-[10px] font-bold text-blue-700 sm:block">
                  IN PROGRESS
                </span>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">

            <div className="text-xs font-extrabold tracking-[0.2em] text-blue-600">
              HOW IT WORKS
            </div>

            <h2 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">
              From Report to Resolution
            </h2>

            <p className="mt-4 text-slate-600">
              CivicFix AI connects citizens and authorities through one
              intelligent civic issue platform.
            </p>

          </div>

          {/* Steps */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            {/* Step 1 */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">

              <div className="text-sm font-extrabold text-slate-300">
                01
              </div>

              <div className="mt-5 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-2xl">
                📸
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Report
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Take a photo, describe the problem, and share your location.
              </p>

            </div>

            {/* Step 2 */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">

              <div className="text-sm font-extrabold text-slate-300">
                02
              </div>

              <div className="mt-5 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-50 text-2xl">
                🤖
              </div>

              <h3 className="mt-5 text-lg font-bold">
                AI Analysis
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                AI identifies the issue, severity, category, and priority.
              </p>

            </div>

            {/* Step 3 */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">

              <div className="text-sm font-extrabold text-slate-300">
                03
              </div>

              <div className="mt-5 flex h-14 w-14 items-center justify-center rounded-xl bg-amber-50 text-2xl">
                🔗
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Issue Fusion
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Similar complaints are combined into one master civic issue.
              </p>

            </div>

            {/* Step 4 */}
            <div className="group rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg">

              <div className="text-sm font-extrabold text-slate-300">
                04
              </div>

              <div className="mt-5 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-2xl">
                ✅
              </div>

              <h3 className="mt-5 text-lg font-bold">
                Verify
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Citizens verify whether the reported issue has actually been
                fixed.
              </p>

            </div>

          </div>
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section id="features" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

          <div className="text-center">
            <div className="text-xs font-extrabold tracking-[0.2em] text-blue-600">
              BUILT FOR CITIZENS
            </div>

            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Everything you need to improve your city
            </h2>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <div className="text-3xl">📍</div>
              <h3 className="mt-5 text-lg font-bold">
                Smart Location
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Automatically attach your current location to civic reports.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <div className="text-3xl">🧠</div>
              <h3 className="mt-5 text-lg font-bold">
                AI-Powered Analysis
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Automatically classify complaints and estimate their priority.
              </p>
            </div>

            <div className="rounded-2xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
              <div className="text-3xl">🔔</div>
              <h3 className="mt-5 text-lg font-bold">
                Track Progress
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Follow your complaint from submission all the way to
                resolution.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ================= ABOUT ================= */}
      <section id="about" className="bg-white py-20">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">

          <div>
            <div className="text-xs font-extrabold tracking-[0.2em] text-blue-600">
              WHY CIVICFIX?
            </div>

            <h2 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl">
              Technology that turns complaints into action.
            </h2>
          </div>

          <div>
            <p className="text-lg leading-8 text-slate-600">
              CivicFix AI reduces duplicate complaints, identifies serious
              civic problems, and creates a transparent connection between
              citizens and authorities.
            </p>

            <p className="mt-5 text-lg leading-8 text-slate-600">
              Instead of simply submitting a complaint and waiting, citizens
              can track progress and verify whether the problem has actually
              been resolved.
            </p>
          </div>

        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="bg-blue-600 px-4 py-20 text-center text-white">
        <h2 className="text-3xl font-extrabold sm:text-4xl">
          See a problem? Report it.
        </h2>

        <p className="mx-auto mt-4 max-w-xl text-blue-100">
          Help make your neighborhood cleaner, safer, and better.
        </p>

        <button className="mt-8 rounded-xl bg-white px-7 py-3.5 font-bold text-blue-600 shadow-lg transition hover:bg-blue-50">
          📍 Report an Issue
        </button>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-slate-950 py-8 text-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">

          <div className="flex items-center gap-2 font-extrabold">
            <span>🏙️</span>
            CivicFix
            <span className="text-blue-400">AI</span>
          </div>

          <p className="text-sm text-slate-400">
            Building better cities with technology.
          </p>

        </div>
      </footer>

    </div>
  )
}

export default App