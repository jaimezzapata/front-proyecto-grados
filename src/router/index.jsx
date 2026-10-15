import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { useAuth } from '../core/context/AuthContext';
import { Button } from '../core/components/Button';
import { PageLoader } from '../core/components/Loader';
import { LogOut, GraduationCap, Sparkles } from 'lucide-react';

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
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      fontFamily: 'var(--font-family)',
      padding: '24px 32px'
    }}>
      <header style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: 'var(--border-width) solid var(--border-color)',
        paddingBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '36px',
            height: '36px',
            backgroundColor: 'var(--primary-color)',
            color: 'var(--primary-contrast)',
            borderRadius: 'var(--border-radius-sm)'
          }}>
            <GraduationCap size={20} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.25rem' }}>
            Z-SUITE
          </span>
        </div>

        <div>
          <Button variant="outline" size="sm" icon={<LogOut size={16} />} onClick={logout}>
            Cerrar Sesión
          </Button>
        </div>
      </header>

      <main style={{ maxWidth: '800px', margin: '40px auto', textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '6px 14px',
          backgroundColor: 'var(--badge-bg)',
          color: 'var(--badge-text)',
          borderRadius: '999px',
          fontSize: '0.85rem',
          fontWeight: 700,
          marginBottom: '16px'
        }}>
          <Sparkles size={16} />
          <span>Sesión Activa</span>
        </div>

        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 800, margin: '0 0 12px' }}>
          ¡Bienvenido, Profesor {user?.nombres}!
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: 1.5, margin: '0 0 32px' }}>
          Has iniciado sesión correctamente con el rol de <strong>{user?.rol || 'DOCENTE'}</strong>. El módulo de autenticación y registro está completamente conectado y operativo.
        </p>

        <div style={{
          backgroundColor: 'var(--bg-surface)',
          border: 'var(--border-width) solid var(--border-color)',
          borderRadius: 'var(--border-radius)',
          boxShadow: 'var(--shadow-main)',
          padding: '24px',
          textAlign: 'left'
        }}>
          <h3 style={{ margin: '0 0 8px', fontSize: '1.1rem' }}>Módulo 1: Autenticación y Contexto</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0 }}>
            Puedes probar el selector de temas visuales en la esquina superior derecha (Minimalismo, Neobrutalismo, Pop Art, Memphis y Cyber Neón en modo claro y oscuro) para ver cómo muta la interfaz en tiempo real.
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
