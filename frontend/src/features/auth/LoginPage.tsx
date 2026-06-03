import React, { useState, useId } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { LOGIN } from "../../graphql/operations";
import { useAuthStore } from "../../store/authStore";
import { FiMail as MailIcon } from "react-icons/fi";
import { FiAlertTriangle as AlertIcon } from "react-icons/fi";
import { MdOutlineLock as LockIcon } from "react-icons/md";
import { FiEye as EyeIcon } from "react-icons/fi";
import { FiEyeOff as EyeOffIcon } from "react-icons/fi";
import { BeatLoader } from "react-spinners";

// ─── Component ────────────────────────────────────────────────────────────────

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const login = useAuthStore((s) => s.login);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Stable IDs for label–input association (React 18+)
  const emailId = useId();
  const passwordId = useId();

  const [loginMutation, { loading }] = useMutation(LOGIN, {
    onCompleted: (data) => {
      login(data.login.user, data.login.token);
      navigate("/dashboard");
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation({ variables: { input: form } });
  };

  return (
    <>
      {/* Card */}
      <div className="rounded-2xl bg-white px-8 py-9 shadow-sm ring-1 ring-gray-200/60">
        {/* Heading */}
        <div className="mb-7">
          <h1 className="text-xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-1 text-sm text-gray-500">
            Sign in to your account to continue.
          </p>
        </div>

        {/* Error banner */}
        {error && (
          <div
            role="alert"
            aria-live="polite"
            className="mb-5 flex items-start gap-2.5 rounded-lg border border-red-200 bg-red-50 px-3.5 py-3 text-sm text-red-700"
          >
            <span className="mt-0.5 shrink-0 text-red-500">
              <AlertIcon />
            </span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div>
            <label
              htmlFor={emailId}
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <MailIcon />
              </span>
              <input
                id={emailId}
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@school.edu"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-3 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label
              htmlFor={passwordId}
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <LockIcon />
              </span>
              <input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 py-2.5 pl-9 pr-10 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
              {/* Password toggle */}
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? <BeatLoader size={13} color="#fff" /> : "Sign In"}
          </button>
        </form>
      </div>

      {/* Sign-up link */}
      <p className="mt-6 text-center text-sm text-gray-500">
        Don't have an account?{" "}
        <Link
          to="/signup"
          className="font-medium text-blue-600 hover:text-blue-700 hover:underline focus-visible:outline-none focus-visible:underline"
        >
          Sign Up
        </Link>
      </p>
    </>
  );
};

export default LoginPage;
