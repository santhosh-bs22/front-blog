import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import UserDashboardPage from '@/pages/user/Dashboard/UserDashboardPage';
import CreateBlogPage from '@/pages/user/Blog/CreateBlogPage';
import EditBlogPage from '@/pages/user/Blog/EditBlogPage';
import DraftsPage from '@/pages/user/Drafts/DraftsPage';
import EditProfilePage from '@/pages/user/Profile/EditProfilePage';

const PrivateRoutes: React.FC = () => {
  return (
    <Routes>
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requiredRole="user">
            <UserDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blog/create"
        element={
          <ProtectedRoute requiredRole="user">
            <CreateBlogPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/blog/edit/:id"
        element={
          <ProtectedRoute requiredRole="user">
            <EditBlogPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/drafts"
        element={
          <ProtectedRoute requiredRole="user">
            <DraftsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile/edit"
        element={
          <ProtectedRoute requiredRole="user">
            <EditProfilePage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default PrivateRoutes;