import React, { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { CourseGrid } from '../components/CourseGrid';
import { PeriodFilterSelector } from '../components/PeriodFilterSelector';
import { LinkCourseModal } from '../components/LinkCourseModal';
import { EditCourseModal } from '../components/EditCourseModal';
import { ManageProgramsModal } from '../components/ManageProgramsModal';
import { Button } from '../../../core/components/Button';
import { Plus, GraduationCap } from 'lucide-react';
import '../components/courseCard.css';

/**
 * Workspace de Contexto Académico del Docente (Módulo 1)
 */
export const AcademicWorkspace = () => {
  const { refreshAsignaturas } = useAcademic();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProgramsModalOpen, setIsProgramsModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* 1. Sección de Mis Asignaturas */}
      <section aria-labelledby="mis-asignaturas-heading">
        <div className="courses-section-header">
          <div>
            <h2 id="mis-asignaturas-heading" className="courses-section-header__title">
              Mis Asignaturas Asignadas
            </h2>
            <p className="courses-section-header__desc">
              Selecciona el curso y grupo específico para gestionar material o crear evaluaciones.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <PeriodFilterSelector />
            <Button
              variant="surface"
              size="sm"
              icon={<GraduationCap size={16} />}
              onClick={() => setIsProgramsModalOpen(true)}
              title="Ver y editar programas académicos técnicos"
            >
              Programas Técnicos
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={<Plus size={16} />}
              onClick={() => setIsModalOpen(true)}
            >
              Vincular Asignatura
            </Button>
          </div>
        </div>

        <CourseGrid
          onOpenLinkModal={() => setIsModalOpen(true)}
          onEditCourse={(course) => setCourseToEdit(course)}
        />
      </section>



      {/* 4. Modal para vincular materias */}
      <LinkCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* 5. Modal para editar materia o configuración de grupo */}
      <EditCourseModal
        isOpen={Boolean(courseToEdit)}
        course={courseToEdit}
        onClose={() => setCourseToEdit(null)}
      />

      {/* 6. Modal para gestionar y editar programas académicos técnicos */}
      <ManageProgramsModal
        isOpen={isProgramsModalOpen}
        onClose={() => setIsProgramsModalOpen(false)}
        onProgramsUpdated={refreshAsignaturas}
      />
    </div>
  );
};
