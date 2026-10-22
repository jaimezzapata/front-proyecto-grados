import React from 'react';
import { Button } from '../../../core/components/Button';
import { FileText, Sparkles, Clock, Trash2, ArrowRight } from 'lucide-react';

/**
 * Tarjeta individual atómica para una evaluación ligada al curso (SRP)
 */
export const CourseExamCard = ({ exam, onSelectExam, onDeleteExam }) => {
  const actualExam = exam?.evaluacion || exam || {};

  const getBadgeStyle = (estado) => {
    switch (estado) {
      case 'APROBADO':
        return { bg: '#10B981', color: '#FFFFFF', label: 'Aprobado' };
      case 'GENERADO_IA':
        return { bg: 'var(--primary-color)', color: '#FFFFFF', label: 'Generado con IA' };
      case 'EN_REVISION':
        return { bg: '#F59E0B', color: '#000000', label: 'En Revisión' };
      default:
        return { bg: 'var(--bg-surface-hover)', color: 'var(--text-secondary)', label: 'Borrador' };
    }
  };

  const badge = getBadgeStyle(actualExam.estado);
  const totalPreguntas = actualExam.preguntas ? actualExam.preguntas.length : 0;
  const fecha = actualExam.created_at ? new Date(actualExam.created_at).toLocaleDateString('es-CO') : 'Reciente';

  return (
    <div
      className="course-exam-card"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: 'var(--border-width) solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        padding: '16px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 14,
        boxSizing: 'border-box',
        transition: 'all 0.15s ease'
      }}
    >
      <div>
        {/* Cabecera de la tarjeta con Badge de Estado */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              padding: '3px 8px',
              backgroundColor: badge.bg,
              color: badge.color,
              borderRadius: 'var(--border-radius-sm)',
              border: '1px solid var(--border-color)'
            }}
          >
            {badge.label}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} />
            {fecha}
          </span>
        </div>

        {/* Título de la evaluación */}
        <h4
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.05rem',
            fontWeight: 800,
            margin: '0 0 6px',
            color: 'var(--text-primary)',
            lineHeight: 1.3
          }}
        >
          {actualExam.titulo}
        </h4>

        {/* Metadatos rápidos */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <FileText size={13} style={{ color: 'var(--primary-color)' }} />
            {totalPreguntas} preguntas
          </span>
          {actualExam.parametro_ia?.nivel_bloom && (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Sparkles size={13} style={{ color: '#F59E0B' }} />
              Nivel: {actualExam.parametro_ia.nivel_bloom}
            </span>
          )}
        </div>
      </div>

      {/* Botones de acción inferior */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: 10,
          borderTop: '1px solid var(--border-subtle)',
          gap: 8
        }}
      >
        <button
          type="button"
          onClick={() => onDeleteExam(actualExam.id)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: 6,
            borderRadius: 'var(--border-radius-sm)',
            display: 'flex',
            alignItems: 'center'
          }}
          title="Eliminar evaluación"
          aria-label="Eliminar evaluación"
        >
          <Trash2 size={16} />
        </button>

        <Button
          variant="primary"
          size="sm"
          icon={<ArrowRight size={14} />}
          onClick={() => onSelectExam(actualExam)}
        >
          Ver / Editar
        </Button>
      </div>
    </div>
  );
};
