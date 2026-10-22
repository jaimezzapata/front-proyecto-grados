import React from 'react';
import { useAcademic } from '../../features/academic-context/context/AcademicContext';
import { BookOpen, MapPin, GraduationCap, Sparkles } from 'lucide-react';
import './dashboardStats.css';

/**
 * Tarjetas de métricas y resumen rápido para el Panel de Control (Command Center)
 */
export const DashboardStatsCards = ({ onOpenProgramsModal, onOpenLinkModal }) => {
  const { misAsignaturas, selectedAsignatura, selectedPeriod } = useAcademic();

  const totalCursos = misAsignaturas ? misAsignaturas.length : 0;
  const currentSede = selectedAsignatura?.sede || 'Medellín';
  const currentModalidad = selectedAsignatura?.modalidad || 'Regular';
  const currentJornada = selectedAsignatura?.jornada || 'Mañana';

  return (
    <div className="dashboard-stats-grid" aria-label="Métricas rápidas del docente">
      {/* Card 1: Cursos vinculados */}
      <div className="dashboard-stat-card" onClick={onOpenLinkModal} role="button" tabIndex={0} title="Ver cursos vinculados">
        <div className="dashboard-stat-card__icon dashboard-stat-card__icon--primary">
          <BookOpen size={20} />
        </div>
        <div className="dashboard-stat-card__content">
          <span className="dashboard-stat-card__label">Cursos en {selectedPeriod}</span>
          <div className="dashboard-stat-card__value-row">
            <span className="dashboard-stat-card__value">{totalCursos}</span>
            <span className="dashboard-stat-card__badge">Asignados</span>
          </div>
        </div>
      </div>

      {/* Card 2: Sede y Modalidad CESDE */}
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-card__icon dashboard-stat-card__icon--accent">
          <MapPin size={20} />
        </div>
        <div className="dashboard-stat-card__content">
          <span className="dashboard-stat-card__label">Sede & Modalidad</span>
          <div className="dashboard-stat-card__value-row">
            <span className="dashboard-stat-card__value-sm">{currentSede}</span>
            <span className="dashboard-stat-card__badge-subtle">{currentModalidad} • {currentJornada}</span>
          </div>
        </div>
      </div>

      {/* Card 3: Formación Técnica CESDE */}
      <div
        className="dashboard-stat-card dashboard-stat-card--interactive"
        onClick={onOpenProgramsModal}
        role="button"
        tabIndex={0}
        title="Gestionar programas técnicos"
      >
        <div className="dashboard-stat-card__icon dashboard-stat-card__icon--tech">
          <GraduationCap size={20} />
        </div>
        <div className="dashboard-stat-card__content">
          <span className="dashboard-stat-card__label">Formación Técnica</span>
          <div className="dashboard-stat-card__value-row">
            <span className="dashboard-stat-card__value-sm">Técnico Laboral</span>
            <span className="dashboard-stat-card__badge-action">Gestionar</span>
          </div>
        </div>
      </div>

      {/* Card 4: Motor IA & Taxonomía Bloom */}
      <div className="dashboard-stat-card">
        <div className="dashboard-stat-card__icon dashboard-stat-card__icon--ai">
          <Sparkles size={20} />
        </div>
        <div className="dashboard-stat-card__content">
          <span className="dashboard-stat-card__label">Motor de Evaluaciones</span>
          <div className="dashboard-stat-card__value-row">
            <span className="dashboard-stat-card__value-sm">IA Pedagógica</span>
            <span className="dashboard-stat-card__badge-live">Activo</span>
          </div>
        </div>
      </div>
    </div>
  );
};
