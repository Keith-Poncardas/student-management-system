import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Link, useNavigate } from 'react-router-dom';
import { GET_COURSES, DELETE_COURSE } from '../../graphql/operations';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';
import EmptyState from '../../components/EmptyState';
import Pagination from '../../components/Pagination';
import SearchBar from '../../components/SearchBar';
import ConfirmModal from '../../components/ConfirmModal';

const CoursesListPage: React.FC = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, loading, error, refetch } = useQuery(GET_COURSES, {
    variables: { search: search || undefined, page, limit: 10 },
  });

  const [deleteCourse, { loading: deleting }] = useMutation(DELETE_COURSE, {
    onCompleted: () => { setDeleteId(null); refetch(); },
  });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} onRetry={() => refetch()} />;

  const courses = data?.courses;

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
        <Link to="/courses/create" className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
          + Add Course
        </Link>
      </div>

      <div className="mb-4">
        <SearchBar value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search courses..." />
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm">
        {courses?.data?.length === 0 ? (
          <EmptyState title="No courses found" actionLabel="Add Course" onAction={() => navigate('/courses/create')} />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                  <tr>
                    <th className="px-4 py-3">Code</th>
                    <th className="px-4 py-3">Title</th>
                    <th className="px-4 py-3">Teacher</th>
                    <th className="px-4 py-3">Students</th>
                    <th className="px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {courses?.data?.map((course: any) => (
                    <tr key={course.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium">{course.code}</td>
                      <td className="px-4 py-3">{course.title}</td>
                      <td className="px-4 py-3 text-gray-500">{course.teacher?.firstName} {course.teacher?.lastName}</td>
                      <td className="px-4 py-3">{course.enrollments?.length ?? 0}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <Link to={`/courses/${course.id}`} className="text-blue-600 hover:underline">View</Link>
                          <Link to={`/courses/${course.id}/edit`} className="text-green-600 hover:underline">Edit</Link>
                          <button onClick={() => setDeleteId(course.id)} className="text-red-600 hover:underline">Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={courses?.page ?? 1} totalPages={courses?.totalPages ?? 1} onPageChange={setPage} />
          </>
        )}
      </div>

      <ConfirmModal
        isOpen={!!deleteId}
        title="Delete Course"
        message="Are you sure? This will also delete all related enrollments and grades."
        onConfirm={() => deleteId && deleteCourse({ variables: { id: deleteId } })}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  );
};

export default CoursesListPage;
