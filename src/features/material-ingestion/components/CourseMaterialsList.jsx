import React from 'react';
import { Button } from '../../../core/components/Button';
import { FileText, Trash2, UploadCloud, Calendar, AlignLeft, Eye, Sparkles, AlertTriangle } from 'lucide-react';

/**
 * Cuadrícula/Lista desacoplada de documentos de clase con acciones de preview y generación rápida (SRP)
 */
export const CourseMaterialsList = ({
  materials,
  loading,
  onOpenUpload,
  onDeleteMaterial,
  onPreviewMaterial,
  onGenerateFromMaterial
}) => {
  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>
        <p>Cargando documentación de la materia...</p>
      </div>
    );
  }

  if (!materials || materials.length === 0) {
    return (
      <div
        style={{
          padding: '48px 24px',
          textAlign: 'center',
          backgroundColor: 'var(--bg-surface)',
          border: 'var(--border-width) dashed var(--border-color)',
          borderRadius: 'var(--border-radius)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 16
        }}
      >
        <div
          style={{
            width: 52,
            height: 52,
            borderRadius: 'var(--border-radius-sm)',
            backgroundColor: 'var(--bg-surface-hover)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--primary-color)',
            border: 'var(--border-width) solid var(--border-subtle)'
          }}
        >
          <UploadCloud size={26} />
        </div>

        <div>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 800, margin: '0 0 6px', color: 'var(--text-primary)' }}>
            Sin documentación de clase cargada
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0, maxWidth: 440 }}>
            Sube el sílabo, guías de estudio o documentos en PDF/Word para que la Inteligencia Artificial genere evaluaciones pedagógicas basadas en el contenido real de tu clase.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={<UploadCloud size={16} />}
          onClick={onOpenUpload}
        >
          Cargar Primer Documento
        </Button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
        gap: 16
      }}
    >
      {materials.map((mat) => {
        const fecha = mat.created_at ? new Date(mat.created_at).toLocaleDateString('es-CO') : 'Reciente';
        const charCount = mat.contenido_extraido ? mat.contenido_extraido.length : 0;
        const isEmpty = charCount === 0;

        return (
          <div
            key={mat.id}
            style={{
              backgroundColor: 'var(--bg-surface)',
              border: 'var(--border-width) solid var(--border-color)',
              borderRadius: 'var(--border-radius)',
              padding: '16px',
              boxShadow: 'var(--shadow-sm)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: 12
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    padding: '2px 6px',
                    borderRadius: 'var(--border-radius-sm)',
                    backgroundColor: isEmpty ? '#F59E0B' : '#10B981',
                    color: isEmpty ? '#000000' : '#FFFFFF',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4
                  }}
                >
                  {isEmpty && <AlertTriangle size={11} />}
                  {isEmpty ? 'Sin Texto Seleccionable' : 'Texto Extraído'}
                </span>
                <span style={{ fontSize: '0.74rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Calendar size={12} />
                  {fecha}
                </span>
              </div>

              <h4
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.02rem',
                  fontWeight: 800,
                  margin: '0 0 6px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.3
                }}
              >
                {mat.titulo || mat.nombre_original}
              </h4>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <FileText size={13} style={{ color: 'var(--primary-color)' }} />
                  {mat.tipo_archivo?.toUpperCase() || mat.formato?.toUpperCase() || 'DOCUMENTO'}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                  <AlignLeft size={13} />
                  ~{charCount.toLocaleString()} caracteres
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingTop: 10,
                borderTop: '1px solid var(--border-subtle)',
                gap: 6,
                flexWrap: 'wrap'
              }}
            >
              <button
                type="button"
                onClick={() => onDeleteMaterial(mat.id)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 6,
                  borderRadius: 'var(--border-radius-sm)',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Eliminar documento"
                aria-label="Eliminar documento"
              >
                <Trash2 size={16} />
              </button>

              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <Button
                  variant="outline"
                  size="sm"
                  icon={<Eye size={13} />}
                  onClick={() => onPreviewMaterial?.(mat)}
                  title="Ver el texto extraído del documento"
                >
                  Ver Texto
                </Button>

                {!isEmpty && (
                  <Button
                    variant="primary"
                    size="sm"
                    icon={<Sparkles size={13} />}
                    onClick={() => onGenerateFromMaterial?.(mat)}
                    title="Crear evaluación con IA basada en este documento"
                  >
                    Crear Examen
                  </Button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
