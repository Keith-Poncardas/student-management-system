import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { GET_STUDENT } from '../../graphql/operations';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const StudentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, refetch } = useQuery(GET_STUDENT, { variables: { id } });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} onRetry={() => refetch()} />;

  const student = data?.student;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Student Details</h1>
        <div className="flex gap-2">
          <Link
            to={`/students/${id}/edit`}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Edit
          </Link>
          <Link
            to="/students"
            className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">Student Number</p>
            <p className="font-medium">{student?.studentNumber}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-medium">{student?.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">First Name</p>
            <p className="font-medium">{student?.firstName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Last Name</p>
            <p className="font-medium">{student?.lastName}</p>
          </div>
        </div>
      </div>

      {/* Enrollments */}
      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Enrollments</h2>
        {student?.enrollments?.length === 0 ? (
          <p className="text-sm text-gray-500">No enrollments yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Course</th>
                  <th className="px-4 py-3">Teacher</th>
                  <th className="px-4 py-3">Grade</th>
                  <th className="px-4 py-3">Enrolled</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {student?.enrollments?.map((enrollment: any) => (
                  <tr key={enrollment.id}>
                    <td className="px-4 py-3">
                      {enrollment.course.code} - {enrollment.course.title}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {enrollment.course.teacher?.firstName} {enrollment.course.teacher?.lastName}
                    </td>
                    <td className="px-4 py-3">
                      {enrollment.grade ? (
                        <span className="font-medium">{enrollment.grade.grade}</span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(Number(enrollment.enrolledAt)).toLocaleDateString()}
                    </td>
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

export default StudentDetailPage;
