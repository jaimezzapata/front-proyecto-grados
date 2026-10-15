import React from 'react';
import { Button } from '../../../core/components/Button';
import { BookOpen, Check, Layers, Users } from 'lucide-react';
import './courseCard.css';

/**
 * Componente atómico de Tarjeta de Asignatura
 */
export const CourseCard = ({ course, isActive, onSelect }) => {
  const asignatura = course.asignatura || course;
  const grupo = course.grupo || '01';
  const periodo = course.periodo_academico || '2026-1';
  const semestre = asignatura.semestre ? `Semestre ${asignatura.semestre}` : 'General';
  const codigo = asignatura.codigo || 'ASIG';
  const nombre = asignatura.nombre || 'Asignatura sin nombre';

  return (
    <div className={`course-card ${isActive ? 'course-card--active' : ''}`}>
      {isActive && <div className="course-card__active-stripe" />}

      <div>
        <div className="course-card__header">
          <span className="course-card__code">{codigo}</span>
          {isActive ? (
            <span className="course-card__badge-active">
              <Check size={12} style={{ display: 'inline', marginRight: 4 }} />
              Activa
            </span>
          ) : (
            <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
              Grupo {grupo}
            </span>
          )}
        </div>

        <h3 className="course-card__title">{nombre}</h3>

        <div className="course-card__meta">
          <span className="course-card__meta-item">
            <Layers size={13} /> {semestre}
          </span>
          <span className="course-card__meta-item">
            <Users size={13} /> Periodo {periodo}
          </span>
        </div>
      </div>

      <div className="course-card__footer">
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          ID: {asignatura.id}
        </span>
        <Button
          variant={isActive ? 'primary' : 'outline'}
          size="sm"
          onClick={() => onSelect(course)}
          icon={isActive ? <Check size={14} /> : <BookOpen size={14} />}
        >
          {isActive ? 'Seleccionada' : 'Seleccionar'}
        </Button>
      </div>
    </div>
  );
};
