import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { Link, useNavigate } from "react-router-dom";
import { GET_GRADES, DELETE_GRADE } from "../../graphql/operations";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorMessage from "../../components/ErrorMessage";
import ConfirmModal from "../../components/ConfirmModal";
import DataTable, { Column } from "../../components/DataTable";

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const EditIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);
const TrashIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6M14 11v6" /><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const useGradeColumns = (setDeleteId: (id: string) => void): Column<any>[] => [
  {
    key: "student", header: "Student",
    render: (g) => <span className="font-medium text-gray-900">{g.enrollment?.student?.firstName} {g.enrollment?.student?.lastName}</span>,
  },
  {
    key: "course", header: "Course",
    render: (g) => (
      <span>
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 ring-1 ring-blue-200">{g.enrollment?.course?.code}</span>
        <span className="ml-2 text-gray-600">{g.enrollment?.course?.title}</span>
      </span>
    ),
  },
  {
    key: "grade", header: "Grade",
    render: (g) => <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700 ring-1 ring-emerald-200">{g.grade}</span>,
  },
  {
    key: "remarks", header: "Remarks",
    render: (g) => <span className="text-gray-500">{g.remarks || "—"}</span>,
  },
  {
    key: "actions", header: "Actions", alignRight: true,
    render: (g) => (
      <div className="flex items-center justify-end gap-1">
        <Link to={`/grades/${g.id}/edit`} className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-emerald-50 hover:text-emerald-700"><EditIcon />Edit</Link>
        <button type="button" onClick={() => setDeleteId(g.id)} className="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-700"><TrashIcon />Delete</button>
      </div>
    ),
  },
];

const GradesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_GRADES, {
    variables: { search: search || undefined, page, limit: 10 },
  });
  const [deleteGrade, { loading: deleting }] = useMutation(DELETE_GRADE, {
    onCompleted: () => { setDeleteId(null); refetch(); },
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} onRetry={() => refetch()} />;

  const grades = data?.grades;
  const gradeList = grades?.data ?? [];
  const totalCount = grades?.total ?? gradeList.length;
  const columns = useGradeColumns(setDeleteId);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
          <p className="mt-0.5 text-sm text-gray-500">
            {totalCount > 0 ? `${totalCount.toLocaleString()} grade${totalCount !== 1 ? "s" : ""} total` : "Manage student grades"}
          </p>
        </div>
        <Link to="/grades/create" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 sm:self-start">
          <PlusIcon />Assign Grade
        </Link>
      </div>

      <DataTable data={gradeList} columns={columns} rowKey={(g: any) => g.id}
        pagination={{ page: grades?.page ?? 1, totalPages: grades?.totalPages ?? 1, total: totalCount }}
        onPageChange={setPage} search={search} onSearchChange={setSearch}
        searchPlaceholder="Search by student or course…"
        emptyTitle="No grades found" emptyDescription="Get started by assigning a grade."
        emptyActionLabel="Assign Grade" onEmptyAction={() => navigate("/grades/create")}
      />

      <ConfirmModal isOpen={!!deleteId} title="Delete Grade" message="Are you sure you want to delete this grade?"
        onConfirm={() => deleteId && deleteGrade({ variables: { id: deleteId } })}
        onCancel={() => setDeleteId(null)} loading={deleting}
      />
    </div>
  );
};

export default GradesListPage;
