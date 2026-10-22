import React, { useState, useEffect } from 'react';
import { examService } from '../../exam-generation/services/examService';
import { Button } from '../../../core/components/Button';
import { Sparkles, X, BrainCircuit, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Modal desacoplado para crear una evaluación con IA ligada a la asignatura (SRP)
 */
export const CreateExamModal = ({
  isOpen,
  asignaturaId,
  asignaturaNombre,
  materials = [],
  preselectedMaterialId = null,
  onClose,
  onExamCreated
}) => {
  const [titulo, setTitulo] = useState('');
  const [nivelBloom, setNivelBloom] = useState('Comprender');
  const [cantidadPreguntas, setCantidadPreguntas] = useState(5);
  const [tipoPreguntas, setTipoPreguntas] = useState('OPCION_MULTIPLE');
  const [fuenteTipo, setFuenteTipo] = useState('MANUAL');
  const [selectedMaterialId, setSelectedMaterialId] = useState('');
  const [temaManual, setTemaManual] = useState('');
  const [loading, setLoading] = useState(false);

  // Sincronizar selección de material cuando se abre el modal o cambian los materiales
  useEffect(() => {
    if (isOpen) {
      if (preselectedMaterialId) {
        setSelectedMaterialId(preselectedMaterialId);
        setFuenteTipo('DOCUMENTO');
      } else if (materials && materials.length > 0) {
        setSelectedMaterialId((prev) => {
          if (prev && materials.some((m) => m.id === prev)) return prev;
          return materials[0].id;
        });
        setFuenteTipo('DOCUMENTO');
      } else {
        setFuenteTipo('MANUAL');
      }
    }
  }, [isOpen, preselectedMaterialId, materials]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) {
      toast.error('Ingresa un título para la evaluación');
      return;
    }

    const matId = selectedMaterialId || (materials.length > 0 ? materials[0].id : null);

    if (fuenteTipo === 'DOCUMENTO' && !matId) {
      toast.error('No hay documentos disponibles. Selecciona ingreso manual.');
      return;
    }

    if (fuenteTipo === 'MANUAL' && !temaManual.trim()) {
      toast.error('Ingresa el tema o conceptos clave para que la IA genere el examen');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        asignatura_id: Number(asignaturaId),
        titulo_personalizado: titulo.trim(),
        nivel_bloom: nivelBloom,
        cantidad_preguntas: Number(cantidadPreguntas),
        tipo_preguntas: tipoPreguntas
      };

      if (fuenteTipo === 'DOCUMENTO' && matId) {
        payload.material_id = matId;
      } else {
        payload.texto_manual = temaManual.trim();
      }

      toast.loading('Generando evaluación con Inteligencia Artificial...', { id: 'generating-exam' });
      const result = await examService.generateExam(payload);
      toast.dismiss('generating-exam');
      toast.success('¡Evaluación generada con éxito por el motor de IA!');

      onExamCreated(result);
      onClose();
    } catch (error) {
      toast.dismiss('generating-exam');
      toast.error(error.message || 'Error al generar la evaluación con IA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container"
        style={{ maxWidth: 560 }}
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
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="modal-title">Nueva Evaluación con IA</h3>
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
            disabled={loading}
          >
            <X size={20} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="modal-body" style={{ maxHeight: 'calc(85vh - 120px)', overflowY: 'auto' }}>
          {/* Título de la evaluación */}
          <div>
            <label className="modal-label">Título del Examen / Evaluación</label>
            <input
              type="text"
              className="modal-input"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej. Parcial 1: Fundamentos y Conceptos Clave"
              required
              disabled={loading}
            />
          </div>

          {/* Selector de Fuente: Documento Cargado vs Tema Manual */}
          <div>
            <label className="modal-label">Fuente de Contenido para la IA</label>
            <div style={{ display: 'flex', gap: 8, marginTop: 4 }}>
              <button
                type="button"
                className={`modal-tab-btn ${fuenteTipo === 'DOCUMENTO' ? 'modal-tab-btn--active' : ''}`}
                style={{
                  flex: 1,
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--border-radius-sm)',
                  padding: '8px 12px',
                  opacity: materials.length === 0 ? 0.5 : 1
                }}
                onClick={() => setFuenteTipo('DOCUMENTO')}
                disabled={materials.length === 0 || loading}
              >
                <FileText size={14} /> Documento Cargado ({materials.length})
              </button>
              <button
                type="button"
                className={`modal-tab-btn ${fuenteTipo === 'MANUAL' ? 'modal-tab-btn--active' : ''}`}
                style={{ flex: 1, border: '1px solid var(--border-color)', borderRadius: 'var(--border-radius-sm)', padding: '8px 12px' }}
                onClick={() => setFuenteTipo('MANUAL')}
                disabled={loading}
              >
                Tema o Texto Manual
              </button>
            </div>
          </div>

          {/* Si eligió documento cargado */}
          {fuenteTipo === 'DOCUMENTO' && (
            <div>
              <label className="modal-label">Selecciona el Documento de Clase</label>
              <select
                className="modal-input"
                value={selectedMaterialId}
                onChange={(e) => setSelectedMaterialId(e.target.value)}
                required
                disabled={loading}
              >
                {materials.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.titulo || m.nombre_original} ({m.tipo_archivo?.toUpperCase() || m.formato?.toUpperCase() || 'DOC'})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Si eligió texto manual */}
          {fuenteTipo === 'MANUAL' && (
            <div>
              <label className="modal-label">Tema o Contenido a Evaluar</label>
              <textarea
                className="modal-input"
                rows={4}
                value={temaManual}
                onChange={(e) => setTemaManual(e.target.value)}
                placeholder="Describe los temas vistos en clase, conceptos clave o copia el temario para que la IA elabore las preguntas pedagógicas..."
                required
                disabled={loading}
              />
            </div>
          )}

          {/* Nivel de Bloom y Cantidad de Preguntas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <label className="modal-label">Nivel Taxonomía Bloom</label>
              <select
                className="modal-input"
                value={nivelBloom}
                onChange={(e) => setNivelBloom(e.target.value)}
                disabled={loading}
              >
                <option value="Recordar">Recordar (Memorístico)</option>
                <option value="Comprender">Comprender (Explicativo)</option>
                <option value="Aplicar">Aplicar (Práctico/Casos)</option>
                <option value="Analizar">Analizar (Estructura)</option>
                <option value="Evaluar">Evaluar (Criterio Crítico)</option>
                <option value="Crear">Crear (Diseño y Solución)</option>
              </select>
            </div>

            <div>
              <label className="modal-label">Nº de Preguntas</label>
              <select
                className="modal-input"
                value={cantidadPreguntas}
                onChange={(e) => setCantidadPreguntas(e.target.value)}
                disabled={loading}
              >
                <option value={2}>2 preguntas (Rápido prueba)</option>
                <option value={3}>3 preguntas</option>
                <option value={5}>5 preguntas (Estándar)</option>
                <option value={10}>10 preguntas (Completo)</option>
              </select>
            </div>
          </div>

          {/* Tipo de Preguntas */}
          <div>
            <label className="modal-label">Tipo de Preguntas</label>
            <select
              className="modal-input"
              value={tipoPreguntas}
              onChange={(e) => setTipoPreguntas(e.target.value)}
              disabled={loading}
            >
              <option value="OPCION_MULTIPLE">Opción Múltiple (con 4 alternativas)</option>
              <option value="VERDADERO_FALSO">Verdadero / Falso con justificación</option>
              <option value="DESARROLLO_CORTO">Preguntas Abiertas de Respuesta Corta</option>
            </select>
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
              icon={<BrainCircuit size={16} />}
            >
              {loading ? 'Generando con IA...' : 'Generar con IA'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
