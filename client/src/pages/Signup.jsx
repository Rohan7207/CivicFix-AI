import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    if (!form.terms) {
      alert("Please accept the terms and conditions.");
      return;
    }

    // Backend registration will be connected here.
    console.log("Signup:", form);

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-slate-50">

      <div className="grid min-h-screen lg:grid-cols-2">

        {/* LEFT */}
        <div className="hidden bg-blue-600 p-12 text-white lg:flex lg:flex-col lg:justify-between">

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

          <div className="max-w-lg">

            <div className="mb-6 inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-medium">
              Join the community
            </div>

            <h2 className="text-4xl font-bold leading-tight">
              Your voice can help improve your city.
            </h2>

            <p className="mt-5 leading-7 text-blue-100">
              Create your account and start reporting civic issues around
              you.
            </p>

            <div className="mt-8 space-y-4">

              {[
                ["📍", "Report local issues easily"],
                ["🤖", "Let AI categorize your reports"],
                ["📊", "Track complaints in real time"],
                ["🤝", "Help your community"],
              ].map(([icon, text]) => (
                <div
                  key={text}
                  className="flex items-center gap-4 rounded-xl bg-white/10 p-4"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
                    {icon}
                  </div>

                  <p className="text-sm font-medium">{text}</p>
                </div>
              ))}

            </div>
          </div>

          <p className="text-sm text-blue-100">
            © 2026 CivicFix AI
          </p>
        </div>

        {/* RIGHT */}
        <div className="flex items-center justify-center px-6 py-10">

          <div className="w-full max-w-md">

            <div className="mb-7 lg:hidden">
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

              <h2 className="text-2xl font-bold text-slate-900">
                Create your account
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Join CivicFix and start making a difference.
              </p>

              <form onSubmit={handleSubmit} className="mt-7 space-y-4">

                {/* NAME */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Full name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

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
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  />
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Password
                  </label>

                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Create a password"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-16 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>

                  <p className="mt-2 text-xs text-slate-400">
                    Use at least 8 characters.
                  </p>
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Confirm password
                  </label>

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repeat your password"
                      required
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 pr-16 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-500"
                    >
                      {showConfirmPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                </div>

                {/* TERMS */}
                <label className="flex items-start gap-3 pt-2 text-sm text-slate-600">
                  <input
                    type="checkbox"
                    name="terms"
                    checked={form.terms}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600"
                  />

                  <span>
                    I agree to the{" "}
                    <button
                      type="button"
                      className="font-semibold text-blue-600"
                    >
                      Terms of Service
                    </button>{" "}
                    and{" "}
                    <button
                      type="button"
                      className="font-semibold text-blue-600"
                    >
                      Privacy Policy
                    </button>
                    .
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-600 py-3.5 font-semibold text-white shadow-sm hover:bg-blue-700"
                >
                  Create Account
                </button>

              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-200"></div>
                <span className="text-xs text-slate-400">OR</span>
                <div className="h-px flex-1 bg-slate-200"></div>
              </div>

              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-300 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                <span className="font-bold">G</span>
                Continue with Google
              </button>

              <p className="mt-6 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Sign in
                </Link>
              </p>

            </div>

            <div className="mt-5 text-center">
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

export default Signup;