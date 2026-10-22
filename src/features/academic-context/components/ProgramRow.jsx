import React, { useState, useEffect } from 'react';
import { Button } from '../../../core/components/Button';
import { Edit2, Sparkles, Save } from 'lucide-react';

/**
 * Componente atómico para cada fila de Programa Académico
 * Soporta modo visualización y modo edición en línea (SRP)
 */
export const ProgramRow = ({
  programa,
  isEditing,
  isSaving,
  onStartEdit,
  onCancelEdit,
  onSave
}) => {
  const [editCodigo, setEditCodigo] = useState(programa.codigo || '');
  const [editNombre, setEditNombre] = useState(programa.nombre || '');

  useEffect(() => {
    if (isEditing) {
      setEditCodigo(programa.codigo || '');
      setEditNombre(programa.nombre || '');
    }
  }, [isEditing, programa]);

  const applyCesdeSuggestion = () => {
    setEditCodigo('TL-DS');
    setEditNombre('Técnico Laboral en Desarrollo de Software');
  };

  const handleSave = () => {
    onSave(programa.id, {
      codigo: editCodigo.trim().toUpperCase(),
      nombre: editNombre.trim()
    });
  };

  if (isEditing) {
    return (
      <div
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
            Editando Programa #{programa.id}
          </span>
          {programa.nombre?.toLowerCase().includes('ingenier') && (
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
            <label className="modal-label" style={{ fontSize: '0.78rem' }}>Código</label>
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
            <label className="modal-label" style={{ fontSize: '0.78rem' }}>Nombre del Programa</label>
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
          <Button variant="ghost" size="sm" onClick={onCancelEdit} disabled={isSaving}>
            Cancelar
          </Button>
          <Button
            variant="primary"
            size="sm"
            icon={<Save size={15} />}
            loading={isSaving}
            onClick={handleSave}
          >
            Guardar Cambios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div
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
          {programa.codigo}
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
            {programa.nombre}
          </div>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Nivel de formación: Técnico Laboral
          </span>
        </div>
      </div>

      <Button
        variant="surface"
        size="sm"
        icon={<Edit2 size={14} />}
        onClick={onStartEdit}
        title="Editar programa"
      >
        Editar
      </Button>
    </div>
  );
};
