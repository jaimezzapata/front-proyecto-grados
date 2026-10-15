import React from 'react';
import { useAcademic } from '../context/AcademicContext';
import { Button } from '../../../core/components/Button';
import { GraduationCap, Plus, BookOpen } from 'lucide-react';
import './courseCard.css';

/**
 * Banner superior que destaca la asignatura actualmente activa en el Workspace
 */
export const ActiveCourseBanner = ({ onOpenLinkModal }) => {
  const { selectedAsignatura, misAsignaturas } = useAcademic();

  const currentCourse = selectedAsignatura?.asignatura || selectedAsignatura;
  const nombre = currentCourse?.nombre;
  const codigo = currentCourse?.codigo;
  const grupo = selectedAsignatura?.grupo || '01';
  const periodo = selectedAsignatura?.periodo_academico || '2026-1';

  return (
    <div className="active-course-banner">
      <div className="active-course-banner__info">
        <div className="active-course-banner__icon">
          <GraduationCap size={22} />
        </div>
        <div className="active-course-banner__text">
          <span className="active-course-banner__tag">
            Contexto Académico Activo
          </span>
          <h2 className="active-course-banner__title">
            {nombre ? `${codigo} - ${nombre} (Grupo ${grupo} • ${periodo})` : 'Ninguna asignatura seleccionada'}
          </h2>
        </div>
      </div>

      <div className="active-course-banner__actions">
        <Button
          variant="secondary"
          size="sm"
          icon={<Plus size={15} />}
          onClick={onOpenLinkModal}
        >
          Vincular Materia
        </Button>
      </div>
    </div>
  );
};
