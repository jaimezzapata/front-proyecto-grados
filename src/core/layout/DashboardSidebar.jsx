import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useAcademic } from '../../features/academic-context/context/AcademicContext';
import { Avatar } from '../components/Avatar';
import { getUserFullName } from '../utils/userUtils';
import { Button } from '../components/Button';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  PlusCircle,
  UploadCloud,
  Sparkles,
  Download,
  LogOut,
  X,
  Building2
} from 'lucide-react';
import './dashboardSidebar.css';

/**
 * Menú Lateral Izquierdo (Sticky Left Sidebar) para el Panel de Control
 * Permanece fijo y visible al desplazarse con el scroll en la sección principal.
 */
export const DashboardSidebar = ({
  isOpen,
  onClose,
  onOpenProgramsModal,
  onOpenLinkModal,
  onNavigateSection
}) => {
  const { user, logout } = useAuth();
  const { selectedAsignatura, selectedPeriod } = useAcademic();

  const activeCourse = selectedAsignatura?.asignatura || selectedAsignatura;

  return (
    <>
      {/* Backdrop en pantallas móviles */}
      {isOpen && (
        <div
          className="dashboard-sidebar-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`dashboard-sidebar ${isOpen ? 'dashboard-sidebar--open' : ''}`}
        aria-label="Panel de navegación lateral izquierdo"
      >
        {/* Cabecera del Sidebar con botón de cierre móvil */}
        <div className="dashboard-sidebar__header">
          <span className="dashboard-sidebar__header-tag">Menú Principal</span>
          <button
            type="button"
            className="dashboard-sidebar__close-btn"
            onClick={onClose}
            aria-label="Cerrar menú lateral"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tarjeta de Perfil del Docente */}
        <div className="dashboard-sidebar__profile-card">
          <Avatar user={user} size="md" />
          <div className="dashboard-sidebar__profile-info">
            <h4 className="dashboard-sidebar__profile-name">
              {getUserFullName(user)}
            </h4>
            <span className="dashboard-sidebar__profile-role">
              Docente CESDE
            </span>
            <span className="dashboard-sidebar__profile-email">
              {user?.email || 'docente@cesde.edu.co'}
            </span>
          </div>
        </div>

        {/* Menú de Navegación Rápida */}
        <div className="dashboard-sidebar__nav-section">
          <span className="dashboard-sidebar__section-title">Navegación del Panel</span>
          <nav className="dashboard-sidebar__nav">
            <button
              type="button"
              className="dashboard-sidebar__nav-item dashboard-sidebar__nav-item--active"
              onClick={() => {
                if (onNavigateSection) onNavigateSection('resumen');
                if (onClose) onClose();
              }}
            >
              <LayoutDashboard size={17} />
              <span>Vista Principal</span>
            </button>

            <button
              type="button"
              className="dashboard-sidebar__nav-item"
              onClick={() => {
                if (onNavigateSection) onNavigateSection('asignaturas');
                if (onClose) onClose();
              }}
            >
              <BookOpen size={17} />
              <span>Mis Asignaturas</span>
            </button>

            <button
              type="button"
              className="dashboard-sidebar__nav-item"
              onClick={() => {
                if (onOpenProgramsModal) onOpenProgramsModal();
                if (onClose) onClose();
              }}
            >
              <GraduationCap size={17} />
              <span>Programas Técnicos</span>
            </button>

            <button
              type="button"
              className="dashboard-sidebar__nav-item"
              onClick={() => {
                if (onOpenLinkModal) onOpenLinkModal();
                if (onClose) onClose();
              }}
            >
              <PlusCircle size={17} />
              <span>Vincular Asignatura</span>
            </button>
          </nav>
        </div>

        {/* Módulos de Generación Pedagógica */}
        <div className="dashboard-sidebar__nav-section">
          <span className="dashboard-sidebar__section-title">Flujo de Evaluaciones</span>
          <nav className="dashboard-sidebar__nav">
            <button
              type="button"
              className="dashboard-sidebar__nav-item"
              onClick={() => {
                if (onNavigateSection) onNavigateSection('ingesta');
                if (onClose) onClose();
              }}
            >
              <UploadCloud size={17} />
              <span>1. Ingesta de Material</span>
            </button>

            <button
              type="button"
              className="dashboard-sidebar__nav-item"
              onClick={() => {
                if (onNavigateSection) onNavigateSection('ia');
                if (onClose) onClose();
              }}
            >
              <Sparkles size={17} />
              <span>2. Motor IA Bloom</span>
            </button>

            <button
              type="button"
              className="dashboard-sidebar__nav-item"
              onClick={() => {
                if (onNavigateSection) onNavigateSection('exportar');
                if (onClose) onClose();
              }}
            >
              <Download size={17} />
              <span>3. Exportación</span>
            </button>
          </nav>
        </div>

        {/* Resumen del Contexto Activo CESDE */}
        <div className="dashboard-sidebar__context-widget">
          <div className="dashboard-sidebar__context-header">
            <Building2 size={15} style={{ color: 'var(--primary-color)' }} />
            <span>Contexto CESDE</span>
          </div>
          <div className="dashboard-sidebar__context-content">
            <div className="dashboard-sidebar__context-row">
              <span className="dashboard-sidebar__context-label">Periodo Activo:</span>
              <span className="dashboard-sidebar__context-val">{selectedPeriod}</span>
            </div>
            <div className="dashboard-sidebar__context-row">
              <span className="dashboard-sidebar__context-label">Sede:</span>
              <span className="dashboard-sidebar__context-val">{selectedAsignatura?.sede || 'Medellín'}</span>
            </div>
            <div className="dashboard-sidebar__context-row">
              <span className="dashboard-sidebar__context-label">Curso Activo:</span>
              <span className="dashboard-sidebar__context-val dashboard-sidebar__context-val--truncate">
                {activeCourse?.nombre || 'Sin seleccionar'}
              </span>
            </div>
          </div>
        </div>

        {/* Botón de Salida */}
        <div className="dashboard-sidebar__footer">
          <Button
            variant="outline"
            size="sm"
            style={{ width: '100%', justifyContent: 'center' }}
            icon={<LogOut size={16} />}
            onClick={logout}
          >
            Cerrar Sesión
          </Button>
        </div>
      </aside>
    </>
  );
};
