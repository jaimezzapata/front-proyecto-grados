import React, { useState } from 'react';
import { Button } from '../../../core/components/Button';
import { FileText, X, Copy, Check, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Modal desacoplado para previsualizar el texto extraído del documento de clase (SRP)
 */
export const MaterialPreviewModal = ({ isOpen, material, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !material) return null;

  const text = material.contenido_extraido || '';
  const isEmpty = text.trim().length === 0;

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('Texto copiado al portapapeles');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container"
        style={{ maxWidth: 640 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 'var(--border-radius-sm)',
                backgroundColor: 'var(--primary-color)',
                color: 'var(--primary-contrast)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: 'var(--border-width) solid var(--border-color)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <FileText size={18} />
            </div>
            <div>
              <h3 className="modal-title" style={{ fontSize: '1.05rem', margin: 0 }}>
                {material.titulo || material.nombre_original}
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                {material.formato?.toUpperCase() || 'DOCUMENTO'} • ~{text.length.toLocaleString()} caracteres extraídos
              </span>
            </div>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar vista previa"
          >
            <X size={20} />
          </button>
        </div>

        {/* Cuerpo con texto extraído */}
        <div className="modal-body">
          {isEmpty ? (
            <div
              style={{
                padding: '24px 16px',
                textAlign: 'center',
                backgroundColor: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid #F59E0B',
                borderRadius: 'var(--border-radius-sm)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 10
              }}
            >
              <AlertTriangle size={32} style={{ color: '#F59E0B' }} />
              <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem', fontWeight: 800 }}>
                Sin texto legible detectado
              </h4>
              <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: 440 }}>
                Este archivo no contiene texto seleccionable (posiblemente sea una fotocopia o imagen escaneada). La IA necesita texto real para formular preguntas. Te sugerimos subir una versión con texto seleccionable o en formato Word.
              </p>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: 'var(--bg-surface-hover)',
                border: 'var(--border-width) solid var(--border-color)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '16px',
                maxHeight: '50vh',
                overflowY: 'auto',
                fontSize: '0.86rem',
                lineHeight: 1.6,
                color: 'var(--text-primary)',
                whiteSpace: 'pre-wrap',
                fontFamily: 'monospace'
              }}
            >
              {text}
            </div>
          )}
        </div>

        {/* Pie con botón de copiar y cerrar */}
        <div className="modal-footer" style={{ padding: '12px 20px', display: 'flex', justifyContent: 'space-between' }}>
          {!isEmpty && (
            <Button
              variant="outline"
              size="sm"
              icon={copied ? <Check size={14} /> : <Copy size={14} />}
              onClick={handleCopy}
            >
              {copied ? 'Copiado' : 'Copiar Texto'}
            </Button>
          )}
          <Button variant="primary" size="sm" onClick={onClose} style={{ marginLeft: 'auto' }}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};
