import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

function Signup() {
  const navigate = useNavigate();
  const { register } = useUser();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!form.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!form.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await register(form.name.trim(), form.email.trim(), form.password);

      navigate("/dashboard");
    } catch (error) {
      let message = "Unable to sign in. Please try again.";

      if (error?.message === "Failed to fetch" || error?.name === "TypeError") {
        message =
          "Unable to connect to the server. Please check that the backend is running.";
      } else if (error?.code === "INVALID_CREDENTIALS") {
        message = "Invalid email or password.";
      } else if (error?.code === "VALIDATION_ERROR") {
        message = error.message || "Please check your input.";
      } else if (error?.message) {
        message = error.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eef4ff] px-4 py-6 sm:px-6">
      <div className="mx-auto flex min-h-screen max-w-xl items-center justify-center">
        <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-blue-900/5 sm:p-10 md:p-12">
          {/* CivicFix AI Logo */}
          <div className="mb-8 flex items-center gap-4">
            <div className="flex h-12 w-14 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white shadow-lg shadow-blue-600/20">
              CF
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                CivicFix <span className="text-blue-600">AI</span>
              </h1>

              <p className="mt-0.5 text-xs font-medium tracking-wide text-slate-400">
                BETTER CITY, TOGETHER
              </p>
            </div>
          </div>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Create your account
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Join CivicFix and start making a difference.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Signup Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Full name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                placeholder="Your full name"
                autoComplete="name"
                className="w-full rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Email address
              </label>

              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
                  ✉
                </span>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Your email address"
                  autoComplete="email"
                  className="w-full rounded-2xl border border-slate-200 bg-blue-50/70 py-4 pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Password
              </label>

              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-slate-200 bg-blue-50/70 py-4 pl-5 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>

              <p className="mt-2 text-xs text-slate-400">
                Use at least 8 characters.
              </p>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-2 block text-sm font-semibold text-slate-800"
              >
                Confirm password
              </label>

              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-slate-200 bg-white py-4 pl-5 pr-20 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-medium text-slate-500 transition hover:text-blue-600"
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Create Account */}
            <button
              type="submit"
              disabled={loading}
              className="group flex w-full items-center justify-center rounded-2xl bg-blue-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-blue-600/20 transition duration-300 hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="mr-3 h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </>
              )}
            </button>
          </form>

          {/* Login */}
          <div className="mt-4 mb-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 transition hover:text-blue-700"
              >
                Sign In
              </Link>
            </p>
          </div>

          {/* Responsible Usage Notice */}
          <p className="text-xs leading-5 text-slate-400">
            By creating an account, you agree to use CivicFix responsibly and
            provide accurate civic issue reports.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
