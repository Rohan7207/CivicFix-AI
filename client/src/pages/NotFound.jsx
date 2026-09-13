import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">

      <div className="text-center">

        <p className="text-7xl font-bold text-blue-600">
          404
        </p>

        <h1 className="mt-5 text-3xl font-bold text-slate-900">
          Page not found
        </h1>

        <p className="mt-3 text-slate-500">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="mt-7 inline-block rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
        >
          Go Home
        </Link>

      </div>

    </div>
  );
}

export default NotFound;