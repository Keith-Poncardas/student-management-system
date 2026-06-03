import React from 'react';
import { useQuery } from '@apollo/client';
import { useParams, Link } from 'react-router-dom';
import { GET_TEACHER } from '../../graphql/operations';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage';

const TeacherDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, loading, error, refetch } = useQuery(GET_TEACHER, { variables: { id } });

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} onRetry={() => refetch()} />;

  const teacher = data?.teacher;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Teacher Details</h1>
        <div className="flex gap-2">
          <Link to={`/teachers/${id}/edit`} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700">Edit</Link>
          <Link to="/teachers" className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Back</Link>
        </div>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">Employee Number</p>
            <p className="font-medium">{teacher?.employeeNumber}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-medium">{teacher?.email}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">First Name</p>
            <p className="font-medium">{teacher?.firstName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Last Name</p>
            <p className="font-medium">{teacher?.lastName}</p>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-lg bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Courses</h2>
        {teacher?.courses?.length === 0 ? (
          <p className="text-sm text-gray-500">No courses assigned.</p>
        ) : (
          <div className="space-y-3">
            {teacher?.courses?.map((course: any) => (
              <div key={course.id} className="rounded border border-gray-200 p-3">
                <Link to={`/courses/${course.id}`} className="font-medium text-blue-600 hover:underline">
                  {course.code} - {course.title}
                </Link>
                <p className="mt-1 text-xs text-gray-500">{course.enrollments?.length ?? 0} enrolled students</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherDetailPage;
