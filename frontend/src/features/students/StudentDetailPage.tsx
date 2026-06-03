import React from "react";
import { useQuery } from "@apollo/client";
import { useParams, Link } from "react-router-dom";
import { GET_STUDENT } from "../../graphql/operations";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";

// ─── Icons ────────────────────────────────────────────────────────────────────

const ArrowLeftIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const EditIcon = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const BookIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

function formatDate(timestamp: string | number): string {
  return new Date(Number(timestamp)).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface DetailFieldProps {
  label: string;
  value: React.ReactNode;
}

const DetailField: React.FC<DetailFieldProps> = ({ label, value }) => (
  <div className="space-y-1">
    <dt className="text-xs font-medium uppercase tracking-wider text-gray-400">
      {label}
    </dt>
    <dd className="text-sm font-medium text-gray-900">{value ?? "—"}</dd>
  </div>
);

interface GradeBadgeProps {
  grade?: { grade: string } | null;
}

const GradeBadge: React.FC<GradeBadgeProps> = ({ grade }) => {
  if (!grade) {
    return (
      <span
        className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500 ring-1 ring-gray-200"
        aria-label="No grade assigned"
      >
        Pending
      </span>
    );
  }

  return (
    <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
      {grade.grade}
    </span>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, refetch } = useQuery(GET_STUDENT, {
    variables: { id },
  });

  if (loading) return <LoadingSpinner />;
  if (error)
    return <ErrorMessage message={error.message} onRetry={() => refetch()} />;

  const student = data?.student;
  const enrollmentCount = student?.enrollments?.length ?? 0;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb">
        <Link
          to="/students"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:underline"
        >
          <ArrowLeftIcon />
          Back to Students
        </Link>
      </nav>

      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-blue-500 text-sm font-semibold text-white"
            aria-hidden="true"
          >
            {student?.firstName && student?.lastName
              ? getInitials(student.firstName, student.lastName)
              : "?"}
          </div>

          <div>
            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
              {student?.firstName} {student?.lastName}
            </h1>
            <p className="mt-0.5 text-sm text-gray-500">
              {student?.studentNumber}
            </p>
          </div>
        </div>

        <Link
          to={`/students/${id}/edit`}
          aria-label={`Edit ${student?.firstName} ${student?.lastName}`}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        >
          <EditIcon />
          Edit Student
        </Link>
      </div>

      {/* ── Personal Information Card ── */}
      <section
        aria-labelledby="personal-info-heading"
        className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200/60"
      >
        <div className="border-b border-gray-100 px-5 py-4">
          <h2
            id="personal-info-heading"
            className="text-sm font-semibold text-gray-900"
          >
            Personal Information
          </h2>
        </div>

        <dl className="grid grid-cols-1 gap-6 px-5 py-5 sm:grid-cols-2">
          <DetailField label="Student Number" value={student?.studentNumber} />
          <DetailField label="Email Address" value={student?.email} />
          <DetailField label="First Name" value={student?.firstName} />
          <DetailField label="Last Name" value={student?.lastName} />
        </dl>
      </section>

      {/* ── Enrollments Card ── */}
      <section
        aria-labelledby="enrollments-heading"
        className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200/60"
      >
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
          <span className="text-gray-400" aria-hidden="true">
            <BookIcon />
          </span>
          <h2
            id="enrollments-heading"
            className="text-sm font-semibold text-gray-900"
          >
            Enrollments
          </h2>
          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
            {enrollmentCount}
          </span>
        </div>

        {enrollmentCount === 0 ? (
          <div className="px-5 py-12 text-center">
            <p className="text-sm text-gray-500">
              No enrollments yet for this student.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <caption className="sr-only">
                Course enrollments for {student?.firstName} {student?.lastName}
              </caption>
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/70">
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400"
                  >
                    Course
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400"
                  >
                    Teacher
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400"
                  >
                    Grade
                  </th>
                  <th
                    scope="col"
                    className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400"
                  >
                    Enrolled
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {student?.enrollments?.map((enrollment: any) => (
                  <tr
                    key={enrollment.id}
                    className="transition-colors duration-100 hover:bg-blue-50/40"
                  >
                    <td className="px-5 py-3.5">
                      <div>
                        <span className="font-medium text-gray-900">
                          {enrollment.course.code}
                        </span>
                        <span className="ml-1.5 text-gray-500">
                          — {enrollment.course.title}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {enrollment.course.teacher
                        ? `${enrollment.course.teacher.firstName} ${enrollment.course.teacher.lastName}`
                        : "—"}
                    </td>
                    <td className="px-5 py-3.5">
                      <GradeBadge grade={enrollment.grade} />
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      <time
                        dateTime={new Date(
                          Number(enrollment.enrolledAt),
                        ).toISOString()}
                      >
                        {formatDate(enrollment.enrolledAt)}
                      </time>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentDetailPage;
