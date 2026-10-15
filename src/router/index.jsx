import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { useAuth } from '../core/context/AuthContext';
import { Button } from '../core/components/Button';
import { PageLoader } from '../core/components/Loader';
import { Avatar } from '../core/components/Avatar';
import { getUserFullName } from '../core/utils/userUtils';
import { LogOut, GraduationCap } from 'lucide-react';
import '../core/layout/dashboard.css';

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
 * Vista provisional de bienvenida tras autenticación
 */
const DashboardView = () => {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <div className="dashboard-brand">
          <div className="dashboard-brand__icon">
            <GraduationCap size={20} />
          </div>
          <span className="dashboard-brand__title">
            Z-SUITE
          </span>
        </div>

        <div className="dashboard-actions">
          <Avatar user={user} size="sm" showDetails />
          <Button
            variant="outline"
            size="sm"
            className="dashboard-logout-btn"
            icon={<LogOut size={16} />}
            onClick={logout}
          >
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome-avatar">
          <Avatar user={user} size="lg" />
        </div>

        <h1 className="dashboard-title">
          ¡Bienvenido, {getUserFullName(user)}!
        </h1>
        <p className="dashboard-subtitle">
          Has iniciado sesión correctamente con el rol de <strong>{user?.rol || 'DOCENTE'}</strong>.
        </p>

        <div className="dashboard-card">
          <h3 className="dashboard-card__title">Módulo 1: Autenticación y Contexto</h3>
          <p className="dashboard-card__desc">
            Puedes probar el selector flotante de estilos visuales (Minimalismo, Neobrutalismo, Pop Art, Memphis y Cyber Neón en modo claro y oscuro) para personalizar la interfaz en tiempo real.
          </p>
        </div>
      </main>
    </div>
  );
};

/**
 * Enrutamiento basado en objetos (React Router v6.4+ Data API)
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
    path: '/dashboard',
    element: (
      <ProtectedRoute>
        <DashboardView />
      </ProtectedRoute>
    )
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
]);
