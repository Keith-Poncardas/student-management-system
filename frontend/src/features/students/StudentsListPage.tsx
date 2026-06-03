import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { GET_STUDENTS, DELETE_STUDENT } from '../../graphql/operations';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import ConfirmModal from '../../components/ConfirmModal';

const StudentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
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
  if (error) return <ErrorMessage message={error.message} onRetry={() => refetch()} />;

  const students = data?.students;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <Link
          to="/students/create"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          + Add Student
        </Link>
      </div>

      <div className="mb-4">
        <SearchBar
          value={search}
          onChange={(v) => { setSearch(v); setPage(1); }}
          placeholder="Search students..."
        />
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {students?.data?.length === 0 ? (
          <EmptyState
            title="No students found"
            description="Get started by adding your first student."
            actionLabel="Add Student"
            onAction={() => navigate('/students/create')}
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Student #</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Email</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {students?.data?.map((student: any) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{student.studentNumber}</td>
                      <td className="px-4 py-3">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="px-4 py-3 text-gray-500">{student.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link
                            to={`/students/${student.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            View
                          </Link>
                          <Link
                            to={`/students/${student.id}/edit`}
                            className="text-green-600 hover:underline"
                          >
                            Edit
                          </Link>
                          <button
                            onClick={() => setDeleteId(student.id)}
                            className="text-red-600 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={students?.page ?? 1}
              totalPages={students?.totalPages ?? 1}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        onConfirm={() => deleteId && deleteStudent({ variables: { id: deleteId } })}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
};

export default StudentsListPage;
