import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Home() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navbar />

      {/* HERO */}
      <section id="home" className="overflow-hidden bg-slate-50">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">

          {/* Hero Content */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700">
              <span className="h-2 w-2 rounded-full bg-blue-600"></span>
              AI-Powered Civic Reporting
            </div>

            <h1 className="max-w-2xl text-5xl font-bold leading-tight tracking-tight text-slate-900 sm:text-6xl">
              Make Your City{" "}
              <span className="text-blue-600">Better, Together.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Report civic issues, track their progress, and help your
              community build a cleaner, safer, and smarter city.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="rounded-xl bg-blue-600 px-6 py-3.5 text-center font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Report an Issue
              </Link>

              <a
                href="#features"
                className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                Explore Features
              </a>
            </div>

            {/* Stats */}
            <div className="mt-10 grid max-w-lg grid-cols-3 gap-6 border-t border-slate-200 pt-8">
              <div>
                <p className="text-2xl font-bold text-slate-900">10K+</p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Reports
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">95%</p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Resolved
                </p>
              </div>

              <div>
                <p className="text-2xl font-bold text-slate-900">24/7</p>
                <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                  Monitoring
                </p>
              </div>
            </div>
          </div>

          {/* Map Illustration */}
          <div className="relative">
            <div className="rounded-3xl border border-slate-200 bg-white p-3 shadow-xl">

              <div className="relative h-[420px] overflow-hidden rounded-2xl bg-slate-100">

                {/* Roads */}
                <div className="absolute left-1/2 top-0 h-full w-10 -translate-x-1/2 rotate-12 bg-white"></div>
                <div className="absolute left-0 top-1/2 h-10 w-full -translate-y-1/2 -rotate-6 bg-white"></div>

                <div className="absolute left-20 top-16 h-56 w-6 rotate-45 bg-white"></div>
                <div className="absolute bottom-10 right-20 h-64 w-7 -rotate-45 bg-white"></div>

                {/* Parks */}
                <div className="absolute left-8 top-8 h-24 w-32 rounded-2xl bg-green-100"></div>
                <div className="absolute bottom-8 right-8 h-28 w-36 rounded-2xl bg-green-100"></div>

                {/* Water */}
                <div className="absolute right-0 top-0 h-40 w-28 rounded-bl-[80px] bg-blue-100"></div>

                {/* Map Markers */}
                <div className="absolute left-[28%] top-[30%] flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg">
                  ⚠
                </div>

                <div className="absolute right-[24%] top-[45%] flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-white shadow-lg">
                  !
                </div>

                <div className="absolute left-[48%] bottom-[22%] flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg">
                  💧
                </div>

                {/* Map Header */}
                <div className="absolute left-5 right-5 top-5 rounded-xl border border-slate-200 bg-white p-4 shadow-md">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        Civic Issues Near You
                      </p>
                      <p className="text-xs text-slate-500">
                        Live community reports
                      </p>
                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                      Live
                    </span>
                  </div>
                </div>

                {/* Map Legend */}
                <div className="absolute bottom-5 left-5 rounded-xl border border-slate-200 bg-white p-4 shadow-md">
                  <p className="mb-2 text-xs font-semibold text-slate-700">
                    Issue Types
                  </p>

                  <div className="space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-500"></span>
                      Roads
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-orange-500"></span>
                      Public Safety
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-blue-600"></span>
                      Water
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold text-blue-600">HOW IT WORKS</p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              From Report to Resolution
            </h2>

            <p className="mt-4 text-slate-600">
              CivicFix AI simplifies the entire civic issue reporting process.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            {[
              {
                number: "01",
                icon: "📱",
                title: "Report",
                text: "Submit a photo and location of the civic issue.",
              },
              {
                number: "02",
                icon: "🤖",
                title: "AI Analysis",
                text: "AI analyzes the issue and identifies its category.",
              },
              {
                number: "03",
                icon: "🔗",
                title: "Issue Fusion",
                text: "Similar reports are grouped into one master issue.",
              },
              {
                number: "04",
                icon: "✅",
                title: "Verify",
                text: "Citizens can verify completed civic improvements.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                    {step.icon}
                  </div>

                  <span className="text-sm font-bold text-slate-300">
                    {step.number}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold">{step.title}</h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="max-w-2xl">
            <p className="font-semibold text-blue-600">FEATURES</p>

            <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
              Everything You Need to Improve Your City
            </h2>

            <p className="mt-4 text-slate-600">
              Powerful tools designed for citizens and civic authorities.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {[
              ["📸", "Smart Reporting", "Report problems with photos, descriptions, and location."],
              ["🤖", "AI Classification", "Automatically identify and categorize civic issues."],
              ["📍", "Location Intelligence", "Find nearby issues and understand problem hotspots."],
              ["📊", "Track Progress", "Follow every complaint from report to resolution."],
              ["🔄", "Duplicate Detection", "Combine similar complaints to reduce duplicate work."],
              ["🔔", "Real-Time Updates", "Receive updates as your reported issue progresses."],
            ].map(([icon, title, text]) => (
              <div
                key={title}
                className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-xl">
                  {icon}
                </div>

                <h3 className="mt-5 text-lg font-bold text-slate-900">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRACKING */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>
              <p className="font-semibold text-blue-600">TRANSPARENCY</p>

              <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
                Know What Happens After You Report
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                CivicFix AI keeps citizens informed throughout the complete
                lifecycle of their complaint.
              </p>

              <Link
                to="/signup"
                className="mt-7 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Start Reporting
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-7">

              {[
                ["Reported", "Your complaint has been submitted.", true],
                ["Verified", "Issue information has been checked.", true],
                ["Assigned", "Assigned to the responsible department.", true],
                ["In Progress", "Authorities are working on the issue.", true],
                ["Fixed", "The reported issue has been resolved.", false],
              ].map(([title, text, active], index) => (
                <div key={title} className="relative flex gap-4 pb-8 last:pb-0">

                  {index !== 4 && (
                    <div className="absolute left-[11px] top-7 h-full w-px bg-slate-300"></div>
                  )}

                  <div
                    className={`relative z-10 mt-1 h-6 w-6 rounded-full border-4 border-slate-50 ${
                      active ? "bg-blue-600" : "bg-slate-300"
                    }`}
                  ></div>

                  <div>
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{text}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="bg-slate-50 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">

          <p className="font-semibold text-blue-600">ABOUT CIVICFIX AI</p>

          <h2 className="mt-3 text-3xl font-bold text-slate-900 sm:text-4xl">
            Technology for Better Communities
          </h2>

          <p className="mx-auto mt-6 max-w-2xl leading-7 text-slate-600">
            CivicFix AI connects citizens and authorities through a
            transparent digital platform that makes reporting, managing,
            and resolving civic issues easier.
          </p>

        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">

          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Ready to Make a Difference?
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-blue-100">
            Join your community and help create a cleaner, safer, and better
            city.
          </p>

          <Link
            to="/signup"
            className="mt-8 inline-block rounded-xl bg-white px-7 py-3.5 font-semibold text-blue-600 shadow-sm hover:bg-blue-50"
          >
            Create Your Account
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default Home;