import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { LoginPage } from '../features/auth/pages/LoginPage';
import { RegisterPage } from '../features/auth/pages/RegisterPage';
import { useAuth } from '../core/context/AuthContext';
import { Button } from '../core/components/Button';
import { PageLoader } from '../core/components/Loader';
import { Avatar } from '../core/components/Avatar';
import { getUserFullName } from '../core/utils/userUtils';
import { LogOut, GraduationCap, Menu } from 'lucide-react';
import '../core/layout/dashboard.css';
import { AcademicProvider } from '../features/academic-context/context/AcademicContext';
import { AcademicWorkspace } from '../features/academic-context/pages/AcademicWorkspace';
import { DashboardSidebar } from '../core/layout/DashboardSidebar';
import { DashboardStatsCards } from '../core/layout/DashboardStatsCards';
import { ManageProgramsModal } from '../features/academic-context/components/ManageProgramsModal';
import { LinkCourseModal } from '../features/academic-context/components/LinkCourseModal';

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
 * Vista principal del Panel de Control (Command Center con Menú Lateral Izquierdo Fijo y Cards)
 */
const DashboardView = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [isProgramsModalOpen, setIsProgramsModalOpen] = React.useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = React.useState(false);

  return (
    <AcademicProvider>
      <div className="dashboard-layout">
        {/* Cabecera Principal FIJA SUPERIOR (Sticky Top) */}
        <header className="dashboard-header-fixed">
          <div className="dashboard-header-inner">
            <div className="dashboard-brand">
              <div className="dashboard-brand__icon">
                <GraduationCap size={20} />
              </div>
              <span className="dashboard-brand__title">
                Z-SUITE <span style={{ color: 'var(--primary-color)', fontSize: '0.9em' }}>| CESDE</span>
              </span>
            </div>

            <div className="dashboard-actions">
              {/* Botón para abrir el panel lateral en móviles/tablets */}
              <button
                type="button"
                className="dashboard-sidebar-toggle"
                onClick={() => setIsSidebarOpen(true)}
                aria-label="Abrir menú de navegación lateral"
              >
                <Menu size={18} />
                <span>Menú</span>
              </button>

              <Avatar user={user} size="sm" showDetails />
              <Button
                variant="outline"
                size="sm"
                className="dashboard-logout-btn"
                icon={<LogOut size={16} />}
                onClick={logout}
              >
                Salir
              </Button>
            </div>
          </div>
        </header>

        <div className="dashboard-container">
          {/* Cuerpo Principal del Panel: Menú Lateral Fijo a la Izquierda + Cards a la Derecha */}
          <div className="dashboard-body">
            {/* Menú Lateral Izquierdo Fijo / Sticky */}
            <DashboardSidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              onOpenProgramsModal={() => setIsProgramsModalOpen(true)}
              onOpenLinkModal={() => setIsLinkModalOpen(true)}
              onNavigateSection={(section) => {
                if (section === 'asignaturas') {
                  const el = document.getElementById('mis-asignaturas-heading');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
            />

            {/* Sección Principal con Tarjetas y Workspaces */}
            <main className="dashboard-main">
              {/* Banner de Bienvenida */}
              <div className="dashboard-welcome-banner">
                <div>
                  <h1 className="dashboard-title">
                    ¡Hola de nuevo, {getUserFullName(user)}!
                  </h1>
                  <p className="dashboard-subtitle">
                    Panel de control docente • Formación Técnica Laboral CESDE
                  </p>
                </div>
              </div>

              {/* Cards de Métricas / KPIs del Panel de Control */}
              <DashboardStatsCards
                onOpenProgramsModal={() => setIsProgramsModalOpen(true)}
                onOpenLinkModal={() => setIsLinkModalOpen(true)}
              />

              {/* Cards y Workspace interactivo de Asignaturas y Flujo Pedagógico */}
              <AcademicWorkspace />
            </main>
          </div>
        </div>

        {/* Modales globales invocables desde el menú lateral o cards */}
        <ManageProgramsModal
          isOpen={isProgramsModalOpen}
          onClose={() => setIsProgramsModalOpen(false)}
        />
        <LinkCourseModal
          isOpen={isLinkModalOpen}
          onClose={() => setIsLinkModalOpen(false)}
        />
      </div>
    </AcademicProvider>
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
