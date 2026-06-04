import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { GET_STUDENTS, DELETE_STUDENT } from "../../graphql/operations";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import ConfirmModal from "../../components/ConfirmModal";
import DataTable, { Column } from "../../components/DataTable";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Student {
  id: string;
  studentNumber: string;
  firstName: string;
  lastName: string;
  email: string;
}

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
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EditIcon = () => (
  <svg
    width="14"
    height="14"
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

const TrashIcon = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

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

// ─── Column Definitions ──────────────────────────────────────────────────────

const useStudentColumns = (
  setDeleteId: (id: string) => void
): Column<Student>[] => [
  {
    key: "student",
    header: "Student",
    render: (student, index) => (
      <div className="flex items-center gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ${avatarColor(index)}`}
          aria-hidden="true"
        >
          {getInitials(student.firstName, student.lastName)}
        </span>
        <span className="font-medium text-gray-900">
          {student.firstName} {student.lastName}
        </span>
      </div>
    ),
  },
  {
    key: "studentNumber",
    header: "Student #",
    render: (student) => (
      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
        {student.studentNumber}
      </span>
    ),
  },
  {
    key: "email",
    header: "Email",
    render: (student) => (
      <a
        href={`mailto:${student.email}`}
        className="text-gray-500 hover:text-blue-600 hover:underline focus-visible:outline-none focus-visible:underline"
      >
        {student.email}
      </a>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    alignRight: true,
    render: (student) => (
      <div className="flex items-center justify-end gap-1">
        <Link
          to={`/students/${student.id}`}
          aria-label={`View ${student.firstName} ${student.lastName}`}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <EyeIcon />
          View
        </Link>
        <Link
          to={`/students/${student.id}/edit`}
          aria-label={`Edit ${student.firstName} ${student.lastName}`}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
        >
          <EditIcon />
          Edit
        </Link>
        <button
          type="button"
          onClick={() => setDeleteId(student.id)}
          aria-label={`Delete ${student.firstName} ${student.lastName}`}
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

const StudentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_STUDENTS, {
    variables: { search: search || undefined, page, limit: 10 },
  });

  const [deleteStudent, { loading: deleting }] = useMutation(DELETE_STUDENT, {
    onCompleted: () => {
      setDeleteId(null);
      refetch();
    },
  });

  if (loading) return <LoadingSpinner />;
  if (error)
    return <ErrorMessage message={error.message} onRetry={() => refetch()} />;

  const students = data?.students;
  const studentList: Student[] = students?.data ?? [];
  const totalCount: number = students?.total ?? studentList.length;

  const columns = useStudentColumns(setDeleteId);

  return (
    <div className="space-y-6">
      {/* ── Page Header ── */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Students</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {totalCount > 0
              ? `${totalCount.toLocaleString()} student${totalCount !== 1 ? "s" : ""} total`
              : "Manage your student records"}
          </p>
        </div>

        <Link
          to="/students/create"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 sm:self-start"
        >
          <PlusIcon />
          Add Student
        </Link>
      </div>

      {/* ── Data Table ── */}
      <DataTable<Student>
        data={studentList}
        columns={columns}
        rowKey={(s) => s.id}
        pagination={{
          page: students?.page ?? 1,
          totalPages: students?.totalPages ?? 1,
          total: totalCount,
        }}
        onPageChange={setPage}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, email or student number…"
        emptyTitle="No students found"
        emptyDescription="Get started by adding your first student."
        emptyActionLabel="Add Student"
        onEmptyAction={() => navigate("/students/create")}
        emptySearchTitle="No students match your search"
        emptySearchDescription="Try adjusting your search terms."
      />

      {/* ── Delete Confirmation Modal ── */}
      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone and will remove all associated records."
        confirmLabel="Delete Student"
        onConfirm={() =>
          deleteId && deleteStudent({ variables: { id: deleteId } })
        }
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
};

export default StudentsListPage;
