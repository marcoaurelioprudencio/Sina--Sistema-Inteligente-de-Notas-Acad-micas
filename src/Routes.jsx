import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import ProtectedRoute from "components/ProtectedRoute";
// Add your imports here
import Dashboard from "components/Dashboard";
import StudentPerformanceOverviewDashboard from "pages/student-performance-overview-dashboard";
import IndividualStudentAnalyticsDashboard from "pages/individual-student-analytics-dashboard";
import SubjectPerformanceAnalyticsDashboard from "pages/subject-performance-analytics-dashboard";
import AttendanceMonitoringDashboard from "pages/attendance-monitoring-dashboard";
import LoginPage from "pages/LoginPage";
import StudentManagement from "pages/StudentManagement";
import GradeManagement from "pages/GradeManagement";
import DisciplinesPage from "pages/DisciplinesPage";
import SettingsPage from "pages/SettingsPage";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected routes */}
        <Route path="/" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        <Route path="/student-performance-overview-dashboard" element={
          <ProtectedRoute>
            <StudentPerformanceOverviewDashboard />
          </ProtectedRoute>
        } />
        <Route path="/individual-student-analytics-dashboard" element={
          <ProtectedRoute>
            <IndividualStudentAnalyticsDashboard />
          </ProtectedRoute>
        } />
        <Route path="/disciplinas" element={
          <ProtectedRoute>
            <DisciplinesPage />
          </ProtectedRoute>
        } />
        <Route path="/attendance-monitoring-dashboard" element={
          <ProtectedRoute>
            <AttendanceMonitoringDashboard />
          </ProtectedRoute>
        } />
        <Route path="/student-management" element={
          <ProtectedRoute>
            <StudentManagement />
          </ProtectedRoute>
        } />
        <Route path="/grade-management" element={
          <ProtectedRoute>
            <GradeManagement />
          </ProtectedRoute>
        } />
        <Route path="/settings" element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        } />
        
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;