import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import ProtectedRoute from './routes/ProtectedRoute';

// Auth
import LoginPage from './features/auth/LoginPage';
import SignupPage from './features/auth/SignupPage';

// Dashboard
import DashboardPage from './pages/DashboardPage';

// Students
import StudentsListPage from './features/students/StudentsListPage';
import CreateStudentPage from './features/students/CreateStudentPage';
import EditStudentPage from './features/students/EditStudentPage';
import StudentDetailPage from './features/students/StudentDetailPage';

// Teachers
import TeachersListPage from './features/teachers/TeachersListPage';
import CreateTeacherPage from './features/teachers/CreateTeacherPage';
import EditTeacherPage from './features/teachers/EditTeacherPage';
import TeacherDetailPage from './features/teachers/TeacherDetailPage';

// Courses
import CoursesListPage from './features/courses/CoursesListPage';
import CreateCoursePage from './features/courses/CreateCoursePage';
import EditCoursePage from './features/courses/EditCoursePage';
import CourseDetailPage from './features/courses/CourseDetailPage';

// Enrollments
import EnrollmentsListPage from './features/enrollments/EnrollmentsListPage';
import CreateEnrollmentPage from './features/enrollments/CreateEnrollmentPage';

// Grades
import GradesListPage from './features/grades/GradesListPage';
import CreateGradePage from './features/grades/CreateGradePage';
import EditGradePage from './features/grades/EditGradePage';

const App: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />

          {/* Students */}
          <Route path="/students" element={<StudentsListPage />} />
          <Route path="/students/create" element={<CreateStudentPage />} />
          <Route path="/students/:id" element={<StudentDetailPage />} />
          <Route path="/students/:id/edit" element={<EditStudentPage />} />

          {/* Teachers */}
          <Route path="/teachers" element={<TeachersListPage />} />
          <Route path="/teachers/create" element={<CreateTeacherPage />} />
          <Route path="/teachers/:id" element={<TeacherDetailPage />} />
          <Route path="/teachers/:id/edit" element={<EditTeacherPage />} />

          {/* Courses */}
          <Route path="/courses" element={<CoursesListPage />} />
          <Route path="/courses/create" element={<CreateCoursePage />} />
          <Route path="/courses/:id" element={<CourseDetailPage />} />
          <Route path="/courses/:id/edit" element={<EditCoursePage />} />

          {/* Enrollments */}
          <Route path="/enrollments" element={<EnrollmentsListPage />} />
          <Route path="/enrollments/create" element={<CreateEnrollmentPage />} />

          {/* Grades */}
          <Route path="/grades" element={<GradesListPage />} />
          <Route path="/grades/create" element={<CreateGradePage />} />
          <Route path="/grades/:id/edit" element={<EditGradePage />} />
        </Route>
      </Route>

      {/* Redirect root to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default App;
