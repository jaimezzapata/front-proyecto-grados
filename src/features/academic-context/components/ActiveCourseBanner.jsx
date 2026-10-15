import React from 'react';
import { useAcademic } from '../context/AcademicContext';
import { Button } from '../../../core/components/Button';
import { GraduationCap, Plus, MapPin, Briefcase, Clock } from 'lucide-react';
import './courseCard.css';

/**
 * Banner superior que destaca la asignatura actualmente activa en el Workspace de CESDE
 */
export const ActiveCourseBanner = ({ onOpenLinkModal }) => {
  const { selectedAsignatura } = useAcademic();

  const currentCourse = selectedAsignatura?.asignatura || selectedAsignatura;
  const nombre = currentCourse?.nombre;
  const codigo = currentCourse?.codigo;
  const grupo = selectedAsignatura?.grupo || '01';
  const periodo = selectedAsignatura?.periodo_academico || '2026-2';
  const sede = selectedAsignatura?.sede || 'Medellín';
  const modalidad = selectedAsignatura?.modalidad || 'Regular';
  const jornada = selectedAsignatura?.jornada || 'Mañana';

  return (
    <div className="active-course-banner">
      <div className="active-course-banner__info">
        <div className="active-course-banner__icon">
          <GraduationCap size={22} />
        </div>
        <div className="active-course-banner__text">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            <span className="active-course-banner__tag">
              Contexto Académico CESDE Activo
            </span>
            {nombre && (
              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--primary-color)' }}>
                • Sede {sede} ({modalidad} - Jornada {jornada})
              </span>
            )}
          </div>

          <h2 className="active-course-banner__title">
            {nombre ? `${codigo} - ${nombre} • Grupo ${grupo} (${periodo})` : 'Ninguna asignatura seleccionada'}
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
