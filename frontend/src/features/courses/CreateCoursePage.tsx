import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_COURSE, GET_ALL_TEACHERS_SIMPLE } from '../../graphql/operations';
import LoadingSpinner from '../../components/LoadingSpinner';

const CreateCoursePage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ code: '', title: '', description: '', teacherId: '' });
  const [error, setError] = useState('');

  const { data: teachersData, loading: loadingTeachers } = useQuery(GET_ALL_TEACHERS_SIMPLE);

  const [createCourse, { loading }] = useMutation(CREATE_COURSE, {
    onCompleted: () => navigate('/courses'),
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    createCourse({ variables: { input: { ...form, description: form.description || undefined } } });
  };

  if (loadingTeachers) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Create Course</h1>
      {error && <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Course Code</label>
            <input type="text" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Title</label>
            <input type="text" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Teacher</label>
          <select required value={form.teacherId} onChange={(e) => setForm({ ...form, teacherId: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none">
            <option value="">Select a teacher</option>
            {teachersData?.teachers?.data?.map((t: any) => (
              <option key={t.id} value={t.id}>{t.firstName} {t.lastName} ({t.employeeNumber})</option>
            ))}
          </select>
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">{loading ? 'Creating...' : 'Create Course'}</button>
          <button type="button" onClick={() => navigate('/courses')} className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateCoursePage;
