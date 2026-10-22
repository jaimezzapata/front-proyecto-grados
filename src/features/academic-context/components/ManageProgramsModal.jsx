import React, { useState, useEffect } from 'react';
import { academicService } from '../services/academicService';
import { Button } from '../../../core/components/Button';
import {
  GraduationCap,
  X,
  Edit2,
  Check,
  Plus,
  AlertCircle,
  Sparkles,
  Save
} from 'lucide-react';
import toast from 'react-hot-toast';
import './courseCard.css';

/**
 * Modal para la gestión y edición de Programas Académicos (Módulo 1)
 * En CESDE los programas son Técnicos Laborales / Profesionales, no Universitarios.
 */
export const ManageProgramsModal = ({ isOpen, onClose, onProgramsUpdated }) => {
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editCodigo, setEditCodigo] = useState('');
  const [editNombre, setEditNombre] = useState('');
  const [savingId, setSavingId] = useState(null);

  // Formulario para crear un nuevo programa técnico
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newCodigo, setNewCodigo] = useState('');
  const [newNombre, setNewNombre] = useState('');
  const [creating, setCreating] = useState(false);

  // Cargar programas
  const fetchProgramas = async () => {
    try {
      setLoading(true);
      const data = await academicService.getProgramas();
      setProgramas(data || []);
    } catch {
      toast.error('No se pudo cargar la lista de programas académicos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchProgramas();
      setEditingId(null);
      setShowCreateForm(false);
    }
  }, [isOpen]);

  // Manejar tecla Escape
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const startEditing = (prog) => {
    setEditingId(prog.id);
    setEditCodigo(prog.codigo);
    setEditNombre(prog.nombre);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditCodigo('');
    setEditNombre('');
  };

  const handleUpdate = async (id) => {
    if (!editCodigo.trim()) {
      toast.error('El código del programa es obligatorio');
      return;
    }
    if (!editNombre.trim()) {
      toast.error('El nombre del programa es obligatorio');
      return;
    }

    try {
      setSavingId(id);
      await academicService.updatePrograma(id, {
        codigo: editCodigo.trim().toUpperCase(),
        nombre: editNombre.trim()
      });
      toast.success('¡Programa académico actualizado correctamente!');
      setEditingId(null);
      await fetchProgramas();
      if (onProgramsUpdated) onProgramsUpdated();
    } catch (error) {
      toast.error(error.message || 'Error al actualizar el programa académico');
    } finally {
      setSavingId(null);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCodigo.trim()) {
      toast.error('El código es obligatorio');
      return;
    }
    if (!newNombre.trim()) {
      toast.error('El nombre del programa es obligatorio');
      return;
    }

    try {
      setCreating(true);
      await academicService.createPrograma({
        codigo: newCodigo.trim().toUpperCase(),
        nombre: newNombre.trim()
      });
      toast.success('¡Nuevo programa técnico registrado exitosamente!');
      setNewCodigo('');
      setNewNombre('');
      setShowCreateForm(false);
      await fetchProgramas();
      if (onProgramsUpdated) onProgramsUpdated();
    } catch (error) {
      toast.error(error.message || 'Error al registrar el programa');
    } finally {
      setCreating(false);
    }
  };

  // Sugerencia rápida cuando detecta "Ingeniería de Software"
  const applyCesdeSuggestion = () => {
    setEditCodigo('TL-DS');
    setEditNombre('Técnico Laboral en Desarrollo de Software');
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container"
        style={{ maxWidth: 640 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del Modal */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 38,
                height: 38,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'var(--primary-color)',
                color: 'var(--primary-contrast)',
                borderRadius: 'var(--border-radius-sm)',
                border: 'var(--border-width) solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <GraduationCap size={20} />
            </div>
            <div>
              <h3 className="modal-title">Gestión de Programas Académicos</h3>
              <p
                style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  margin: 0
                }}
              >
                Catálogo institucional de formación técnica CESDE
              </p>
            </div>
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

        {/* Cuerpo del Modal */}
        <div className="modal-body" style={{ maxHeight: 'calc(85vh - 120px)', overflowY: 'auto' }}>
          {/* Banner explicativo CESDE */}
          <div
            style={{
              display: 'flex',
              gap: 12,
              padding: '14px',
              backgroundColor: 'var(--bg-surface-hover)',
              borderRadius: 'var(--border-radius-sm)',
              border: 'var(--border-width) solid var(--border-subtle)',
              marginBottom: 16
            }}
          >
            <AlertCircle size={20} style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: 2 }} />
            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45 }}>
              <strong style={{ color: 'var(--text-primary)', display: 'block', marginBottom: 2 }}>
                Programas Técnicos CESDE
              </strong>
              Los programas en el CESDE corresponden a <strong>formación técnica laboral o técnica profesional</strong> (no títulos universitarios profesionales). Puedes editar el nombre y código de los programas existentes o agregar nuevos programas técnicos.
            </div>
          </div>

          {/* Lista de programas */}
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>
              Cargando programas académicos...
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {programas.map((prog) => {
                const isEditing = editingId === prog.id;

                if (isEditing) {
                  return (
                    <div
                      key={prog.id}
                      style={{
                        padding: '14px',
                        backgroundColor: 'var(--bg-surface)',
                        border: 'var(--border-width) solid var(--primary-color)',
                        borderRadius: 'var(--border-radius-sm)',
                        boxShadow: 'var(--shadow-sm)',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 10
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--primary-color)' }}>
                          Editando Programa #{prog.id}
                        </span>
                        {/* Botón sugerencia CESDE si tiene nombre profesional */}
                        {prog.nombre?.toLowerCase().includes('ingenier') && (
                          <button
                            type="button"
                            onClick={applyCesdeSuggestion}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: 'var(--primary-color)',
                              fontSize: '0.76rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: 4
                            }}
                          >
                            <Sparkles size={13} />
                            Aplicar: Técnico Laboral
                          </button>
                        )}
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10 }}>
                        <div>
                          <label className="modal-label" style={{ fontSize: '0.78rem' }}>
                            Código
                          </label>
                          <input
                            type="text"
                            className="modal-input"
                            value={editCodigo}
                            onChange={(e) => setEditCodigo(e.target.value)}
                            placeholder="Ej. TL-DS"
                            required
                          />
                        </div>
                        <div>
                          <label className="modal-label" style={{ fontSize: '0.78rem' }}>
                            Nombre del Programa
                          </label>
                          <input
                            type="text"
                            className="modal-input"
                            value={editNombre}
                            onChange={(e) => setEditNombre(e.target.value)}
                            placeholder="Ej. Técnico Laboral en Desarrollo de Software"
                            required
                          />
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={cancelEditing}
                          disabled={savingId === prog.id}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          icon={<Save size={15} />}
                          loading={savingId === prog.id}
                          onClick={() => handleUpdate(prog.id)}
                        >
                          Guardar Cambios
                        </Button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={prog.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      backgroundColor: 'var(--bg-surface)',
                      border: 'var(--border-width) solid var(--border-color)',
                      borderRadius: 'var(--border-radius-sm)',
                      boxShadow: 'var(--shadow-sm)',
                      gap: 12
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                      <span
                        style={{
                          fontSize: '0.76rem',
                          fontWeight: 800,
                          padding: '4px 8px',
                          backgroundColor: 'var(--bg-surface-hover)',
                          color: 'var(--text-primary)',
                          borderRadius: 'var(--border-radius-sm)',
                          border: 'var(--border-width) solid var(--border-subtle)',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {prog.codigo}
                      </span>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            color: 'var(--text-primary)',
                            fontSize: '0.92rem',
                            wordBreak: 'break-word'
                          }}
                        >
                          {prog.nombre}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          Nivel de formación: Técnico Laboral
                        </span>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      icon={<Edit2 size={14} />}
                      onClick={() => startEditing(prog)}
                      title="Editar programa"
                    >
                      Editar
                    </Button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Formulario desplegable para agregar nuevo programa */}
          <div style={{ marginTop: 20 }}>
            {!showCreateForm ? (
              <Button
                variant="outline"
                size="sm"
                icon={<Plus size={15} />}
                onClick={() => setShowCreateForm(true)}
                style={{ width: '100%' }}
              >
                Registrar Nuevo Programa Técnico
              </Button>
            ) : (
              <form
                onSubmit={handleCreate}
                style={{
                  padding: '14px',
                  backgroundColor: 'var(--bg-surface-hover)',
                  border: 'var(--border-width) dashed var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 10
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-primary)' }}>
                    Nuevo Programa Técnico CESDE
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowCreateForm(false)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
                  >
                    <X size={16} />
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: 10 }}>
                  <div>
                    <label className="modal-label" style={{ fontSize: '0.78rem' }}>
                      Código
                    </label>
                    <input
                      type="text"
                      className="modal-input"
                      value={newCodigo}
                      onChange={(e) => setNewCodigo(e.target.value)}
                      placeholder="Ej. TL-DG"
                      required
                    />
                  </div>
                  <div>
                    <label className="modal-label" style={{ fontSize: '0.78rem' }}>
                      Nombre del Programa Técnico
                    </label>
                    <input
                      type="text"
                      className="modal-input"
                      value={newNombre}
                      onChange={(e) => setNewNombre(e.target.value)}
                      placeholder="Ej. Técnico Laboral en Diseño Gráfico"
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 4 }}>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowCreateForm(false)}
                    disabled={creating}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="sm"
                    loading={creating}
                    icon={<Plus size={15} />}
                  >
                    Registrar Programa
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Pie del Modal */}
        <div className="modal-footer">
          <Button variant="primary" size="sm" onClick={onClose}>
            Entendido / Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
