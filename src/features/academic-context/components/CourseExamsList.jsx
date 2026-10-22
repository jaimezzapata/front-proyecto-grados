import React from 'react';
import { CourseExamCard } from './CourseExamCard';
import { Button } from '../../../core/components/Button';
import { Sparkles, FileQuestion } from 'lucide-react';

/**
 * Cuadrícula desacoplada de evaluaciones vinculadas al curso (SRP)
 */
export const CourseExamsList = ({
  exams,
  loading,
  onOpenCreateExam,
  onSelectExam,
  onDeleteExam
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
        <p>Cargando evaluaciones del curso...</p>
      </div>
    );
  }

  if (!exams || exams.length === 0) {
    return (
      <div
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-surface)',
          border: 'var(--border-width) dashed var(--border-color)',
          borderRadius: 'var(--border-radius)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 'var(--border-radius-sm)',
            backgroundColor: 'var(--bg-surface-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-color)',
            border: 'var(--border-width) solid var(--border-subtle)'
          }}
        >
          <FileQuestion size={26} />
        </div>

        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--text-primary)' }}>
            Aún no hay evaluaciones para esta materia
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, maxWidth: 440 }}>
            Puedes generar tu primer examen automatizado con Inteligencia Artificial o crearlo con preguntas parametrizadas en la Taxonomía de Bloom.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<Sparkles size={16} />}
          onClick={onOpenCreateExam}
        >
          Crear Primera Evaluación con IA
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: 16
      }}
    >
      {exams.map((exam) => (
        <CourseExamCard
          key={exam.id}
          exam={exam}
          onSelectExam={onSelectExam}
          onDeleteExam={onDeleteExam}
        />
      ))}
    </div>
  );
};
