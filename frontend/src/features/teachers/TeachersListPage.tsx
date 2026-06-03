import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { GET_TEACHERS, DELETE_TEACHER } from '../../graphql/operations';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import ConfirmModal from '../../components/ConfirmModal';

const TeachersListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_TEACHERS, {
    variables: { search: search || undefined, page, limit: 10 },
  });

  const [deleteTeacher, { loading: deleting }] = useMutation(DELETE_TEACHER, {
    onCompleted: () => { setDeleteId(null); refetch(); },
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} onRetry={() => refetch()} />;

  const teachers = data?.teachers;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Teachers</h1>
        <Link to="/teachers/create" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          + Add Teacher
        </Link>
      </div>

      <div className="mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search teachers..." />
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {teachers?.data?.length === 0 ? (
          <EmptyState title="No teachers found" actionLabel="Add Teacher" onAction={() => navigate('/teachers/create')} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Employee #</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Courses</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {teachers?.data?.map((teacher: any) => (
                    <tr key={teacher.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{teacher.employeeNumber}</td>
                      <td className="px-4 py-3">{teacher.firstName} {teacher.lastName}</td>
                      <td className="px-4 py-3 text-gray-500">{teacher.email}</td>
                      <td className="px-4 py-3">{teacher.courses?.length ?? 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link to={`/teachers/${teacher.id}`} className="text-blue-600 hover:underline">View</Link>
                          <Link to={`/teachers/${teacher.id}/edit`} className="text-green-600 hover:underline">Edit</Link>
                          <button onClick={() => setDeleteId(teacher.id)} className="text-red-600 hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={teachers?.page ?? 1} totalPages={teachers?.totalPages ?? 1} onPageChange={setPage} />
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Teacher"
        message="Are you sure? This will also delete all associated courses."
        onConfirm={() => deleteId && deleteTeacher({ variables: { id: deleteId } })}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
};

export default TeachersListPage;
