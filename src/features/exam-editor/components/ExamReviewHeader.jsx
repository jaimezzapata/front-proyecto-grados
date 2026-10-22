import React from 'react';
import { Button } from '../../../core/components/Button';
import { CheckCircle2, Printer, X, Sparkles, Clock, FileCheck } from 'lucide-react';

/**
 * Cabecera institucional atómica para la revisión de evaluación (Human-in-the-Loop) (SRP)
 */
export const ExamReviewHeader = ({
  exam,
  isApproved,
  approving,
  onApprove,
  onOpenPrint,
  onClose
}) => {
  const preguntasCount = exam?.preguntas ? exam.preguntas.length : 0;
  const fecha = exam?.created_at ? new Date(exam.created_at).toLocaleDateString('es-CO') : 'Reciente';

  return (
    <div className="modal-header" style={{ padding: '16px 20px', flexWrap: 'wrap', gap: 12 }}>
      {/* Título y metadatos */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 260, flex: 1 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--border-radius-sm)',
            backgroundColor: isApproved ? '#10B981' : 'var(--primary-color)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: 'var(--border-width) solid var(--border-color)',
            boxShadow: 'var(--shadow-sm)',
            flexShrink: 0
          }}
        >
          {isApproved ? <FileCheck size={20} /> : <Sparkles size={20} />}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 2 }}>
            <h3 className="modal-title" style={{ margin: 0, fontSize: '1.15rem' }}>
              {exam?.titulo || 'Revisión de Evaluación'}
            </h3>
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                padding: '2px 8px',
                borderRadius: 'var(--border-radius-sm)',
                backgroundColor: isApproved ? '#10B981' : 'var(--primary-color)',
                color: '#FFFFFF'
              }}
            >
              {isApproved ? 'Aprobado' : 'Generado con IA'}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>{preguntasCount} preguntas estructuradas</span>
            <span>•</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>
              <Clock size={11} /> {fecha}
            </span>
          </p>
        </div>
      </div>

      {/* Botones de acción Human-in-the-Loop */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {!isApproved ? (
          <Button
            variant="primary"
            size="sm"
            icon={<CheckCircle2 size={16} />}
            loading={approving}
            onClick={onApprove}
            title="Aprobar formalmente la evaluación para habilitar impresión oficial"
          >
            Aprobar Evaluación
          </Button>
        ) : (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              fontSize: '0.8rem',
              fontWeight: 800,
              color: '#10B981',
              padding: '6px 10px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              borderRadius: 'var(--border-radius-sm)',
              border: '1px solid #10B981'
            }}
          >
            <CheckCircle2 size={15} /> Aprobado por el Docente
          </span>
        )}

        <Button
          variant="surface"
          size="sm"
          icon={<Printer size={16} />}
          onClick={onOpenPrint}
          title="Ver formato oficial para impresión o descarga PDF"
        >
          Imprimir Examen
        </Button>

        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Cerrar visor"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
};
