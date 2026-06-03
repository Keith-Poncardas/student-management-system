import { Outlet } from "react-router-dom";

const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen">
      {/* ── Left decorative panel (hidden on mobile) ── */}
      <div
        aria-hidden="true"
        className="hidden w-[45%] flex-col items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 px-12 lg:flex"
      >
        {/* Logo mark */}
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm ring-1 ring-white/20">
          <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="1.75"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c3 3 9 3 12 0v-5" />
          </svg>
        </div>

        <h2 className="mb-2 text-center text-2xl font-bold text-white">
          Student Management System
        </h2>
        <p className="max-w-xs text-center text-sm leading-relaxed text-blue-200">
          Manage students, teachers, courses, enrollments, and grades — all in
          one place.
        </p>

        {/* Decorative dots */}
        <div className="mt-12 flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full bg-white/40 ${i === 0 ? "w-6" : "w-1.5"}`}
            />
          ))}
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-4 py-12">
        <div className="w-full max-w-[400px]">
          {/* Mobile-only logo */}
          <div className="mb-8 flex flex-col items-center lg:hidden">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-200">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="1.75"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </div>
            <p className="text-sm font-semibold text-gray-700">
              Student Management System
            </p>
          </div>

          {/* Card */}
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
