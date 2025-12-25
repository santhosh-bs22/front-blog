import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from '@/pages/public/Home/HomePage';
import BlogDetailPage from '@/pages/public/BlogDetail/BlogDetailPage';
import AuthorProfilePage from '@/pages/public/AuthorProfile/AuthorProfilePage';
import LoginPage from '@/pages/auth/LoginPage';
import RegisterPage from '@/pages/auth/RegisterPage';
import ForgotPasswordPage from '@/pages/auth/ForgotPasswordPage';
import NotFoundPage from '@/pages/public/Error/NotFoundPage';

const PublicRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/blog/:slug" element={<BlogDetailPage />} />
      <Route path="/author/:userId" element={<AuthorProfilePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default PublicRoutes;