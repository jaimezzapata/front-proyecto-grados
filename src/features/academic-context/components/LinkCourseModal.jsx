import React, { useState, useEffect } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { academicService } from '../services/academicService';
import { Button } from '../../../core/components/Button';
import { X, Plus, BookOpen, Layers } from 'lucide-react';
import toast from 'react-hot-toast';
import './courseCard.css';

/**
 * Modal para vincular una nueva asignatura del catálogo al docente
 */
export const LinkCourseModal = ({ isOpen, onClose }) => {
  const { vincularAsignatura } = useAcademic();
  const [programas, setProgramas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [selectedPrograma, setSelectedPrograma] = useState('');
  const [selectedAsignaturaId, setSelectedAsignaturaId] = useState('');
  const [periodo, setPeriodo] = useState('2026-1');
  const [grupo, setGrupo] = useState('01');
  const [submitting, setSubmitting] = useState(false);
  const [loadingCatalog, setLoadingCatalog] = useState(false);

  // Cargar programas al abrir el modal
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    const fetchCatalog = async () => {
      try {
        setLoadingCatalog(true);
        const [progList, asigList] = await Promise.all([
          academicService.getProgramas(),
          academicService.getAsignaturas()
        ]);
        if (isMounted) {
          setProgramas(progList);
          setAsignaturas(asigList);
          if (progList.length > 0) {
            setSelectedPrograma(progList[0].id.toString());
          }
          if (asigList.length > 0) {
            setSelectedAsignaturaId(asigList[0].id.toString());
          }
        }
      } catch (err) {
        toast.error('No se pudo cargar el catálogo de asignaturas');
      } finally {
        if (isMounted) setLoadingCatalog(false);
      }
    };

    fetchCatalog();
    return () => {
      isMounted = false;
    };
  }, [isOpen]);

  // Filtrar asignaturas según el programa seleccionado
  const filteredAsignaturas = selectedPrograma
    ? asignaturas.filter((a) => a.programa_id?.toString() === selectedPrograma.toString())
    : asignaturas;

  // Actualizar la asignatura seleccionada al cambiar el filtro
  useEffect(() => {
    if (filteredAsignaturas.length > 0) {
      setSelectedAsignaturaId(filteredAsignaturas[0].id.toString());
    } else {
      setSelectedAsignaturaId('');
    }
  }, [selectedPrograma]);

  // Manejar cierre con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAsignaturaId) {
      toast.error('Selecciona una asignatura');
      return;
    }
    if (!periodo.trim()) {
      toast.error('Ingresa el periodo académico');
      return;
    }

    try {
      setSubmitting(true);
      await vincularAsignatura({
        asignatura_id: Number(selectedAsignaturaId),
        periodo_academico: periodo.trim(),
        grupo: grupo.trim() || '01'
      });
      onClose();
    } catch {
      // El error ya se maneja en el context con toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={20} style={{ color: 'var(--primary-color)' }} />
            <h3 className="modal-header__title">Vincular Nueva Asignatura</h3>
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

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {loadingCatalog ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '20px 0' }}>
                Cargando catálogo institucional...
              </p>
            ) : (
              <>
                <div className="modal-form-group">
                  <label htmlFor="modal-programa" className="modal-label">
                    Programa Académico
                  </label>
                  <select
                    id="modal-programa"
                    className="modal-select"
                    value={selectedPrograma}
                    onChange={(e) => setSelectedPrograma(e.target.value)}
                  >
                    {programas.map((prog) => (
                      <option key={prog.id} value={prog.id}>
                        {prog.codigo} - {prog.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="modal-form-group">
                  <label htmlFor="modal-asignatura" className="modal-label">
                    Asignatura
                  </label>
                  <select
                    id="modal-asignatura"
                    className="modal-select"
                    value={selectedAsignaturaId}
                    onChange={(e) => setSelectedAsignaturaId(e.target.value)}
                    required
                  >
                    {filteredAsignaturas.length === 0 ? (
                      <option value="">No hay asignaturas en este programa</option>
                    ) : (
                      filteredAsignaturas.map((asig) => (
                        <option key={asig.id} value={asig.id}>
                          {asig.codigo} - {asig.nombre} (Semestre {asig.semestre || 'N/A'})
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div className="modal-form-group">
                    <label htmlFor="modal-periodo" className="modal-label">
                      Periodo Académico
                    </label>
                    <input
                      id="modal-periodo"
                      type="text"
                      className="modal-input"
                      value={periodo}
                      onChange={(e) => setPeriodo(e.target.value)}
                      placeholder="Ej. 2026-1"
                      required
                    />
                  </div>

                  <div className="modal-form-group">
                    <label htmlFor="modal-grupo" className="modal-label">
                      Grupo / Sección
                    </label>
                    <input
                      id="modal-grupo"
                      type="text"
                      className="modal-input"
                      value={grupo}
                      onChange={(e) => setGrupo(e.target.value)}
                      placeholder="Ej. 01"
                      required
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="modal-footer">
            <Button variant="ghost" size="sm" onClick={onClose} disabled={submitting}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={submitting}
              icon={<Plus size={16} />}
              disabled={loadingCatalog || !selectedAsignaturaId}
            >
              Vincular al Perfil
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
