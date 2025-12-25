import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import AdminLayout from '@/components/layout/AdminLayout';
import AdminDashboardPage from '@/pages/admin/Dashboard/AdminDashboardPage';
import BlogManagementPage from '@/pages/admin/BlogManagement/BlogManagementPage';
import UserManagementPage from '@/pages/admin/UserManagement/UserManagementPage';
import CategoryManagementPage from '@/pages/admin/Categories/CategoryManagementPage';
import CommentModerationPage from '@/pages/admin/Comments/CommentModerationPage';
import AdminSettingsPage from '@/pages/admin/Settings/AdminSettingsPage';

const AdminRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="blogs" element={<BlogManagementPage />} />
        <Route path="users" element={<UserManagementPage />} />
        <Route path="categories" element={<CategoryManagementPage />} />
        <Route path="comments" element={<CommentModerationPage />} />
        <Route path="settings" element={<AdminSettingsPage />} />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;