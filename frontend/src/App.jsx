import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layouts
import AdminLayout from './components/AdminLayout';
import StudentLayout from './components/StudentLayout';

// Pages
import Login from './pages/Login';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import StudentManagement from './pages/admin/StudentManagement';
import StudentDetail from './pages/admin/StudentDetail';
import DepartmentManagement from './pages/admin/DepartmentManagement';
import ClassroomManagement from './pages/admin/ClassroomManagement';
import UserManagement from './pages/admin/UserManagement';

// Student Pages
import StudentDashboard from './pages/student/StudentDashboard';
import MyProfile from './pages/student/MyProfile';
import AcademicDepartments from './pages/student/AcademicDepartments';
import ClassroomsStudySpaces from './pages/student/ClassroomsStudySpaces';
import MyAccountSettings from './pages/student/MyAccountSettings';

// Protected Route Guard
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Role mismatch: redirect to their respective default home page
    return user.role === 'ADMIN' 
      ? <Navigate to="/admin/dashboard" replace /> 
      : <Navigate to="/student/dashboard" replace />;
  }

  return children;
};

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          
          {/* Admin Protected Portal */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="students/:id" element={<StudentDetail />} />
            <Route path="departments" element={<DepartmentManagement />} />
            <Route path="classrooms" element={<ClassroomManagement />} />
            <Route path="users" element={<UserManagement />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Student Protected Portal */}
          <Route 
            path="/student" 
            element={
              <ProtectedRoute allowedRoles={['USER']}>
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="departments" element={<AcademicDepartments />} />
            <Route path="classrooms" element={<ClassroomsStudySpaces />} />
            <Route path="settings" element={<MyAccountSettings />} />
            <Route index element={<Navigate to="dashboard" replace />} />
          </Route>

          {/* Fallback routes */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
