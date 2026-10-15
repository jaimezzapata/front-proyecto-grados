import React, { useState, useEffect } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { academicService } from '../services/academicService';
import { Button } from '../../../core/components/Button';
import { CesdeConfigFields } from './CesdeConfigFields';
import { X, Save, Trash2, AlertCircle, Edit3, BookOpen } from 'lucide-react';
import toast from 'react-hot-toast';
import './courseCard.css';

/**
 * Modal especializado para la edición de asignaturas y grupos docentes (Módulo 1)
 * Cumple con SRP (Single Responsibility Principle) y principios DRY.
 */
export const EditCourseModal = ({ isOpen, onClose, course }) => {
  const { actualizarAsignatura, desvincularAsignatura } = useAcademic();

  const [submitting, setSubmitting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Parámetros de la Asignación
  const [sede, setSede] = useState('Medellín');
  const [modalidad, setModalidad] = useState('Regular');
  const [jornada, setJornada] = useState('Mañana');
  const [periodo, setPeriodo] = useState('');
  const [grupo, setGrupo] = useState('01');

  // Parámetros de la Asignatura
  const [nombreAsignatura, setNombreAsignatura] = useState('');
  const [codigoAsignatura, setCodigoAsignatura] = useState('');

  // Opción de reasignar a otra materia del catálogo
  const [changeCatalogAsignatura, setChangeCatalogAsignatura] = useState(false);
  const [catalogAsignaturas, setCatalogAsignaturas] = useState([]);
  const [selectedCatalogId, setSelectedCatalogId] = useState('');
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  // Cargar datos del curso seleccionado
  useEffect(() => {
    if (course && isOpen) {
      const asig = course.asignatura || course;
      setSede(course.sede || 'Medellín');
      setModalidad(course.modalidad || 'Regular');
      setJornada(course.jornada || 'Mañana');
      setPeriodo(course.periodo_academico || '');
      setGrupo(course.grupo || '01');

      setNombreAsignatura(asig.nombre || '');
      setCodigoAsignatura(asig.codigo || '');
      setSelectedCatalogId(asig.id?.toString() || '');
      setChangeCatalogAsignatura(false);
      setConfirmDelete(false);
    }
  }, [course, isOpen]);

  // Cargar catálogo si el usuario desea cambiar de materia
  useEffect(() => {
    if (changeCatalogAsignatura && catalogAsignaturas.length === 0) {
      const loadCatalog = async () => {
        try {
          setLoadingCatalog(true);
          const list = await academicService.getAsignaturas();
          setCatalogAsignaturas(list);
        } catch {
          toast.error('No se pudo cargar el catálogo de materias');
        } finally {
          setLoadingCatalog(false);
        }
      };
      loadCatalog();
    }
  }, [changeCatalogAsignatura, catalogAsignaturas.length]);

  // Manejo de tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !course) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!periodo.trim()) {
      toast.error('El periodo académico es obligatorio');
      return;
    }
    if (!grupo.trim()) {
      toast.error('El grupo o salón es obligatorio');
      return;
    }

    const payload = {
      periodo_academico: periodo.trim(),
      grupo: grupo.trim(),
      sede,
      modalidad,
      jornada
    };

    if (changeCatalogAsignatura && selectedCatalogId) {
      payload.asignatura_id = Number(selectedCatalogId);
    } else {
      if (nombreAsignatura.trim()) {
        payload.nombre_asignatura = nombreAsignatura.trim();
      }
      if (codigoAsignatura.trim()) {
        payload.codigo_asignatura = codigoAsignatura.trim().toUpperCase();
      }
    }

    try {
      setSubmitting(true);
      await actualizarAsignatura(course.id, payload);
      onClose();
    } catch {
      // El error se notifica en el contexto
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      setSubmitting(true);
      await desvincularAsignatura(course.id);
      onClose();
    } catch {
      // Error manejado en contexto
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="edit-modal-title"
      >
        {/* Cabecera del Modal */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--border-radius-sm)',
                backgroundColor: 'var(--bg-surface-hover)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--primary-color)',
                border: 'var(--border-width) solid var(--border-color)'
              }}
            >
              <Edit3 size={16} />
            </div>
            <h3 id="edit-modal-title" className="modal-header__title">
              Editar Materia y Grupo
            </h3>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Sección de Asignatura */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                padding: '14px',
                backgroundColor: 'var(--bg-surface)',
                borderRadius: 'var(--border-radius-sm)',
                border: 'var(--border-width) solid var(--border-color)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 10
                }}
              >
                <div
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted)'
                  }}
                >
                  Información de la Asignatura
                </div>
                <button
                  type="button"
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: 'var(--primary-color)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                  onClick={() => setChangeCatalogAsignatura(!changeCatalogAsignatura)}
                >
                  {changeCatalogAsignatura ? 'Editar nombre/código' : 'Cambiar de materia'}
                </button>
              </div>

              {changeCatalogAsignatura ? (
                <div className="modal-form-group">
                  <label htmlFor="edit-catalog-select" className="modal-label">
                    Seleccionar otra Asignatura del Catálogo
                  </label>
                  {loadingCatalog ? (
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      Cargando catálogo...
                    </div>
                  ) : (
                    <select
                      id="edit-catalog-select"
                      className="modal-select"
                      value={selectedCatalogId}
                      onChange={(e) => setSelectedCatalogId(e.target.value)}
                      required
                    >
                      {catalogAsignaturas.map((asig) => (
                        <option key={asig.id} value={asig.id}>
                          [{asig.codigo}] {asig.nombre} (Semestre {asig.semestre || '1'})
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 10 }}>
                  <div className="modal-form-group">
                    <label htmlFor="edit-asig-codigo" className="modal-label">
                      Código
                    </label>
                    <input
                      id="edit-asig-codigo"
                      type="text"
                      className="modal-input"
                      value={codigoAsignatura}
                      onChange={(e) => setCodigoAsignatura(e.target.value)}
                      placeholder="Ej. AS-101"
                      required
                    />
                  </div>
                  <div className="modal-form-group">
                    <label htmlFor="edit-asig-nombre" className="modal-label">
                      Nombre de la Asignatura
                    </label>
                    <input
                      id="edit-asig-nombre"
                      type="text"
                      className="modal-input"
                      value={nombreAsignatura}
                      onChange={(e) => setNombreAsignatura(e.target.value)}
                      placeholder="Nombre oficial de la materia"
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Parámetros CESDE Reutilizables (DRY) */}
            <CesdeConfigFields
              sede={sede}
              setSede={setSede}
              modalidad={modalidad}
              setModalidad={setModalidad}
              jornada={jornada}
              setJornada={setJornada}
              periodo={periodo}
              setPeriodo={setPeriodo}
              grupo={grupo}
              setGrupo={setGrupo}
              idPrefix="edit-modal"
            />

            {/* Zona de Peligro / Desvincular */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                borderRadius: 'var(--border-radius-sm)',
                gap: 12
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertCircle size={16} style={{ color: '#ef4444', flexShrink: 0 }} />
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  ¿Registraste este curso por error? Puedes desvincularlo.
                </div>
              </div>

              {confirmDelete ? (
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <Button
                    type="button"
                    variant="danger"
                    size="sm"
                    onClick={handleDelete}
                    disabled={submitting}
                  >
                    Confirmar
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDelete(false)}
                    disabled={submitting}
                  >
                    Cancelar
                  </Button>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  icon={<Trash2 size={13} />}
                  onClick={() => setConfirmDelete(true)}
                  style={{ borderColor: 'rgba(239, 68, 68, 0.4)', color: '#ef4444' }}
                >
                  Desvincular
                </Button>
              )}
            </div>
          </div>

          {/* Pie de Acciones */}
          <div className="modal-footer">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={onClose}
              disabled={submitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              icon={<Save size={16} />}
              disabled={submitting}
            >
              {submitting ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
