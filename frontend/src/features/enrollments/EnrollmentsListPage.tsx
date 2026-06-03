import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { GET_ENROLLMENTS, DELETE_ENROLLMENT } from '../../graphql/operations';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import ConfirmModal from '../../components/ConfirmModal';

const EnrollmentsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_ENROLLMENTS, {
    variables: { search: search || undefined, page, limit: 10 },
  });

  const [deleteEnrollment, { loading: deleting }] = useMutation(DELETE_ENROLLMENT, {
    onCompleted: () => { setDeleteId(null); refetch(); },
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} onRetry={() => refetch()} />;

  const enrollments = data?.enrollments;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Enrollments</h1>
        <Link to="/enrollments/create" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          + Create Enrollment
        </Link>
      </div>

      <div className="mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search enrollments..." />
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {enrollments?.data?.length === 0 ? (
          <EmptyState title="No enrollments found" actionLabel="Create Enrollment" onAction={() => navigate('/enrollments/create')} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Student</th>
                    <th className="px-4 py-3">Course</th>
                    <th className="px-4 py-3">Teacher</th>
                    <th className="px-4 py-3">Grade</th>
                    <th className="px-4 py-3">Enrolled</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {enrollments?.data?.map((enrollment: any) => (
                    <tr key={enrollment.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link to={`/students/${enrollment.student.id}`} className="text-blue-600 hover:underline">
                          {enrollment.student.firstName} {enrollment.student.lastName}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link to={`/courses/${enrollment.course.id}`} className="text-blue-600 hover:underline">
                          {enrollment.course.code} - {enrollment.course.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {enrollment.course.teacher?.firstName} {enrollment.course.teacher?.lastName}
                      </td>
                      <td className="px-4 py-3">
                        {enrollment.grade ? enrollment.grade.grade : <span className="text-gray-400">N/A</span>}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {new Date(Number(enrollment.enrolledAt)).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3">
                        <button onClick={() => setDeleteId(enrollment.id)} className="text-red-600 hover:underline">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={enrollments?.page ?? 1} totalPages={enrollments?.totalPages ?? 1} onPageChange={setPage} />
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Enrollment"
        message="Are you sure? This will also delete the associated grade."
        onConfirm={() => deleteId && deleteEnrollment({ variables: { id: deleteId } })}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
};

export default EnrollmentsListPage;
