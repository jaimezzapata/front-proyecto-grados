import React, { useState, useRef } from 'react';
import { materialService } from '../services/materialService';
import { Button } from '../../../core/components/Button';
import { UploadCloud, X, FileText, CheckCircle2 } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Modal atómico para subir documentación y material de clase (.pdf, .docx, .txt) con Drag & Drop (SRP)
 */
export const UploadMaterialModal = ({
  isOpen,
  asignaturaId,
  asignaturaNombre,
  onClose,
  onMaterialUploaded
}) => {
  const [file, setFile] = useState(null);
  const [titulo, setTitulo] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  if (!isOpen) return null;

  const processFile = (selectedFile) => {
    if (!selectedFile) return;
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'docx', 'doc', 'txt'].includes(ext)) {
      toast.error('Formato no soportado. Por favor sube un archivo PDF, Word o TXT');
      return;
    }
    if (selectedFile.size > 15 * 1024 * 1024) {
      toast.error('El archivo excede el tamaño máximo permitido de 15MB');
      return;
    }
    setFile(selectedFile);
    if (!titulo) {
      setTitulo(selectedFile.name.replace(/\.[^/.]+$/, ''));
    }
  };

  const handleFileChange = (e) => {
    processFile(e.target.files?.[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    processFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Por favor selecciona un archivo PDF, Word o TXT');
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('archivo', file);
      formData.append('asignatura_id', String(asignaturaId));
      if (titulo.trim()) {
        formData.append('titulo', titulo.trim());
      }

      const result = await materialService.uploadMaterial(formData);

      if (!result.contenido_extraido || result.contenido_extraido.trim().length === 0) {
        toast('Documento subido, pero no contiene texto seleccionable (parece ser una imagen escaneada).', {
          icon: '⚠️',
          duration: 5000
        });
      } else {
        toast.success(`¡Documento procesado! ~${result.contenido_extraido.length.toLocaleString()} caracteres extraídos.`);
      }

      onMaterialUploaded(result);
      onClose();
      setFile(null);
      setTitulo('');
    } catch (error) {
      toast.error(error.message || 'Error al procesar el archivo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container"
        style={{ maxWidth: 520 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera */}
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
              <UploadCloud size={20} />
            </div>
            <div>
              <h3 className="modal-title">Cargar Documentación de Clase</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Para: <strong>{asignaturaNombre}</strong>
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

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="modal-body">
          {/* Zona de selección y arrastre de archivo (Drag & Drop) */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            style={{
              border: isDragging ? '2px dashed var(--primary-color)' : '2px dashed var(--border-color)',
              borderRadius: 'var(--border-radius)',
              padding: '28px 16px',
              textAlign: 'center',
              backgroundColor: isDragging
                ? 'var(--bg-surface-hover)'
                : file
                ? 'var(--bg-surface-hover)'
                : 'transparent',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
              transition: 'all 0.15s ease'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.doc,.txt"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />

            {file ? (
              <>
                <CheckCircle2 size={34} style={{ color: '#10B981' }} />
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  {file.name}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {(file.size / 1024 / 1024).toFixed(2)} MB • Haz clic para cambiar archivo
                </span>
              </>
            ) : (
              <>
                <FileText size={34} style={{ color: isDragging ? 'var(--primary-color)' : 'var(--text-muted)' }} />
                <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                  {isDragging ? '¡Suelta tu documento aquí!' : 'Arrastra o haz clic para seleccionar tu documento'}
                </span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  Formatos soportados: PDF, Word (.docx) o TXT (máximo 15MB)
                </span>
              </>
            )}
          </div>

          {/* Título opcional del material */}
          <div style={{ marginTop: 8 }}>
            <label className="modal-label">Título o Descripción del Documento</label>
            <input
              type="text"
              className="modal-input"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Guía de Estudio - Unidad 1"
            />
          </div>

          <div className="modal-footer" style={{ padding: '14px 0 0', borderTop: '1px solid var(--border-subtle)' }}>
            <Button variant="ghost" size="sm" onClick={onClose} disabled={loading}>
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={loading}
              icon={<UploadCloud size={16} />}
              disabled={!file}
            >
              Procesar y Extraer Texto
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
