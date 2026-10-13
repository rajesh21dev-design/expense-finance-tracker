import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Wallet,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { loginUser } from "../redux/slices/authSlice.js";

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, error } = useSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser(form));

    if (loginUser.fulfilled.match(result)) {
      navigate("/dashboard", { replace: true });
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center overflow-x-hidden bg-slate-100 px-3 py-3 sm:px-5">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl lg:grid-cols-2">

        {/* Compact branding panel */}
        <section className="relative hidden flex-col justify-center overflow-hidden bg-slate-950 px-7 py-8 text-white lg:flex xl:px-9">
          <div className="pointer-events-none absolute -right-20 top-20 h-56 w-56 rounded-full border border-violet-400/20" />
          <div className="pointer-events-none absolute -right-10 top-32 h-36 w-36 rounded-full border border-violet-400/20" />
          <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-violet-700/20 blur-3xl" />

          <div className="relative">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
                <Wallet size={22} strokeWidth={2.2} />
              </div>

              <div>
                <h1 className="text-xl font-bold">FinTrack</h1>
                <p className="text-xs text-slate-400">
                  Personal Finance Manager
                </p>
              </div>
            </div>

            {/* Branding content */}
            <div className="mb-5 mt-10 flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-300">
              <TrendingUp size={25} />
            </div>

            <p className="mb-3 text-[10px] font-bold tracking-[0.22em] text-violet-300">
              WELCOME BACK
            </p>

            <h2 className="max-w-xs text-3xl font-bold leading-tight tracking-tight xl:text-4xl">
              Take control of your money.
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-400">
              Track your income, manage expenses, and understand
              your finances — all in one place.
            </p>

            {/* Benefits */}
            <div className="mt-6 space-y-3">
              {[
                "Track income and expenses",
                "Monitor your financial balance",
                "Manage transactions in one place",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400">
                    <ShieldCheck size={14} />
                  </span>

                  <span className="text-xs text-slate-300">
                    {feature}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mt-9 flex items-center gap-2 border-t border-white/10 pt-4 text-[10px] text-slate-500">
            <ShieldCheck size={15} className="text-emerald-400" />
            Your personal financial workspace
          </div>
        </section>

        {/* Compact login form */}
        <section className="flex items-center justify-center px-5 py-5 sm:px-8 lg:px-9 lg:py-6">
          <div className="w-full max-w-sm">

            {/* Mobile branding */}
            <div className="mb-4 flex items-center gap-2.5 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600 text-white">
                <Wallet size={20} />
              </div>

              <div>
                <h1 className="text-lg font-bold text-slate-950">
                  FinTrack
                </h1>
                <p className="text-[10px] text-slate-500">
                  Personal Finance Manager
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-5">
              <span className="inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-[10px] font-semibold text-violet-700">
                Welcome back
              </span>

              <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                Sign in to FinTrack
              </h2>

              <p className="mt-2 text-xs leading-5 text-slate-500">
                Enter your details to access your financial dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                  Email address
                </label>

                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 px-10 py-2.5 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-1.5 block text-xs font-semibold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <LockKeyhole
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    autoComplete="current-password"
                    required
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-10 text-xs text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:bg-white focus:ring-2 focus:ring-violet-500/10"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                  >
                    {showPassword ? (
                      <EyeOff size={16} />
                    ) : (
                      <Eye size={16} />
                    )}
                  </button>
                </div>
              </div>

              {/* Authentication error */}
              {error && (
                <div
                  role="alert"
                  className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-xs text-rose-700"
                >
                  {typeof error === "string"
                    ? error
                    : error.message || "Login failed. Please try again."}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-3 text-xs font-semibold text-white shadow-md shadow-violet-600/20 transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in to your account"}

                {!loading && (
                  <ArrowRight
                    size={16}
                    className="transition-transform group-hover:translate-x-1"
                  />
                )}
              </button>
            </form>

            {/* Register link */}
            <div className="my-9 flex items-center gap-3">
              <div className="h-px flex-1 bg-slate-200" />

              <span className="text-[9px] font-semibold tracking-wider text-slate-400">
                NEW TO FINTRACK?
              </span>

              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <p className="text-center text-xs text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="font-semibold text-violet-700 transition hover:text-violet-900 hover:underline"
              >
                Create an account
              </Link>
            </p>

            <p className="mt-4 text-center text-[10px] leading-4 text-slate-400">
              Securely access your personal finance workspace.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
