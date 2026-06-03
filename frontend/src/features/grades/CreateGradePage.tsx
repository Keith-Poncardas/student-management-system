import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_GRADE, GET_ENROLLMENTS_WITHOUT_GRADE } from '../../graphql/operations';
import LoadingSpinner from '../../components/LoadingSpinner';

const CreateGradePage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ enrollmentId: '', grade: '', remarks: '' });
  const [error, setError] = useState('');

  const { data: enrollmentsData, loading: loadingEnrollments } = useQuery(GET_ENROLLMENTS_WITHOUT_GRADE);

  const [createGrade, { loading }] = useMutation(CREATE_GRADE, {
    onCompleted: () => navigate('/grades'),
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    createGrade({
      variables: {
        input: {
          enrollmentId: form.enrollmentId,
          grade: parseFloat(form.grade),
          remarks: form.remarks || undefined,
        },
      },
    });
  };

  if (loadingEnrollments) return <LoadingSpinner />;

  // Filter to show only enrollments without grades
  const availableEnrollments = enrollmentsData?.enrollments?.data?.filter((e: any) => !e.grade) ?? [];

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Assign Grade</h1>
      {error && <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Enrollment</label>
          <select required value={form.enrollmentId} onChange={(e) => setForm({ ...form, enrollmentId: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none">
            <option value="">Select an enrollment</option>
            {availableEnrollments.map((enrollment: any) => (
              <option key={enrollment.id} value={enrollment.id}>
                {enrollment.student.firstName} {enrollment.student.lastName} → {enrollment.course.code} - {enrollment.course.title}
              </option>
            ))}
          </select>
          {availableEnrollments.length === 0 && (
            <p className="mt-1 text-xs text-gray-500">All enrollments already have grades assigned.</p>
          )}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Grade (0-100)</label>
          <input type="number" required min="0" max="100" step="0.1" value={form.grade} onChange={(e) => setForm({ ...form, grade: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Remarks</label>
          <textarea value={form.remarks} onChange={(e) => setForm({ ...form, remarks: e.target.value })} rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">{loading ? 'Assigning...' : 'Assign Grade'}</button>
          <button type="button" onClick={() => navigate('/grades')} className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateGradePage;
