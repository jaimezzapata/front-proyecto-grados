import React from 'react';
import { useAcademic } from '../../features/academic-context/context/AcademicContext';
import { BookOpen, GraduationCap, ArrowUpRight, CheckCircle2 } from 'lucide-react';
import './dashboardStats.css';

/**
 * Resumen esencial de 2 métricas clave para el Panel de Control
 * Limpio, balanceado y enfocado en la productividad docente
 */
export const DashboardStatsCards = ({ onOpenLinkModal }) => {
  const { misAsignaturas, selectedAsignatura, selectedPeriod } = useAcademic();

  const totalCursos = misAsignaturas ? misAsignaturas.length : 0;
  const currentCourse = selectedAsignatura?.asignatura || selectedAsignatura;
  const activeCourseName = currentCourse?.nombre;
  const activeGroup = selectedAsignatura?.grupo || '01';
  const activeSede = selectedAsignatura?.sede || 'Medellín';

  return (
    <div className="dashboard-stats-grid" aria-label="Resumen esencial del docente">
      {/* Métrica 1: Asignaturas asignadas */}
      <div 
        className="dashboard-stat-card dashboard-stat-card--interactive" 
        onClick={onOpenLinkModal} 
        role="button" 
        tabIndex={0} 
        title="Vincular o ver asignaturas del periodo"
      >
        <div className="dashboard-stat-card__icon dashboard-stat-card__icon--primary">
          <BookOpen size={20} />
        </div>
        <div className="dashboard-stat-card__content">
          <span className="dashboard-stat-card__label">Mis Asignaturas ({selectedPeriod})</span>
          <div className="dashboard-stat-card__value-row">
            <span className="dashboard-stat-card__value">{totalCursos}</span>
            <span className="dashboard-stat-card__badge">Grupos Activos</span>
          </div>
        </div>
        <div className="dashboard-stat-card__action-hint">
          <ArrowUpRight size={16} />
        </div>
      </div>

      {/* Métrica 2: Curso en Sesión de Trabajo */}
      <div 
        className={`dashboard-stat-card ${activeCourseName ? 'dashboard-stat-card--highlight' : ''}`}
        title={activeCourseName ? `Trabajando en: ${activeCourseName}` : 'Haz clic en una asignatura para activarla'}
      >
        <div className="dashboard-stat-card__icon dashboard-stat-card__icon--accent">
          {activeCourseName ? <CheckCircle2 size={20} /> : <GraduationCap size={20} />}
        </div>
        <div className="dashboard-stat-card__content">
          <span className="dashboard-stat-card__label">Asignatura en Sesión</span>
          <div className="dashboard-stat-card__value-row">
            <span className="dashboard-stat-card__value-sm dashboard-stat-card__value-truncate">
              {activeCourseName ? `${currentCourse.codigo || 'ASIG'} - ${activeCourseName}` : 'Selecciona un curso de la lista'}
            </span>
            <span className={activeCourseName ? "dashboard-stat-card__badge-live" : "dashboard-stat-card__badge-subtle"}>
              {activeCourseName ? `G${activeGroup} • ${activeSede}` : 'Pendiente'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
