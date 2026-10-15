import React, { useState, useEffect } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { academicService } from '../services/academicService';
import { Button } from '../../../core/components/Button';
import { X, Plus, BookOpen, Sparkles, FolderPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import './courseCard.css';

/**
 * Modal dual para:
 * 1. Vincular una asignatura existente del catálogo institucional
 * 2. O crear una nueva asignatura in-place y vincularla inmediatamente
 */
export const LinkCourseModal = ({ isOpen, onClose }) => {
  const { vincularAsignatura, crearYVincularAsignatura } = useAcademic();

  // Modo activo: 'catalogo' | 'crear'
  const [activeTab, setActiveTab] = useState('catalogo');

  // Catálogos
  const [programas, setProgramas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Formulario 1: Vincular Existente
  const [selectedPrograma, setSelectedPrograma] = useState('');
  const [selectedAsignaturaId, setSelectedAsignaturaId] = useState('');
  const [periodo, setPeriodo] = useState('2026-1');
  const [grupo, setGrupo] = useState('01');

  // Formulario 2: Crear Nueva Asignatura
  const [newNombre, setNewNombre] = useState('');
  const [newCodigo, setNewCodigo] = useState('');
  const [newSemestre, setNewSemestre] = useState('1');
  const [newProgramaId, setNewProgramaId] = useState('');
  const [newPeriodo, setNewPeriodo] = useState('2026-1');
  const [newGrupo, setNewGrupo] = useState('01');

  // Cargar catálogo al abrir
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
            setNewProgramaId(progList[0].id.toString());
          }
          if (asigList.length > 0) {
            setSelectedAsignaturaId(asigList[0].id.toString());
          }
        }
      } catch {
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

  // Filtrar asignaturas por programa en modo catálogo
  const filteredAsignaturas = selectedPrograma
    ? asignaturas.filter((a) => a.programa_id?.toString() === selectedPrograma.toString())
    : asignaturas;

  // Sincronizar select de asignatura cuando cambia el programa
  useEffect(() => {
    if (filteredAsignaturas.length > 0) {
      setSelectedAsignaturaId(filteredAsignaturas[0].id.toString());
    } else {
      setSelectedAsignaturaId('');
    }
  }, [selectedPrograma, asignaturas]);

  // Cerrar con Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  // Envío Formulario 1: Vincular Existente
  const handleVincularExistente = async (e) => {
    e.preventDefault();
    if (!selectedAsignaturaId) {
      toast.error('Selecciona una asignatura de la lista');
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
      // Manejado por toast en AcademicContext
    } finally {
      setSubmitting(false);
    }
  };

  // Envío Formulario 2: Crear Nueva Asignatura y Vincular
  const handleCrearYVincular = async (e) => {
    e.preventDefault();
    if (!newNombre.trim()) {
      toast.error('Ingresa el nombre de la nueva asignatura');
      return;
    }
    if (!newCodigo.trim()) {
      toast.error('Ingresa el código de la asignatura');
      return;
    }
    if (!newProgramaId) {
      toast.error('Selecciona el programa académico');
      return;
    }

    try {
      setSubmitting(true);
      await crearYVincularAsignatura({
        programa_id: Number(newProgramaId),
        codigo: newCodigo.trim(),
        nombre: newNombre.trim(),
        semestre: newSemestre ? Number(newSemestre) : null,
        periodo_academico: newPeriodo.trim() || '2026-1',
        grupo: newGrupo.trim() || '01'
      });
      // Limpiar y cerrar
      setNewNombre('');
      setNewCodigo('');
      onClose();
    } catch {
      // Manejado por toast
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={20} style={{ color: 'var(--primary-color)' }} />
            <h3 className="modal-header__title">
              {activeTab === 'catalogo' ? 'Vincular Asignatura' : 'Crear Nueva Asignatura'}
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

        {/* Pestañas de modo */}
        <div className="modal-tabs">
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'catalogo' ? 'modal-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('catalogo')}
          >
            <BookOpen size={15} />
            <span>Seleccionar de Catálogo</span>
          </button>
          <button
            type="button"
            className={`modal-tab-btn ${activeTab === 'crear' ? 'modal-tab-btn--active' : ''}`}
            onClick={() => setActiveTab('crear')}
          >
            <Plus size={15} />
            <span>Crear Asignatura</span>
          </button>
        </div>

        {/* CONTENIDO MODO 1: Catálogo */}
        {activeTab === 'catalogo' && (
          <form onSubmit={handleVincularExistente}>
            <div className="modal-body">
              {loadingCatalog ? (
                <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>
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

                  {/* Acceso rápido para cambiar a modo crear si no está la materia */}
                  <div style={{ textAlign: 'right', marginTop: -4 }}>
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--primary-color)',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                        padding: 0,
                        textDecoration: 'underline'
                      }}
                      onClick={() => setActiveTab('crear')}
                    >
                      ¿Tu asignatura no aparece? Créala aquí
                    </button>
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
        )}

        {/* CONTENIDO MODO 2: Crear Nueva Asignatura in-place */}
        {activeTab === 'crear' && (
          <form onSubmit={handleCrearYVincular}>
            <div className="modal-body">
              <div className="modal-form-group">
                <label htmlFor="modal-new-programa" className="modal-label">
                  Programa Académico
                </label>
                <select
                  id="modal-new-programa"
                  className="modal-select"
                  value={newProgramaId}
                  onChange={(e) => setNewProgramaId(e.target.value)}
                  required
                >
                  {programas.map((prog) => (
                    <option key={prog.id} value={prog.id}>
                      {prog.codigo} - {prog.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="modal-form-group">
                <label htmlFor="modal-new-nombre" className="modal-label">
                  Nombre de la Asignatura
                </label>
                <input
                  id="modal-new-nombre"
                  type="text"
                  className="modal-input"
                  value={newNombre}
                  onChange={(e) => setNewNombre(e.target.value)}
                  placeholder="Ej. Inteligencia Artificial Aplicada"
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="modal-form-group">
                  <label htmlFor="modal-new-codigo" className="modal-label">
                    Código de Asignatura
                  </label>
                  <input
                    id="modal-new-codigo"
                    type="text"
                    className="modal-input"
                    value={newCodigo}
                    onChange={(e) => setNewCodigo(e.target.value)}
                    placeholder="Ej. IA-402"
                    required
                  />
                </div>

                <div className="modal-form-group">
                  <label htmlFor="modal-new-semestre" className="modal-label">
                    Semestre / Nivel
                  </label>
                  <input
                    id="modal-new-semestre"
                    type="number"
                    min="1"
                    max="12"
                    className="modal-input"
                    value={newSemestre}
                    onChange={(e) => setNewSemestre(e.target.value)}
                    placeholder="Ej. 6"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div className="modal-form-group">
                  <label htmlFor="modal-new-periodo" className="modal-label">
                    Periodo Inicial
                  </label>
                  <input
                    id="modal-new-periodo"
                    type="text"
                    className="modal-input"
                    value={newPeriodo}
                    onChange={(e) => setNewPeriodo(e.target.value)}
                    placeholder="Ej. 2026-1"
                    required
                  />
                </div>

                <div className="modal-form-group">
                  <label htmlFor="modal-new-grupo" className="modal-label">
                    Grupo Asignado
                  </label>
                  <input
                    id="modal-new-grupo"
                    type="text"
                    className="modal-input"
                    value={newGrupo}
                    onChange={(e) => setNewGrupo(e.target.value)}
                    placeholder="Ej. 01"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveTab('catalogo')}
                disabled={submitting}
              >
                Volver a Catálogo
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="sm"
                loading={submitting}
                icon={<FolderPlus size={16} />}
              >
                Crear y Vincular
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
