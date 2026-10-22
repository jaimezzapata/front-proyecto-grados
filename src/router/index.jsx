import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { useAuth } from '../core/context/AuthContext';
import { PageLoader } from '../core/components/Loader';
import { DashboardLayout } from '../core/layout/DashboardLayout';
import { DashboardHomePage } from '../features/academic-context/pages/DashboardHomePage';
import { CourseDetailPage } from '../features/academic-context/pages/CourseDetailPage';

/**
 * Guardia de ruta protegida para docentes autenticados
 */
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <PageLoader message="Verificando sesión..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

/**
 * Enrutamiento basado en objetos (React Router v6.4+ / v7 Data API)
 */
export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/login',
    element: <LoginPage />
  },
  {
    path: '/register',
    element: <RegisterPage />
  },
  {
    element: (
      <ProtectedRoute>
        <DashboardLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: '/dashboard',
        element: <DashboardHomePage />
      },
      {
        path: '/cursos/:id',
        element: <CourseDetailPage />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
]);
