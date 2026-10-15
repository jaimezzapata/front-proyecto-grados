import React from 'react';
import { Button } from '../../../core/components/Button';
import { BookOpen, Check, Layers, Users, Calendar } from 'lucide-react';
import './courseCard.css';

/**
 * Componente atómico de Tarjeta de Asignatura / Curso
 * Representa la asignación específica de un docente a una materia, grupo y periodo
 */
export const CourseCard = ({ course, isActive, onSelect }) => {
  const asignatura = course.asignatura || course;
  const grupo = course.grupo || '01';
  const periodo = course.periodo_academico || '2026-1';
  const semestre = asignatura.semestre ? `Semestre ${asignatura.semestre}` : 'Nivel General';
  const codigo = asignatura.codigo || 'ASIG';
  const nombre = asignatura.nombre || 'Asignatura sin nombre';

  return (
    <div className={`course-card ${isActive ? 'course-card--active' : ''}`}>
      {isActive && <div className="course-card__active-stripe" />}

      <div>
        {/* Cabecera con Código, Grupo y Badge Activo */}
        <div className="course-card__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span className="course-card__code">{codigo}</span>
            <span className="course-card__badge-group" title={`Grupo asignado: ${grupo}`}>
              <Users size={12} />
              Grupo {grupo}
            </span>
          </div>

          {isActive && (
            <span className="course-card__badge-active">
              <Check size={12} style={{ display: 'inline', marginRight: 4 }} />
              Activa
            </span>
          )}
        </div>

        {/* Nombre de la Asignatura */}
        <h3 className="course-card__title">{nombre}</h3>

        {/* Metadatos (Semestre y Periodo) */}
        <div className="course-card__meta">
          <span className="course-card__meta-item">
            <Layers size={13} /> {semestre}
          </span>
          <span className="course-card__meta-item">
            <Calendar size={13} /> Periodo {periodo}
          </span>
        </div>
      </div>

      {/* Pie con botón de selección de grupo */}
      <div className="course-card__footer">
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Sec. #{course.id}
        </span>
        <Button
          variant={isActive ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onSelect(course)}
          icon={isActive ? <Check size={14} /> : <BookOpen size={14} />}
        >
          {isActive ? 'Grupo Activo' : 'Seleccionar'}
        </Button>
      </div>
    </div>
  );
};
