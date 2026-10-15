import React, { useState, useEffect } from 'react';
import { useAcademic } from '../context/AcademicContext';
import { academicService } from '../services/academicService';
import { Button } from '../../../core/components/Button';
import { X, Plus, BookOpen, MapPin, Briefcase, Clock, FolderPlus } from 'lucide-react';
import { getCurrentPeriod } from '../utils/academicUtils';
import { CesdeConfigFields } from './CesdeConfigFields';
import toast from 'react-hot-toast';
import './courseCard.css';

/**
 * Modal para vincular o crear asignaturas con contexto institucional CESDE:
 * - Sedes: Medellín | Bello
 * - Modalidades: Regular | Grupos Empresariales
 * - Jornadas: Mañana (AM) | Tarde (PM) | Noche
 * - Grupos: 01, 02, etc.
 */
export const LinkCourseModal = ({ isOpen, onClose }) => {
  const { vincularAsignatura, crearYVincularAsignatura, selectedPeriod } = useAcademic();

  // Modo activo: 'catalogo' | 'crear'
  const [activeTab, setActiveTab] = useState('catalogo');

  // Catálogos
  const [programas, setProgramas] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [loadingCatalog, setLoadingCatalog] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Periodo activo por defecto
  const defaultPeriod = selectedPeriod === 'ALL' ? getCurrentPeriod() : (selectedPeriod || getCurrentPeriod());

  // Parámetros Institucionales CESDE
  const [sede, setSede] = useState('Medellín');
  const [modalidad, setModalidad] = useState('Regular');
  const [jornada, setJornada] = useState('Mañana');
  const [periodo, setPeriodo] = useState(defaultPeriod);
  const [grupo, setGrupo] = useState('01');

  // Formulario 1: Vincular Existente
  const [selectedPrograma, setSelectedPrograma] = useState('');
  const [selectedAsignaturaId, setSelectedAsignaturaId] = useState('');

  // Formulario 2: Crear Nueva Asignatura
  const [newNombre, setNewNombre] = useState('');
  const [newCodigo, setNewCodigo] = useState('');
  const [newSemestre, setNewSemestre] = useState('1');
  const [newProgramaId, setNewProgramaId] = useState('');

  // Sincronizar periodos al abrir
  useEffect(() => {
    if (isOpen) {
      const p = selectedPeriod === 'ALL' ? getCurrentPeriod() : (selectedPeriod || getCurrentPeriod());
      setPeriodo(p);
    }
  }, [isOpen, selectedPeriod]);

  // Si la modalidad es Empresarial, ajustar jornada si estaba en 'Noche'
  useEffect(() => {
    if (modalidad === 'Empresarial' && jornada === 'Noche') {
      setJornada('Tarde');
    }
  }, [modalidad, jornada]);

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

  // Filtrar asignaturas por programa
  const filteredAsignaturas = selectedPrograma
    ? asignaturas.filter((a) => a.programa_id?.toString() === selectedPrograma.toString())
    : asignaturas;

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

  // Enviar Formulario 1: Vincular Existente
  const handleVincularExistente = async (e) => {
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
        grupo: grupo.trim() || '01',
        sede,
        modalidad,
        jornada
      });
      onClose();
    } catch {
      // Notificado en el context
    } finally {
      setSubmitting(false);
    }
  };

  // Enviar Formulario 2: Crear Nueva Asignatura y Vincular
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
        periodo_academico: periodo.trim() || '2026-2',
        grupo: grupo.trim() || '01',
        sede,
        modalidad,
        jornada
      });
      setNewNombre('');
      setNewCodigo('');
      onClose();
    } catch {
      // Notificado en el context
    } finally {
      setSubmitting(false);
    }
  };

  // Bloque común de configuración institucional CESDE reutilizable (DRY)
  const renderCesdeContextFields = () => (
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
      idPrefix="link-modal"
    />
  );

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <BookOpen size={20} style={{ color: 'var(--primary-color)' }} />
            <h3 className="modal-header__title">
              {activeTab === 'catalogo' ? 'Vincular Curso CESDE' : 'Crear Asignatura CESDE'}
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

                  {/* Acceso rápido para cambiar a modo crear */}
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
                      ¿Tu asignatura no aparece en la lista? Créala aquí
                    </button>
                  </div>

                  {/* Configuración CESDE: Sede, Modalidad, Jornada, Periodo, Grupo */}
                  {renderCesdeContextFields()}
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
                Vincular Curso
              </Button>
            </div>
          </form>
        )}

        {/* CONTENIDO MODO 2: Crear Nueva Asignatura */}
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
                  placeholder="Ej. Introducción a la Programación"
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
                    placeholder="Ej. PR-101"
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
                    placeholder="Ej. 1"
                  />
                </div>
              </div>

              {/* Configuración CESDE: Sede, Modalidad, Jornada, Periodo, Grupo */}
              {renderCesdeContextFields()}
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
