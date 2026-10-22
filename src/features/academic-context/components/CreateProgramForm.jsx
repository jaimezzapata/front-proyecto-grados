import React, { useState } from 'react';
import { Button } from '../../../core/components/Button';
import { Plus, X } from 'lucide-react';

/**
 * Formulario desacoplado para registrar un nuevo Programa Técnico CESDE (SRP)
 */
export const CreateProgramForm = ({ onCreate, isCreating }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newCodigo, setNewCodigo] = useState('');
  const [newNombre, setNewNombre] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreate(
      {
        codigo: newCodigo.trim().toUpperCase(),
        nombre: newNombre.trim()
      },
      () => {
        // Callback de éxito para limpiar y cerrar
        setNewCodigo('');
        setNewNombre('');
        setIsOpen(false);
      }
    );
  };

  if (!isOpen) {
    return (
      <div style={{ marginTop: 20 }}>
        <Button
          variant="surface"
          size="sm"
          icon={<Plus size={15} />}
          onClick={() => setIsOpen(true)}
          style={{ width: '100%' }}
        >
          Registrar Nuevo Programa Técnico
        </Button>
      </div>
    );
  }

  return (
    <div style={{ marginTop: 20 }}>
      <form
        onSubmit={handleSubmit}
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
            onClick={() => setIsOpen(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}
            aria-label="Cerrar formulario de registro"
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
            onClick={() => setIsOpen(false)}
            disabled={isCreating}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="primary"
            size="sm"
            loading={isCreating}
            icon={<Plus size={15} />}
          >
            Registrar Programa
          </Button>
        </div>
      </form>
    </div>
  );
};
