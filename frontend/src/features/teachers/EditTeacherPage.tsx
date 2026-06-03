import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useNavigate, useParams } from 'react-router-dom';
import { GET_TEACHER, UPDATE_TEACHER } from '../../graphql/operations';
import LoadingSpinner from '../../components/LoadingSpinner';

const EditTeacherPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [form, setForm] = useState({ employeeNumber: '', firstName: '', lastName: '', email: '' });
  const [error, setError] = useState('');

  const { data, loading: fetching } = useQuery(GET_TEACHER, { variables: { id } });

  useEffect(() => {
    if (data?.teacher) {
      const t = data.teacher;
      setForm({ employeeNumber: t.employeeNumber, firstName: t.firstName, lastName: t.lastName, email: t.email });
    }
  }, [data]);

  const [updateTeacher, { loading }] = useMutation(UPDATE_TEACHER, {
    onCompleted: () => navigate(`/teachers/${id}`),
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    updateTeacher({ variables: { id, input: form } });
  };

  if (fetching) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Edit Teacher</h1>
      {error && <div className="mb-4 rounded border border-red-200 bg-red-50 p-3 text-sm text-red-600">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Employee Number</label>
          <input type="text" required value={form.employeeNumber} onChange={(e) => setForm({ ...form, employeeNumber: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">First Name</label>
            <input type="text" required value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Last Name</label>
            <input type="text" required value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
          <input type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
        </div>
        <div className="flex gap-3 pt-4">
          <button type="submit" disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">{loading ? 'Saving...' : 'Save Changes'}</button>
          <button type="button" onClick={() => navigate(`/teachers/${id}`)} className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default EditTeacherPage;
