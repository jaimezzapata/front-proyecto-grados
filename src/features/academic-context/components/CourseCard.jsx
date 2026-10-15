import React from 'react';
import { Button } from '../../../core/components/Button';
import { BookOpen, Check, Layers, Users, Calendar, MapPin, Briefcase, Clock } from 'lucide-react';
import './courseCard.css';

/**
 * Componente atómico de Tarjeta de Curso CESDE
 * Estructura homogénea, alineada y simétrica para todos los cursos y grupos
 */
export const CourseCard = ({ course, isActive, onSelect }) => {
  const asignatura = course.asignatura || course;
  const grupo = course.grupo || '01';
  const periodo = course.periodo_academico || '2026-2';
  const sede = course.sede || 'Medellín';
  const modalidad = course.modalidad || 'Regular';
  const jornada = course.jornada || 'Mañana';
  const semestre = asignatura.semestre ? `Semestre ${asignatura.semestre}` : 'Nivel General';
  const codigo = asignatura.codigo || 'ASIG';
  const nombre = asignatura.nombre || 'Asignatura sin nombre';

  return (
    <div className={`course-card ${isActive ? 'course-card--active' : ''}`}>
      {/* Franja de acento superior cuando el grupo está activo */}
      {isActive && <div className="course-card__active-stripe" />}

      <div>
        {/* Cabecera uniforme de chips (Código, Grupo, Sede) */}
        <div className="course-card__header">
          <span className="course-card__code" title={`Código: ${codigo}`}>
            {codigo}
          </span>
          <span className="course-card__badge-group" title={`Grupo asignado: ${grupo}`}>
            <Users size={11} />
            Grupo {grupo}
          </span>
          <span className="course-card__badge-sede" title={`Sede CESDE: ${sede}`}>
            <MapPin size={11} />
            {sede}
          </span>
        </div>

        {/* Nombre de la Asignatura (Altura uniforme para todas las tarjetas) */}
        <h3 className="course-card__title" title={nombre}>
          {nombre}
        </h3>

        {/* Metadatos Institucionales (Modalidad, Jornada, Semestre, Periodo) */}
        <div className="course-card__meta">
          <span className="course-card__meta-item" title="Modalidad de estudio">
            <Briefcase size={12} /> {modalidad}
          </span>
          <span className="course-card__meta-item" title="Jornada académica">
            <Clock size={12} /> {jornada}
          </span>
          <span className="course-card__meta-item">
            <Layers size={12} /> {semestre}
          </span>
          <span className="course-card__meta-item">
            <Calendar size={12} /> {periodo}
          </span>
        </div>
      </div>

      {/* Pie con estado y botón de selección */}
      <div className="course-card__footer">
        <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
          {modalidad === 'Empresarial' ? 'Convenio Empresarial' : 'Curso Regular'}
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
