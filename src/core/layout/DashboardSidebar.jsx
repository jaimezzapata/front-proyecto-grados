import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Avatar } from '../components/Avatar';
import { getUserFullName } from '../utils/userUtils';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  UploadCloud,
  Sparkles,
  Download,
  X
} from 'lucide-react';
import './dashboardSidebar.css';

/**
 * Menú Lateral Izquierdo Simplificado y Aligerado (Sticky Left Sidebar)
 * Sin redundancias, directo a la acción y 100% visible sin scroll excesivo.
 */
export const DashboardSidebar = ({
  isOpen,
  onClose,
  onOpenProgramsModal,
  onNavigateSection
}) => {
  const { user } = useAuth();

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
          <span className="dashboard-sidebar__header-tag">Navegación</span>
          <button
            type="button"
            className="dashboard-sidebar__close-btn"
            onClick={onClose}
            aria-label="Cerrar menú lateral"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tarjeta de Perfil Compacta */}
        <div className="dashboard-sidebar__profile-card">
          <Avatar user={user} size="sm" />
          <div className="dashboard-sidebar__profile-info">
            <h4 className="dashboard-sidebar__profile-name">
              {getUserFullName(user)}
            </h4>
            <span className="dashboard-sidebar__profile-role">
              Docente CESDE
            </span>
          </div>
        </div>

        {/* Menú de Navegación Unificado y Limpio */}
        <div className="dashboard-sidebar__nav-section">
          <span className="dashboard-sidebar__section-title">Módulos del Sistema</span>
          <nav className="dashboard-sidebar__nav">
            <button
              type="button"
              className="dashboard-sidebar__nav-item dashboard-sidebar__nav-item--active"
              onClick={() => {
                if (onNavigateSection) onNavigateSection('resumen');
                if (onClose) onClose();
              }}
            >
              <LayoutDashboard size={16} />
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
              <BookOpen size={16} />
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
              <GraduationCap size={16} />
              <span>Programas Técnicos</span>
            </button>

            <button
              type="button"
              className="dashboard-sidebar__nav-item"
              onClick={() => {
                if (onNavigateSection) onNavigateSection('ingesta');
                if (onClose) onClose();
              }}
            >
              <UploadCloud size={16} />
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
              <Sparkles size={16} />
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
              <Download size={16} />
              <span>3. Historial & Descargas</span>
            </button>
          </nav>
        </div>
      </aside>
    </>
  );
};
