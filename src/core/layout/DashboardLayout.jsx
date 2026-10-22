import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Avatar } from '../components/Avatar';
import { DashboardSidebar } from './DashboardSidebar';
import { ManageProgramsModal } from '../../features/academic-context/components/ManageProgramsModal';
import { LinkCourseModal } from '../../features/academic-context/components/LinkCourseModal';
import { AcademicProvider } from '../../features/academic-context/context/AcademicContext';
import { GraduationCap, Menu, LogOut } from 'lucide-react';
import './dashboard.css';

/**
 * Layout principal envolvente del panel docente (SRP & DRY)
 * Provee la cabecera fija superior, el menú lateral sticky y el contexto académico para todas las sub-rutas.
 */
export const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProgramsModalOpen, setIsProgramsModalOpen] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);

  const handleNavigateSection = (section) => {
    if (section === 'resumen') {
      navigate('/dashboard');
    } else if (section === 'asignaturas') {
      if (location.pathname !== '/dashboard') {
        navigate('/dashboard');
        setTimeout(() => {
          const el = document.getElementById('mis-asignaturas-heading');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        const el = document.getElementById('mis-asignaturas-heading');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <AcademicProvider>
      <div className="dashboard-layout">
        {/* Cabecera Principal FIJA SUPERIOR (Sticky Top) */}
        <header className="dashboard-header-fixed">
          <div className="dashboard-header-inner">
            <div
              className="dashboard-brand"
              onClick={() => navigate('/dashboard')}
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
            >
              <div className="dashboard-brand__icon">
                <GraduationCap size={20} />
              </div>
              <span className="dashboard-brand__title">
                Z-SUITE <span style={{ color: 'var(--primary-color)', fontSize: '0.9em' }}>| CESDE</span>
              </span>
            </div>

            <div className="dashboard-actions">
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
          <div className="dashboard-body">
            {/* Menú Lateral Izquierdo Fijo / Sticky */}
            <DashboardSidebar
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
              onOpenProgramsModal={() => setIsProgramsModalOpen(true)}
              onOpenLinkModal={() => setIsLinkModalOpen(true)}
              onNavigateSection={handleNavigateSection}
            />

            {/* Contenido dinámico renderizado por la ruta activa */}
            <main className="dashboard-main">
              <Outlet
                context={{
                  openProgramsModal: () => setIsProgramsModalOpen(true),
                  openLinkModal: () => setIsLinkModalOpen(true)
                }}
              />
            </main>
          </div>
        </div>

        {/* Modales globales de programas y asignaturas */}
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
