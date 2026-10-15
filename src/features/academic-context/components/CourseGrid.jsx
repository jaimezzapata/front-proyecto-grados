import React from 'react';
import { useAcademic } from '../context/AcademicContext';
import { CourseCard } from './CourseCard';
import { SkeletonCard } from '../../../core/components/Skeleton';
import { Button } from '../../../core/components/Button';
import { BookOpen, Plus, FolderPlus } from 'lucide-react';
import './courseCard.css';

/**
 * Cuadrícula responsiva de asignaturas del docente
 */
export const CourseGrid = ({ onOpenLinkModal }) => {
  const { misAsignaturas, selectedAsignatura, loading, selectAsignatura } = useAcademic();

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
    return (
      <div className="courses-empty-state">
        <div className="courses-empty-state__icon">
          <BookOpen size={28} />
        </div>
        <h3 className="courses-empty-state__title">
          Aún no tienes asignaturas vinculadas
        </h3>
        <p className="courses-empty-state__desc">
          Para comenzar a cargar material de clase y generar evaluaciones inteligentes, vincula las materias que impartes este periodo académico.
        </p>
        <Button
          variant="primary"
          size="md"
          icon={<Plus size={16} />}
          onClick={onOpenLinkModal}
        >
          Vincular mi primera Asignatura
        </Button>
      </div>
    );
  }

  const selectedId = selectedAsignatura?.asignatura?.id || selectedAsignatura?.id;

  return (
    <div className="courses-grid">
      {misAsignaturas.map((course) => {
        const courseId = course.asignatura?.id || course.id;
        const isActive = courseId === selectedId;

        return (
          <CourseCard
            key={course.id || courseId}
            course={course}
            isActive={isActive}
            onSelect={selectAsignatura}
          />
        );
      })}
    </div>
  );
};
