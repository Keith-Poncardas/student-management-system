import React from "react";
import { useQuery } from "@apollo/client";
import { DASHBOARD_STATS } from "../graphql/operations";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";

// ─── Types ────────────────────────────────────────────────────────────────────

interface StatCard {
  label: string;
  value: number;
  icon: React.ReactNode;
  accentClass: string; // border / icon bg color
  iconColorClass: string; // icon stroke color
  bgClass: string; // subtle icon container bg
}

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  studentNumber: string;
  createdAt: string;
}

interface Enrollment {
  id: string;
  student: { firstName: string; lastName: string };
  course: { code: string; title: string };
  enrolledAt: string;
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const StudentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3 3 9 3 12 0v-5" />
  </svg>
);

const TeacherIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const CourseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

const EnrollmentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="9" y1="13" x2="15" y2="13" />
    <line x1="9" y1="17" x2="15" y2="17" />
  </svg>
);

const GradeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.75"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const CalendarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const EmptyBoxIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.25"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Returns initials from a first + last name */
function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

/** Formats a numeric timestamp string into a readable date */
function formatDate(timestamp: string): string {
  return new Date(Number(timestamp)).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface StatCardProps {
  card: StatCard;
}

const StatCardItem: React.FC<StatCardProps> = ({ card }) => (
  <article
    className={`relative overflow-hidden rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200/60 transition-shadow duration-200 hover:shadow-md`}
    aria-label={`${card.label}: ${card.value}`}
  >
    {/* Left accent bar */}
    <span
      className={`absolute left-0 top-0 h-full w-1 ${card.accentClass}`}
      aria-hidden="true"
    />

    <div className="flex items-start justify-between pl-3">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-gray-400">
          {card.label}
        </p>
        <p className="text-3xl font-bold tabular-nums text-gray-900">
          {card.value.toLocaleString()}
        </p>
      </div>

      {/* Icon container */}
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${card.bgClass} ${card.iconColorClass}`}
      >
        {card.icon}
      </div>
    </div>
  </article>
);

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyActivityProps {
  label: string;
}

const EmptyActivity: React.FC<EmptyActivityProps> = ({ label }) => (
  <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
    <span className="text-gray-300">
      <EmptyBoxIcon />
    </span>
    <p className="text-sm font-medium text-gray-400">No {label} yet</p>
    <p className="text-xs text-gray-300">
      Data will appear here once records are added.
    </p>
  </div>
);

// ─── Avatar ───────────────────────────────────────────────────────────────────

interface AvatarProps {
  firstName: string;
  lastName: string;
  colorClass: string;
}

const Avatar: React.FC<AvatarProps> = ({ firstName, lastName, colorClass }) => (
  <div
    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white ${colorClass}`}
    aria-hidden="true"
  >
    {getInitials(firstName, lastName)}
  </div>
);

// ─── Page Component ───────────────────────────────────────────────────────────

const AVATAR_COLORS = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
];

function avatarColor(index: number): string {
  return AVATAR_COLORS[index % AVATAR_COLORS.length];
}

const DashboardPage: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(DASHBOARD_STATS);

  if (loading) return <LoadingSpinner />;
  if (error)
    return <ErrorMessage message={error.message} onRetry={() => refetch()} />;

  const stats = data?.dashboardStats;

  const cards: StatCard[] = [
    {
      label: "Total Students",
      value: stats?.totalStudents ?? 0,
      icon: <StudentIcon />,
      accentClass: "bg-blue-500",
      iconColorClass: "text-blue-600",
      bgClass: "bg-blue-50",
    },
    {
      label: "Total Teachers",
      value: stats?.totalTeachers ?? 0,
      icon: <TeacherIcon />,
      accentClass: "bg-emerald-500",
      iconColorClass: "text-emerald-600",
      bgClass: "bg-emerald-50",
    },
    {
      label: "Total Courses",
      value: stats?.totalCourses ?? 0,
      icon: <CourseIcon />,
      accentClass: "bg-violet-500",
      iconColorClass: "text-violet-600",
      bgClass: "bg-violet-50",
    },
    {
      label: "Total Enrollments",
      value: stats?.totalEnrollments ?? 0,
      icon: <EnrollmentIcon />,
      accentClass: "bg-orange-500",
      iconColorClass: "text-orange-600",
      bgClass: "bg-orange-50",
    },
    {
      label: "Total Grades",
      value: stats?.totalGrades ?? 0,
      icon: <GradeIcon />,
      accentClass: "bg-pink-500",
      iconColorClass: "text-pink-600",
      bgClass: "bg-pink-50",
    },
  ];

  const recentStudents: Student[] = stats?.recentStudents ?? [];
  const recentEnrollments: Enrollment[] = stats?.recentEnrollments ?? [];

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          A high-level overview of your institution's activity.
        </p>
      </div>

      {/* ── Stat Cards ── */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Key Statistics
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {cards.map((card) => (
            <StatCardItem key={card.label} card={card} />
          ))}
        </div>
      </section>

      {/* ── Activity Panels ── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Students */}
        <section
          aria-labelledby="recent-students-heading"
          className="flex flex-col rounded-xl bg-white shadow-sm ring-1 ring-gray-200/60"
        >
          <header className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2
              id="recent-students-heading"
              className="text-sm font-semibold text-gray-900"
            >
              Recent Students
            </h2>
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600">
              {recentStudents.length} shown
            </span>
          </header>

          <div className="flex-1 px-5 py-4">
            {recentStudents.length === 0 ? (
              <EmptyActivity label="students" />
            ) : (
              <ul role="list" className="divide-y divide-gray-50">
                {recentStudents.map((student, i) => (
                  <li
                    key={student.id}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <Avatar
                      firstName={student.firstName}
                      lastName={student.lastName}
                      colorClass={avatarColor(i)}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </p>
                      <p className="text-xs text-gray-400">
                        {student.studentNumber}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
                      <CalendarIcon />
                      <time
                        dateTime={new Date(
                          Number(student.createdAt),
                        ).toISOString()}
                      >
                        {formatDate(student.createdAt)}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Recent Enrollments */}
        <section
          aria-labelledby="recent-enrollments-heading"
          className="flex flex-col rounded-xl bg-white shadow-sm ring-1 ring-gray-200/60"
        >
          <header className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <h2
              id="recent-enrollments-heading"
              className="text-sm font-semibold text-gray-900"
            >
              Recent Enrollments
            </h2>
            <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
              {recentEnrollments.length} shown
            </span>
          </header>

          <div className="flex-1 px-5 py-4">
            {recentEnrollments.length === 0 ? (
              <EmptyActivity label="enrollments" />
            ) : (
              <ul role="list" className="divide-y divide-gray-50">
                {recentEnrollments.map((enrollment, i) => (
                  <li
                    key={enrollment.id}
                    className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                  >
                    <Avatar
                      firstName={enrollment.student.firstName}
                      lastName={enrollment.student.lastName}
                      colorClass={avatarColor(i)}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">
                        {enrollment.student.firstName}{" "}
                        {enrollment.student.lastName}
                      </p>
                      <p className="truncate text-xs text-gray-400">
                        <span className="font-medium text-gray-600">
                          {enrollment.course.code}
                        </span>
                        {" · "}
                        {enrollment.course.title}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
                      <CalendarIcon />
                      <time
                        dateTime={new Date(
                          Number(enrollment.enrolledAt),
                        ).toISOString()}
                      >
                        {formatDate(enrollment.enrolledAt)}
                      </time>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default DashboardPage;
