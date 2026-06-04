import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { GET_COURSES, DELETE_COURSE } from "../../graphql/operations";
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

const EyeIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
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

const useCourseColumns = (
  setDeleteId: (id: string) => void
): Column<any>[] => [
  {
    key: "code",
    header: "Code",
    render: (course) => (
      <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200">
        {course.code}
      </span>
    ),
  },
  {
    key: "title",
    header: "Title",
    render: (course) => (
      <span className="font-medium text-gray-900">{course.title}</span>
    ),
  },
  {
    key: "teacher",
    header: "Teacher",
    render: (course) => (
      <span className="text-gray-500">
        {course.teacher
          ? `${course.teacher.firstName} ${course.teacher.lastName}`
          : "—"}
      </span>
    ),
  },
  {
    key: "students",
    header: "Students",
    render: (course) => (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
        {course.enrollments?.length ?? 0}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    alignRight: true,
    render: (course) => (
      <div className="flex items-center justify-end gap-1">
        <Link
          to={`/courses/${course.id}`}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <EyeIcon />
          View
        </Link>
        <Link
          to={`/courses/${course.id}/edit`}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <EditIcon />
          Edit
        </Link>
        <button
          type="button"
          onClick={() => setDeleteId(course.id)}
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

const CoursesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_COURSES, {
    variables: { search: search || undefined, page, limit: 10 },
  });

  const [deleteCourse, { loading: deleting }] = useMutation(DELETE_COURSE, {
    onCompleted: () => {
      setDeleteId(null);
      refetch();
    },
  });

  if (loading) return <LoadingSpinner />;
  if (error)
    return <ErrorMessage message={error.message} onRetry={() => refetch()} />;

  const courses = data?.courses;
  const courseList = courses?.data ?? [];
  const totalCount = courses?.total ?? courseList.length;

  const columns = useCourseColumns(setDeleteId);

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {totalCount > 0
              ? `${totalCount.toLocaleString()} course${totalCount !== 1 ? "s" : ""} total`
              : "Manage your course catalog"}
          </p>
        </div>

        <Link
          to="/courses/create"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:self-start"
        >
          <PlusIcon />
          Add Course
        </Link>
      </div>

      {/* ── Data Table ── */}
      <DataTable
        data={courseList}
        columns={columns}
        rowKey={(c: any) => c.id}
        pagination={{
          page: courses?.page ?? 1,
          totalPages: courses?.totalPages ?? 1,
          total: totalCount,
        }}
        onPageChange={setPage}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search courses by code or title…"
        emptyTitle="No courses found"
        emptyDescription="Get started by adding your first course."
        emptyActionLabel="Add Course"
        onEmptyAction={() => navigate("/courses/create")}
        emptySearchTitle="No courses match your search"
        emptySearchDescription="Try adjusting your search terms."
      />

      {/* ── Delete Confirmation Modal ── */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Course"
        message="Are you sure? This will also delete all related enrollments and grades."
        onConfirm={() =>
          deleteId && deleteCourse({ variables: { id: deleteId } })
        }
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
};

export default CoursesListPage;
