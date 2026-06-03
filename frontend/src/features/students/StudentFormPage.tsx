import React, { useState, useEffect, useId } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  GET_STUDENT,
  CREATE_STUDENT,
  UPDATE_STUDENT,
} from "../../graphql/operations";
import LoadingSpinner from "../../components/LoadingSpinner";

// ─── Icons ────────────────────────────────────────────────────────────────────

const ArrowLeftIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);

const SpinnerIcon = () => (
  <svg
    className="h-4 w-4 animate-spin"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
    />
  </svg>
);

const AlertIcon = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className="shrink-0"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

// ─── Reusable Form Field ──────────────────────────────────────────────────────

interface FormFieldProps {
  label: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  type = "text",
  required = false,
  value,
  onChange,
  placeholder,
}) => {
  const id = useId();

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
        {required && (
          <span className="ml-0.5 text-red-400" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-gray-300 bg-gray-50/50 px-3.5 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 transition-colors duration-150 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:outline-none"
      />
    </div>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const StudentFormPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [form, setForm] = useState({
    studentNumber: "",
    firstName: "",
    lastName: "",
    email: "",
  });
  const [error, setError] = useState("");

  // ── Fetch existing student data (edit mode only) ──
  const { data, loading: fetching } = useQuery(GET_STUDENT, {
    variables: { id },
    skip: !isEditMode,
  });

  useEffect(() => {
    if (data?.student) {
      const s = data.student;
      setForm({
        studentNumber: s.studentNumber,
        firstName: s.firstName,
        lastName: s.lastName,
        email: s.email,
      });
    }
  }, [data]);

  // ── Mutations ──
  const [updateStudent, { loading: updating }] = useMutation(UPDATE_STUDENT, {
    onCompleted: () => navigate(`/students/${id}`),
    onError: (err) => setError(err.message),
  });

  const [createStudent, { loading: creating }] = useMutation(CREATE_STUDENT, {
    onCompleted: () => navigate("/students"),
    onError: (err) => setError(err.message),
  });

  const loading = updating || creating;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (isEditMode) {
      updateStudent({ variables: { id, input: form } });
    } else {
      createStudent({ variables: { input: form } });
    }
  };

  if (isEditMode && fetching) return <LoadingSpinner />;

  // ── Dynamic text based on mode ──
  const pageTitle = isEditMode ? "Edit Student" : "Create Student";
  const pageDescription = isEditMode
    ? "Update the student's personal information below."
    : "Fill in the details to register a new student.";
  const backLink = isEditMode ? `/students/${id}` : "/students";
  const backLabel = isEditMode ? "Back to Student" : "Back to Students";
  const errorTitle = isEditMode ? "Update failed" : "Creation failed";
  const submitLabel = isEditMode
    ? loading
      ? "Saving…"
      : "Save Changes"
    : loading
      ? "Creating…"
      : "Create Student";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* ── Breadcrumb ── */}
      <nav aria-label="Breadcrumb">
        <Link
          to={backLink}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-900 focus-visible:outline-none focus-visible:underline"
        >
          <ArrowLeftIcon />
          {backLabel}
        </Link>
      </nav>

      {/* ── Page Header ── */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
          {pageTitle}
        </h1>
        <p className="mt-1 text-sm text-gray-500">{pageDescription}</p>
      </div>

      {/* ── Error Alert ── */}
      <div aria-live="polite">
        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <AlertIcon />
            <div>
              <p className="font-medium">{errorTitle}</p>
              <p className="mt-0.5 text-red-600">{error}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Form Card ── */}
      <form
        onSubmit={handleSubmit}
        aria-busy={loading}
        className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200/60"
      >
        {/* Card Header */}
        <div className="border-b border-gray-100 px-5 py-4 sm:px-6">
          <h2 className="text-sm font-semibold text-gray-900">
            Personal Information
          </h2>
        </div>

        {/* Card Body */}
        <div className="space-y-5 px-5 py-6 sm:px-6">
          <FormField
            label="Student Number"
            required
            value={form.studentNumber}
            onChange={(v) => setForm({ ...form, studentNumber: v })}
            placeholder="e.g. STU-2025-001"
          />

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField
              label="First Name"
              required
              value={form.firstName}
              onChange={(v) => setForm({ ...form, firstName: v })}
              placeholder="John"
            />
            <FormField
              label="Last Name"
              required
              value={form.lastName}
              onChange={(v) => setForm({ ...form, lastName: v })}
              placeholder="Doe"
            />
          </div>

          <FormField
            label="Email Address"
            type="email"
            required
            value={form.email}
            onChange={(v) => setForm({ ...form, email: v })}
            placeholder="john.doe@example.com"
          />
        </div>

        {/* Card Footer */}
        <div className="flex items-center justify-end gap-3 border-t border-gray-100 bg-gray-50/50 px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={() => navigate(backLink)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading && <SpinnerIcon />}
            {submitLabel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default StudentFormPage;
