import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#eef4ff] text-slate-900">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="relative flex min-h-[calc(100vh-72px)] items-center overflow-hidden">

          {/* Background decorations */}
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-blue-300/30 blur-3xl" />

          <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-indigo-300/30 blur-3xl" />

          <div className="absolute right-[18%] top-[15%] h-24 w-24 rounded-full bg-cyan-200/40 blur-2xl" />

          {/* Decorative dots - Left */}
          <div className="absolute left-[8%] top-[22%] grid grid-cols-4 gap-2 opacity-40">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />

            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
          </div>

          {/* Decorative dots - Right */}
          <div className="absolute bottom-[18%] right-[8%] grid grid-cols-4 gap-2 opacity-30">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />

            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-500" />
          </div>

          {/* Main content */}
          <div className="relative z-10 mx-auto w-full max-w-7xl px-6 py-16 sm:px-8 lg:px-12">
            <div className="mx-auto max-w-5xl text-center">

              {/* Brand Badge */}
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-5 py-2 text-sm font-bold tracking-wide text-blue-600 shadow-sm backdrop-blur">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                  CF
                </span>

                CIVICFIX AI
              </div>

              {/* Heading */}
              <h1 className="pb-2 text-3xl font-extrabold leading-[1.2] tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                A Simpler Way to
                <span className="block bg-gradient-to-r capitalize from-blue-600 via-indigo-600 to-blue-500 bg-clip-text text-transparent">
                  improve your community
                </span>
              </h1>

              {/* Description */}
              <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                One simple platform for reporting civic problems,
                understanding issues, and keeping citizens informed.
              </p>

              {/* Buttons */}
              <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">

                <Link
                  to="/signup"
                  className="group inline-flex items-center justify-center rounded-xl bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/15 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-600"
                >
                  Report an Issue

                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </Link>

                <a
                  href="#features"
                  className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white/80 px-7 py-3.5 text-sm font-semibold text-slate-700 shadow-sm backdrop-blur transition duration-300 hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:text-blue-600"
                >
                  Explore Features
                </a>

              </div>

              {/* Feature Cards */}
              <div
                id="features"
                className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3"
              >

                {/* Report */}
                <div className="group rounded-2xl border border-white/80 bg-white/75 p-6 text-left shadow-lg shadow-blue-900/5 backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-xl">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-2xl transition duration-300 group-hover:scale-110">
                    📍
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-slate-900">
                    Report
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Report civic issues quickly with the information that
                    matters.
                  </p>

                </div>

                {/* Understand */}
                <div className="group rounded-2xl border border-white/80 bg-white/75 p-6 text-left shadow-lg shadow-blue-900/5 backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-xl">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-100 text-2xl transition duration-300 group-hover:scale-110">
                    🤖
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-slate-900">
                    Understand
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    AI helps understand and analyze the issues you report.
                  </p>

                </div>

                {/* Track */}
                <div className="group rounded-2xl border border-white/80 bg-white/75 p-6 text-left shadow-lg shadow-blue-900/5 backdrop-blur-md transition duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-xl">

                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-100 text-2xl transition duration-300 group-hover:scale-110">
                    🔎
                  </div>

                  <h2 className="mt-5 text-lg font-bold text-slate-900">
                    Track
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    Stay informed and follow the progress of your reports.
                  </p>

                </div>

              </div>

              {/* Trust line */}
              <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-medium text-slate-400">
                <span>✓ Simple reporting</span>
                <span>✓ AI-assisted analysis</span>
                <span>✓ Transparent tracking</span>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;