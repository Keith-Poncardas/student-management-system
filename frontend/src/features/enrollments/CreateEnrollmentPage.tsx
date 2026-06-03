import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_ENROLLMENT, GET_ALL_STUDENTS_SIMPLE, GET_ALL_COURSES_SIMPLE } from '../../graphql/operations';
import LoadingSpinner from '../../components/LoadingSpinner';

const CreateEnrollmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ studentId: '', courseId: '' });
  const [error, setError] = useState('');

  const { data: studentsData, loading: loadingStudents } = useQuery(GET_ALL_STUDENTS_SIMPLE);
  const { data: coursesData, loading: loadingCourses } = useQuery(GET_ALL_COURSES_SIMPLE);

  const [createEnrollment, { loading }] = useMutation(CREATE_ENROLLMENT, {
    onCompleted: () => navigate('/enrollments'),
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    createEnrollment({ variables: { input: form } });
  };

  if (loadingStudents || loadingCourses) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Create Enrollment</h1>
      {error && <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Student</label>
          <select required value={form.studentId} onChange={(e) => setForm({ ...form, studentId: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none">
            <option value="">Select a student</option>
            {studentsData?.students?.data?.map((s: any) => (
              <option key={s.id} value={s.id}>{s.firstName} {s.lastName} ({s.studentNumber})</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Course</label>
          <select required value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none">
            <option value="">Select a course</option>
            {coursesData?.courses?.data?.map((c: any) => (
              <option key={c.id} value={c.id}>{c.code} - {c.title}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">{loading ? 'Creating...' : 'Create Enrollment'}</button>
          <button type="button" onClick={() => navigate('/enrollments')} className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateEnrollmentPage;
