import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import AppLayout from '../layouts/AppLayout';
import ProtectedRoute from '../layouts/ProtectedRoute';

import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import DashboardPage from '../pages/dashboard/DashboardPage';
import ProjectListPage from '../pages/projects/ProjectListPage';
import ProjectDetailsPage from '../pages/projects/ProjectDetailsPage';
import TaskListPage from '../pages/tasks/TaskListPage';
import TaskDetailsPage from '../pages/tasks/TaskDetailsPage';
import UserManagementPage from '../pages/users/UserManagementPage';
import ProjectExplanationPage from '../pages/project-explanation/ProjectExplanationPage';
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>

      {/* Authenticated Workspace Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectListPage />} />
          <Route path="/projects/:id" element={<ProjectDetailsPage />} />
          <Route path="/tasks" element={<TaskListPage />} />
          <Route path="/tasks/:id" element={<TaskDetailsPage />} />

          {/* Admin and Project Manager Directory */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['admin', 'project_manager']}>
                <UserManagementPage />
              </ProtectedRoute>
            }
          />

          {/* Password-Protected Explanation View */}
          <Route path="/project-explanation" element={<ProjectExplanationPage />} />
        </Route>
      </Route>

      {/* Fallback 404 Route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
