/**
 * Main Application Component
 * Defines routing structure and layout
 */
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Components
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import RoleAuth from './pages/RoleAuth';
import StudentDashboard from './pages/StudentDashboard';
import StudentApplications from './pages/StudentApplications';
import CompanyDashboard from './pages/CompanyDashboard';
import CompanyJobApplications from './pages/CompanyJobApplications';
import AdminDashboard from './pages/AdminDashboard';

// Constants
import { ROUTES, ROLES } from './config/constants';

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check localStorage or system preference
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    // Apply dark mode class to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save preference
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col transition-colors duration-200">
      <NavBar darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
      
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path="/auth/:role" element={<RoleAuth />} />

          {/* Student Routes */}
          <Route
            path="/student/*"
            element={
              <ProtectedRoute role={ROLES.STUDENT}>
                <StudentDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path={ROUTES.STUDENT_APPLICATIONS}
            element={
              <ProtectedRoute role={ROLES.STUDENT}>
                <StudentApplications />
              </ProtectedRoute>
            }
          />

          {/* Company Routes */}
          <Route
            path="/company/*"
            element={
              <ProtectedRoute role={ROLES.COMPANY}>
                <CompanyDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/company/jobs/:jobId/applications"
            element={
              <ProtectedRoute role={ROLES.COMPANY}>
                <CompanyJobApplications />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute role={ROLES.ADMIN}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to={ROUTES.HOME} replace />} />
        </Routes>
      </main>
      
      <Footer />
    </div>
  );
}

