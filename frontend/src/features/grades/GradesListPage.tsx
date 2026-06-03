import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { GET_GRADES, DELETE_GRADE } from '../../graphql/operations';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import ConfirmModal from '../../components/ConfirmModal';

const GradesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
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

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Grades</h1>
        <Link to="/grades/create" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          + Assign Grade
        </Link>
      </div>

      <div className="mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by student or course..." />
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {grades?.data?.length === 0 ? (
          <EmptyState title="No grades found" actionLabel="Assign Grade" onAction={() => navigate('/grades/create')} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Grade</th>
                    <th className="px-4 py-3">Remarks</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {grades?.data?.map((grade: any) => (
                    <tr key={grade.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        {grade.enrollment?.student?.firstName} {grade.enrollment?.student?.lastName}
                      </td>
                      <td className="px-4 py-3">
                        {grade.enrollment?.course?.code} - {grade.enrollment?.course?.title}
                      </td>
                      <td className="px-4 py-3 font-medium">{grade.grade}</td>
                      <td className="px-4 py-3 text-gray-500">{grade.remarks || '-'}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link to={`/grades/${grade.id}/edit`} className="text-green-600 hover:underline">Edit</Link>
                          <button onClick={() => setDeleteId(grade.id)} className="text-red-600 hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={grades?.page ?? 1} totalPages={grades?.totalPages ?? 1} onPageChange={setPage} />
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Grade"
        message="Are you sure you want to delete this grade?"
        onConfirm={() => deleteId && deleteGrade({ variables: { id: deleteId } })}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
};

export default GradesListPage;
