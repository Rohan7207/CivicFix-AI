import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">

        <div className="grid gap-10 md:grid-cols-4">

          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold">
                CF
              </div>

              <h2 className="text-xl font-bold">
                CivicFix <span className="text-blue-400">AI</span>
              </h2>
            </div>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-400">
              Making cities better through intelligent civic reporting,
              community participation, and transparent issue resolution.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h3 className="font-semibold">Platform</h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
              <Link to="/" className="hover:text-white">
                Home
              </Link>

              <a href="/#how-it-works" className="hover:text-white">
                How It Works
              </a>

              <a href="/#features" className="hover:text-white">
                Features
              </a>

              <a href="/#about" className="hover:text-white">
                About
              </a>
            </div>
          </div>

          {/* Account */}
          <div>
            <h3 className="font-semibold">Account</h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400">
              <Link to="/login" className="hover:text-white">
                Login
              </Link>

              <Link to="/signup" className="hover:text-white">
                Create Account
              </Link>

              <Link to="/dashboard" className="hover:text-white">
                Dashboard
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-slate-800 pt-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 CivicFix AI. All rights reserved.</p>

          <p>Built for better communities.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;