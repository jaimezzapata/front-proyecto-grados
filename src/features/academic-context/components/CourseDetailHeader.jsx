import React from 'react';
import { Button } from '../../../core/components/Button';
import { ArrowLeft, Sparkles, UploadCloud, MapPin, Briefcase, Clock, Calendar, Users } from 'lucide-react';

/**
 * Cabecera institucional atómica para la pantalla de detalle de materia/grupo (SRP)
 */
export const CourseDetailHeader = ({ courseData, onBack, onOpenCreateExam, onOpenUploadModal }) => {
  const asignatura = courseData?.asignatura || courseData || {};
  const programa = asignatura.programa || {};
  const grupo = courseData?.grupo || '01';
  const sede = courseData?.sede || 'Medellín';
  const modalidad = courseData?.modalidad || 'Regular';
  const jornada = courseData?.jornada || 'Mañana';
  const periodo = courseData?.periodo_academico || '2026-2';

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: 'var(--border-width) solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        padding: '20px',
        boxShadow: 'var(--shadow-main)',
        display: 'flex',
        flexDirection: 'column',
        gap: 16
      }}
    >
      {/* Botón de retorno y programa técnico */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
        <button
          type="button"
          onClick={onBack}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: 0
          }}
        >
          <ArrowLeft size={16} />
          <span>Volver a Mis Asignaturas</span>
        </button>

        {programa.nombre && (
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              padding: '3px 8px',
              backgroundColor: 'var(--bg-surface-hover)',
              color: 'var(--primary-color)',
              borderRadius: 'var(--border-radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}
          >
            {programa.codigo} • {programa.nombre}
          </span>
        )}
      </div>

      {/* Título de la materia y botón de creación */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 14 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontWeight: 800,
                fontSize: '0.85rem',
                color: 'var(--text-muted)'
              }}
            >
              {asignatura.codigo || 'ASIG'}
            </span>
          </div>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.3rem, 3.5vw, 1.7rem)',
              fontWeight: 800,
              margin: 0,
              color: 'var(--text-primary)',
              lineHeight: 1.25
            }}
          >
            {asignatura.nombre || 'Cargando asignatura...'}
          </h2>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <Button
            variant="surface"
            size="md"
            icon={<UploadCloud size={16} />}
            onClick={onOpenUploadModal}
            title="Subir documentos PDF, Word o guías para esta materia"
          >
            Cargar Documentación
          </Button>
          <Button
            variant="primary"
            size="md"
            icon={<Sparkles size={16} />}
            onClick={onOpenCreateExam}
          >
            + Nueva Evaluación con IA
          </Button>
        </div>
      </div>

      {/* Badges de Metadatos del Grupo (Sede, Modalidad, Jornada, Periodo) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', paddingTop: 10, borderTop: '1px solid var(--border-subtle)' }}>
        <span className="course-card__badge-group">
          <Users size={12} />
          Grupo {grupo}
        </span>
        <span className="course-card__badge-sede">
          <MapPin size={12} />
          {sede}
        </span>
        <span className="course-card__badge-sede">
          <Briefcase size={12} />
          {modalidad}
        </span>
        <span className="course-card__badge-sede">
          <Clock size={12} />
          Jornada {jornada}
        </span>
        <span className="course-card__badge-sede">
          <Calendar size={12} />
          Periodo {periodo}
        </span>
      </div>
    </div>
  );
};
