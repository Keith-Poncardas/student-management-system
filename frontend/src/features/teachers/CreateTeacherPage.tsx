import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { CREATE_TEACHER } from '../../graphql/operations';

const CreateTeacherPage: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ employeeNumber: '', firstName: '', lastName: '', email: '' });
  const [error, setError] = useState('');

  const [createTeacher, { loading }] = useMutation(CREATE_TEACHER, {
    onCompleted: () => navigate('/teachers'),
    onError: (err) => setError(err.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    createTeacher({ variables: { input: form } });
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Create Teacher</h1>
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
          <button type="submit" disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50">{loading ? 'Creating...' : 'Create Teacher'}</button>
          <button type="button" onClick={() => navigate('/teachers')} className="rounded-md border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </div>
  );
};

export default CreateTeacherPage;
