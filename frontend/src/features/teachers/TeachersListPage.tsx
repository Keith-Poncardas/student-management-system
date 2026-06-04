import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { GET_TEACHERS, DELETE_TEACHER } from "../../graphql/operations";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import ConfirmModal from "../../components/ConfirmModal";
import DataTable, { Column } from "../../components/DataTable";

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

const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-orange-500",
  "bg-pink-500",
  "bg-cyan-500",
];

const useTeacherColumns = (
  setDeleteId: (id: string) => void,
): Column<any>[] => [
  {
    key: "name",
    header: "Teacher",
    render: (t, i) => (
      <div className="flex items-center gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold text-white ${AVATAR_COLORS[i % AVATAR_COLORS.length]}`}
          aria-hidden="true"
        >
          {`${t.firstName.charAt(0)}${t.lastName.charAt(0)}`.toUpperCase()}
        </span>
        <span className="font-medium text-gray-900">
          {t.firstName} {t.lastName}
        </span>
      </div>
    ),
  },
  {
    key: "employeeNumber",
    header: "Employee #",
    render: (t) => (
      <span className="inline-flex items-center rounded-md bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 ring-1 ring-gray-200">
        {t.employeeNumber}
      </span>
    ),
  },
  {
    key: "email",
    header: "Email",
    render: (t) => (
      <a
        href={`mailto:${t.email}`}
        className="text-gray-500 hover:text-blue-600 hover:underline"
      >
        {t.email}
      </a>
    ),
  },
  {
    key: "courses",
    header: "Courses",
    render: (t) => (
      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600">
        {t.courses?.length ?? 0}
      </span>
    ),
  },
  {
    key: "actions",
    header: "Actions",
    alignRight: true,
    render: (t) => (
      <div className="flex items-center justify-end gap-1">
        <Link
          to={`/teachers/${t.id}`}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-blue-50 hover:text-blue-700"
        >
          <EyeIcon />
          View
        </Link>
        <Link
          to={`/teachers/${t.id}/edit`}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
        >
          <EditIcon />
          Edit
        </Link>
        <button
          type="button"
          onClick={() => setDeleteId(t.id)}
          className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-700"
        >
          <TrashIcon />
          Delete
        </button>
      </div>
    ),
  },
];

const TeachersListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_TEACHERS, {
    variables: { search: search || undefined, page, limit: 10 },
  });
  const [deleteTeacher, { loading: deleting }] = useMutation(DELETE_TEACHER, {
    onCompleted: () => {
      setDeleteId(null);
      refetch();
    },
  });

  if (loading) return <LoadingSpinner />;
  if (error)
    return <ErrorMessage message={error.message} onRetry={() => refetch()} />;

  const teachers = data?.teachers;
  const teacherList = teachers?.data ?? [];
  const totalCount = teachers?.total ?? teacherList.length;
  const columns = useTeacherColumns(setDeleteId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {totalCount > 0
              ? `${totalCount.toLocaleString()} teacher${totalCount !== 1 ? "s" : ""} total`
              : "Manage your teaching staff"}
          </p>
        </div>
        <Link
          to="/teachers/create"
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:self-start"
        >
          <PlusIcon />
          Add Teacher
        </Link>
      </div>

      <DataTable
        data={teacherList}
        columns={columns}
        rowKey={(t: any) => t.id}
        pagination={{
          page: teachers?.page ?? 1,
          totalPages: teachers?.totalPages ?? 1,
          total: totalCount,
        }}
        onPageChange={setPage}
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, email or employee number…"
        emptyTitle="No teachers found"
        emptyDescription="Get started by adding your first teacher."
        emptyActionLabel="Add Teacher"
        onEmptyAction={() => navigate("/teachers/create")}
      />

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Teacher"
        message="Are you sure? This will also delete all associated courses."
        onConfirm={() =>
          deleteId && deleteTeacher({ variables: { id: deleteId } })
        }
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
};

export default TeachersListPage;
