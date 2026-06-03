import React from 'react';
import { useQuery } from '@apollo/client';
import { DASHBOARD_STATS } from '../graphql/operations';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const DashboardPage: React.FC = () => {
  const { data, loading, error, refetch } = useQuery(DASHBOARD_STATS);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error.message} onRetry={() => refetch()} />;

  const stats = data?.dashboardStats;

  const cards = [
    { label: 'Total Students', value: stats?.totalStudents ?? 0, color: 'bg-blue-500' },
    { label: 'Total Teachers', value: stats?.totalTeachers ?? 0, color: 'bg-green-500' },
    { label: 'Total Courses', value: stats?.totalCourses ?? 0, color: 'bg-purple-500' },
    { label: 'Total Enrollments', value: stats?.totalEnrollments ?? 0, color: 'bg-orange-500' },
    { label: 'Total Grades', value: stats?.totalGrades ?? 0, color: 'bg-pink-500' },
  ];

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="rounded-lg bg-white p-5 shadow-sm">
            <div className={`mb-2 inline-block rounded px-2 py-1 text-xs font-medium text-white ${card.color}`}>
              {card.label}
            </div>
            <div className="text-3xl font-bold text-gray-900">{card.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Students */}
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Students</h2>
          {stats?.recentStudents?.length === 0 ? (
            <p className="text-sm text-gray-500">No students yet.</p>
          ) : (
            <div className="space-y-3">
              {stats?.recentStudents?.map((student: any) => (
                <div key={student.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-xs text-gray-500">{student.studentNumber}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(Number(student.createdAt)).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Enrollments */}
        <div className="rounded-lg bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Recent Enrollments</h2>
          {stats?.recentEnrollments?.length === 0 ? (
            <p className="text-sm text-gray-500">No enrollments yet.</p>
          ) : (
            <div className="space-y-3">
              {stats?.recentEnrollments?.map((enrollment: any) => (
                <div key={enrollment.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {enrollment.student.firstName} {enrollment.student.lastName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {enrollment.course.code} - {enrollment.course.title}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(Number(enrollment.enrolledAt)).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
