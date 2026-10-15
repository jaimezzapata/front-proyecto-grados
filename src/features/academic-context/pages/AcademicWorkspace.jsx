import React, { useState } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { ActiveCourseBanner } from '../components/ActiveCourseBanner';
import { CourseGrid } from '../components/CourseGrid';
import { PeriodFilterSelector } from '../components/PeriodFilterSelector';
import { LinkCourseModal } from '../components/LinkCourseModal';
import { Button } from '../../../core/components/Button';
import { Plus, UploadCloud, Sparkles, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import '../components/courseCard.css';

/**
 * Workspace de Contexto Académico del Docente (Módulo 1)
 */
export const AcademicWorkspace = () => {
  const { selectedAsignatura } = useAcademic();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const activeCourse = selectedAsignatura?.asignatura || selectedAsignatura;
  const activeCourseName = activeCourse?.nombre || 'Selecciona una asignatura';

  const handleNextStep = (moduleName) => {
    if (!selectedAsignatura) {
      toast.error('Primero debes seleccionar o vincular una asignatura activa');
      return;
    }
    toast(`Módulo siguiente: ${moduleName} para "${activeCourseName}"`, {
      icon: '🚀'
    });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {/* 1. Banner de Asignatura Activa */}
      <ActiveCourseBanner onOpenLinkModal={() => setIsModalOpen(true)} />

      {/* 2. Sección de Mis Asignaturas */}
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
              variant="primary"
              size="sm"
              icon={<Plus size={16} />}
              onClick={() => setIsModalOpen(true)}
            >
              Vincular Asignatura
            </Button>
          </div>
        </div>

        <CourseGrid onOpenLinkModal={() => setIsModalOpen(true)} />
      </section>

      {/* 3. Acciones Rápidas del Flujo (Módulos 2 y 3) */}
      {selectedAsignatura && (
        <section
          style={{
            marginTop: 8,
            paddingTop: 24,
            borderTop: 'var(--border-width) solid var(--border-subtle)'
          }}
          aria-labelledby="flujo-acciones-heading"
        >
          <div style={{ marginBottom: 16 }}>
            <span style={{ fontSize: '0.74rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
              Flujo de Trabajo
            </span>
            <h3 id="flujo-acciones-heading" style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 800, margin: '4px 0 0', fontStyle: 'normal' }}>
              ¿Qué deseas realizar en {activeCourse?.codigo || 'este curso'}?
            </h3>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {/* Opción 1: Ingesta de Material */}
            <div
              className="course-card"
              style={{ cursor: 'pointer' }}
              onClick={() => handleNextStep('Ingesta de Material')}
            >
              <div>
                <div style={{
                  width: 38,
                  height: 38,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--primary-color)',
                  color: 'var(--primary-contrast)',
                  borderRadius: 'var(--border-radius-sm)',
                  marginBottom: 12
                }}>
                  <UploadCloud size={20} />
                </div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px', fontStyle: 'normal' }}>
                  1. Cargar Material de Clase
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Sube guías, diapositivas y lecturas en PDF/Word para que la IA extraiga los conceptos clave.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--primary-color)', fontWeight: 700, fontSize: '0.85rem' }}>
                <span>Ir a Ingesta</span>
                <ArrowRight size={15} />
              </div>
            </div>

            {/* Opción 2: Parametrización y Motor IA */}
            <div
              className="course-card"
              style={{ cursor: 'pointer' }}
              onClick={() => handleNextStep('Generador con IA')}
            >
              <div>
                <div style={{
                  width: 38,
                  height: 38,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'var(--accent-color)',
                  color: 'var(--primary-contrast)',
                  borderRadius: 'var(--border-radius-sm)',
                  marginBottom: 12
                }}>
                  <Sparkles size={20} />
                </div>
                <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 800, margin: '0 0 6px', fontStyle: 'normal' }}>
                  2. Generar Evaluación con IA
                </h4>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
                  Configura niveles Bloom, tipos de pregunta y modelo de lenguaje para crear tu examen estructurado.
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                <span>Ir al Motor IA</span>
                <ArrowRight size={15} />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. Modal para vincular materias */}
      <LinkCourseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};
