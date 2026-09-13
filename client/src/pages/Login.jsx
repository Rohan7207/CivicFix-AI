import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Backend authentication will be connected here.
    console.log("Login:", form);

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT SIDE */}
        <div className="hidden bg-blue-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">

          <div>
            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white font-bold text-blue-600">
                CF
              </div>

              <div>
                <h1 className="text-xl font-bold">
                  CivicFix <span className="text-blue-200">AI</span>
                </h1>

                <p className="text-xs text-blue-100">
                  Better city, together
                </p>
              </div>
            </Link>
          </div>

          <div className="max-w-lg">

            <div className="mb-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              Welcome back
            </div>

            <h2 className="text-4xl font-bold leading-tight">
              Help make your community a better place.
            </h2>

            <p className="mt-5 leading-7 text-blue-100">
              Sign in to report civic problems, track complaints, and stay
              connected with your community.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4">

              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-2xl font-bold">10K+</p>
                <p className="mt-1 text-xs text-blue-100">Reports</p>
              </div>

              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-2xl font-bold">95%</p>
                <p className="mt-1 text-xs text-blue-100">Resolved</p>
              </div>

              <div className="rounded-xl bg-white/10 p-4">
                <p className="text-2xl font-bold">24/7</p>
                <p className="mt-1 text-xs text-blue-100">Active</p>
              </div>

            </div>
          </div>

          <p className="text-sm text-blue-100">
            © 2026 CivicFix AI
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center justify-center px-6 py-12">

          <div className="w-full max-w-md">

            <div className="mb-8 lg:hidden">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-bold text-white">
                  CF
                </div>

                <h1 className="text-lg font-bold">
                  CivicFix <span className="text-blue-600">AI</span>
                </h1>
              </Link>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm sm:p-9">

              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  Welcome back
                </h2>

                <p className="mt-2 text-sm text-slate-500">
                  Sign in to your CivicFix account.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">

                {/* EMAIL */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Email address
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-700">
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-16 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500 hover:text-slate-700"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* REMEMBER */}
                <label className="flex items-center gap-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  Remember me
                </label>

                {/* BUTTON */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Sign In
                </button>

              </form>

              <div className="my-7 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200"></div>
                <span className="text-xs text-slate-400">OR</span>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                <span className="font-bold">G</span>
                Continue with Google
              </button>

              <p className="mt-7 text-center text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Create one
                </Link>
              </p>

            </div>

            <div className="mt-6 text-center">
              <Link
                to="/"
                className="text-sm font-medium text-slate-500 hover:text-blue-600"
              >
                ← Back to home
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;