import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white/70 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 sm:flex-row sm:px-8 lg:px-12">

        <Link
          to="/"
          className="text-lg font-bold text-slate-900"
        >
          CivicFix <span className="text-blue-600">AI</span>
        </Link>

        <div className="flex items-center gap-5 text-sm text-slate-500">
          <Link
            to="/"
            className="transition hover:text-blue-600"
          >
            Home
          </Link>

          <Link
            to="/login"
            className="transition hover:text-blue-600"
          >
            Login
          </Link>

          <Link
            to="/signup"
            className="transition hover:text-blue-600"
          >
            Create Account
          </Link>
        </div>

        <p className="text-xs text-slate-400">
          © 2026 CivicFix AI
        </p>

      </div>
    </footer>
  );
}

export default Footer;