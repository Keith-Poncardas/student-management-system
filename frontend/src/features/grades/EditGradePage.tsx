import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_GRADE, UPDATE_GRADE } from '../../graphql/operations';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditGradePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({ grade: '', remarks: '' });
  const [error, setError] = useState('');
  const [enrollmentLabel, setEnrollmentLabel] = useState('');

  const { data, loading: fetching } = useQuery(GET_GRADE, { variables: { id } });

  useEffect(() => {
    if (data?.grade) {
      const g = data.grade;
      setForm({ grade: String(g.grade), remarks: g.remarks || '' });
      setEnrollmentLabel(
        `${g.enrollment.student.firstName} ${g.enrollment.student.lastName} → ${g.enrollment.course.code} - ${g.enrollment.course.title}`
      );
    }
  }, [data]);

  const [updateGrade, { loading }] = useMutation(UPDATE_GRADE, {
    onCompleted: () => navigate('/grades'),
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    updateGrade({
      variables: {
        id,
        input: {
          grade: parseFloat(form.grade),
          remarks: form.remarks || null,
        },
      },
    });
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Grade</h1>
      {error && <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Enrollment</label>
          <p className="rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-700">{enrollmentLabel}</p>
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
          <button type="submit" disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">{loading ? 'Saving...' : 'Save Changes'}</button>
          <button type="button" onClick={() => navigate('/grades')} className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditGradePage;
