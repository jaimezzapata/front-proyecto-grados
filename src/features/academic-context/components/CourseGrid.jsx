import React from 'react';
import { useAcademic } from '../context/AcademicContext';
import { CourseCard } from './CourseCard';
import { SkeletonCard } from '../../../core/components/Skeleton';
import { Button } from '../../../core/components/Button';
import { BookOpen, Plus } from 'lucide-react';
import './courseCard.css';

/**
 * Cuadrícula responsiva de asignaturas del docente
 */
export const CourseGrid = ({ onOpenLinkModal, onEditCourse }) => {
  const { misAsignaturas, selectedAsignatura, selectedPeriod, loading, selectAsignatura } = useAcademic();

  if (loading) {
    return (
      <div className="courses-grid">
        <SkeletonCard height={170} />
        <SkeletonCard height={170} />
        <SkeletonCard height={170} />
      </div>
    );
  }

  if (misAsignaturas.length === 0) {
    const periodLabel = selectedPeriod === 'ALL' ? '' : ` en el periodo ${selectedPeriod}`;
    return (
      <div className="courses-empty-state">
        <div className="courses-empty-state__icon">
          <BookOpen size={28} />
        </div>
        <h3 className="courses-empty-state__title">
          Sin asignaturas registradas{periodLabel}
        </h3>
        <p className="courses-empty-state__desc">
          No tienes asignaturas o grupos vinculados{periodLabel}. Puedes vincular una materia del catálogo o registrar una nueva para comenzar a generar exámenes con IA.
        </p>
        <Button
          variant="primary"
          size="md"
          icon={<Plus size={16} />}
          onClick={onOpenLinkModal}
        >
          Vincular Asignatura{periodLabel}
        </Button>
      </div>
    );
  }

  return (
    <div className="courses-grid">
      {misAsignaturas.map((course) => {
        // La comparación exacta se realiza sobre el ID de la asignación del docente
        const isActive = selectedAsignatura?.id === course.id;

        return (
          <CourseCard
            key={course.id}
            course={course}
            isActive={isActive}
            onSelect={selectAsignatura}
            onEdit={onEditCourse}
          />
        );
      })}
    </div>
  );
};
