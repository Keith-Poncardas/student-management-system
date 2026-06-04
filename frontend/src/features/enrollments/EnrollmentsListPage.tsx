import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { GET_ENROLLMENTS, DELETE_ENROLLMENT } from "../../graphql/operations";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import ConfirmModal from "../../components/ConfirmModal";
import DataTable, { Column } from "../../components/DataTable";

// ─── Icons ────────────────────────────────────────────────────────────────────

const PlusIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

// ─── Column Definitions ──────────────────────────────────────────────────────

const useEnrollmentColumns = (
  setDeleteId: (id: string) => void
): Column<any>[] => [
  {
    key: "student",
    header: "Student",
    render: (enrollment) => (
      <Link
        to={`/students/${enrollment.student.id}`}
        className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
      >
        {enrollment.student.firstName} {enrollment.student.lastName}
      </Link>
    ),
  },
  {
    key: "course",
    header: "Course",
    render: (enrollment) => (
      <Link
        to={`/courses/${enrollment.course.id}`}
        className="text-blue-600 hover:text-blue-800 hover:underline"
      >
        <span className="font-medium">{enrollment.course.code}</span>
        <span className="text-gray-400"> — </span>
        <span className="text-gray-600">{enrollment.course.title}</span>
      </Link>
    ),
  },
  {
    key: "teacher",
    header: "Teacher",
    render: (enrollment) => (
      <span className="text-gray-500">
        {enrollment.course.teacher
          ? `${enrollment.course.teacher.firstName} ${enrollment.course.teacher.lastName}`
          : "—"}
      </span>
    ),
  },
  {
    key: "grade",
    header: "Grade",
    render: (enrollment) =>
      enrollment.grade ? (
        <span className="inline-flex items-center rounded-md bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
          {enrollment.grade.grade}
        </span>
      ) : (
        <span className="text-gray-400">N/A</span>
      ),
  },
  {
    key: "enrolledAt",
    header: "Enrolled",
    render: (enrollment) => (
      <span className="text-gray-500">
        {new Date(Number(enrollment.enrolledAt)).toLocaleDateString()}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    alignRight: true,
    render: (enrollment) => (
      <div className="flex items-center justify-end gap-1">
        <button
          type="button"
          onClick={() => setDeleteId(enrollment.id)}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500"
        >
          <TrashIcon />
          Delete
        </button>
      </div>
    ),
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

const EnrollmentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_ENROLLMENTS, {
    variables: { search: search || undefined, page, limit: 10 },
  });

  const [deleteEnrollment, { loading: deleting }] = useMutation(
    DELETE_ENROLLMENT,
    {
      onCompleted: () => {
        setDeleteId(null);
        refetch();
      },
    }
  );

  if (loading) return <LoadingSpinner />;
  if (error)
    return <ErrorMessage message={error.message} onRetry={() => refetch()} />;

  const enrollments = data?.enrollments;
  const enrollmentList = enrollments?.data ?? [];
  const totalCount = enrollments?.total ?? enrollmentList.length;

  const columns = useEnrollmentColumns(setDeleteId);

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {totalCount > 0
              ? `${totalCount.toLocaleString()} enrollment${totalCount !== 1 ? "s" : ""} total`
              : "Manage student enrollments"}
          </p>
        </div>

        <Link
          to="/enrollments/create"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:self-start"
        >
          <PlusIcon />
          Create Enrollment
        </Link>
      </div>

      {/* ── Data Table ── */}
      <DataTable
        data={enrollmentList}
        columns={columns}
        rowKey={(e: any) => e.id}
        pagination={{
          page: enrollments?.page ?? 1,
          totalPages: enrollments?.totalPages ?? 1,
          total: totalCount,
        }}
        onPageChange={setPage}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by student or course…"
        emptyTitle="No enrollments found"
        emptyDescription="Get started by creating a new enrollment."
        emptyActionLabel="Create Enrollment"
        onEmptyAction={() => navigate("/enrollments/create")}
        emptySearchTitle="No enrollments match your search"
        emptySearchDescription="Try adjusting your search terms."
        minWidth="700px"
      />

      {/* ── Delete Confirmation Modal ── */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Enrollment"
        message="Are you sure? This will also delete the associated grade."
        onConfirm={() =>
          deleteId && deleteEnrollment({ variables: { id: deleteId } })
        }
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
};

export default EnrollmentsListPage;
