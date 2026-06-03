import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { GET_COURSE } from '../../graphql/operations';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const CourseDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, refetch } = useQuery(GET_COURSE, { variables: { id } });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} onRetry={() => refetch()} />;

  const course = data?.course;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Course Details</h1>
        <div className="flex gap-2">
          <Link to={`/courses/${id}/edit`} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Edit</Link>
          <Link to="/courses" className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Back</Link>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">Code</p>
            <p className="font-medium">{course?.code}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Title</p>
            <p className="font-medium">{course?.title}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Teacher</p>
            <p className="font-medium">{course?.teacher?.firstName} {course?.teacher?.lastName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Description</p>
            <p className="font-medium">{course?.description || 'N/A'}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Enrolled Students ({course?.enrollments?.length ?? 0})</h2>
        {course?.enrollments?.length === 0 ? (
          <p className="text-sm text-gray-500">No students enrolled yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Student #</th>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3">Enrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {course?.enrollments?.map((enrollment: any) => (
                  <tr key={enrollment.id}>
                    <td className="px-4 py-3">{enrollment.student?.studentNumber}</td>
                    <td className="px-4 py-3">
                      <Link to={`/students/${enrollment.student?.id}`} className="text-blue-600 hover:underline">
                        {enrollment.student?.firstName} {enrollment.student?.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-3">{enrollment.grade ? enrollment.grade.grade : <span className="text-gray-400">N/A</span>}</td>
                    <td className="px-4 py-3 text-gray-500">{new Date(Number(enrollment.enrolledAt)).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetailPage;
