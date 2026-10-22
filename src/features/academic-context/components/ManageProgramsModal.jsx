import React, { useState, useEffect } from 'react';
import { academicService } from '../services/academicService';
import { ProgramRow } from './ProgramRow';
import { CreateProgramForm } from './CreateProgramForm';
import { Button } from '../../../core/components/Button';
import { GraduationCap, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import './courseCard.css';

/**
 * Modal orquestador para la gestión de Programas Académicos Técnicos (Módulo 1)
 * Desacoplado, atómico y compatible con SRP (Single Responsibility Principle)
 */
export const ManageProgramsModal = ({ isOpen, onClose, onProgramsUpdated }) => {
  const [programas, setProgramas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [creating, setCreating] = useState(false);

  // Cargar programas desde la API
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

  // Actualizar un programa existente
  const handleUpdate = async (id, formData) => {
    if (!formData.codigo || !formData.nombre) {
      toast.error('El código y el nombre del programa son obligatorios');
      return;
    }

    try {
      setSavingId(id);
      await academicService.updatePrograma(id, formData);
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

  // Registrar un nuevo programa técnico
  const handleCreate = async (formData, onSuccess) => {
    if (!formData.codigo || !formData.nombre) {
      toast.error('El código y el nombre del programa son obligatorios');
      return;
    }

    try {
      setCreating(true);
      await academicService.createPrograma(formData);
      toast.success('¡Nuevo programa técnico registrado exitosamente!');
      if (onSuccess) onSuccess();
      await fetchProgramas();
      if (onProgramsUpdated) onProgramsUpdated();
    } catch (error) {
      toast.error(error.message || 'Error al registrar el programa');
    } finally {
      setCreating(false);
    }
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
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
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
              Los programas en el CESDE corresponden a <strong>formación técnica laboral o técnica profesional</strong>. Puedes editar el nombre y código de los programas existentes o agregar nuevos programas técnicos.
            </div>
          </div>

          {/* Listado de programas atómicos */}
          {loading ? (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '24px 0' }}>
              Cargando programas académicos...
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {programas.map((prog) => (
                <ProgramRow
                  key={prog.id}
                  programa={prog}
                  isEditing={editingId === prog.id}
                  isSaving={savingId === prog.id}
                  onStartEdit={() => setEditingId(prog.id)}
                  onCancelEdit={() => setEditingId(null)}
                  onSave={handleUpdate}
                />
              ))}
            </div>
          )}

          {/* Formulario desacoplado para nuevo programa */}
          <CreateProgramForm onCreate={handleCreate} isCreating={creating} />
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
