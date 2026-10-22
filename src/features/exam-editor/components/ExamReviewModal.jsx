import React, { useState, useEffect } from 'react';
import { examService } from '../../exam-generation/services/examService';
import { ExamReviewHeader } from './ExamReviewHeader';
import { QuestionReviewCard } from './QuestionReviewCard';
import { PrintableExamView } from '../../export-dashboard/components/PrintableExamView';
import { PageLoader } from '../../../core/components/Loader';
import { ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';

/**
 * Modal orquestador para la revisión Human-in-the-Loop, aprobación e impresión de evaluaciones (SRP)
 */
export const ExamReviewModal = ({ isOpen, examId, onClose, onStatusUpdated }) => {
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [mode, setMode] = useState('review'); // 'review' | 'print'

  useEffect(() => {
    if (isOpen && examId) {
      setMode('review');
      const fetchDetail = async () => {
        try {
          setLoading(true);
          const data = await examService.getEvaluacionById(examId);
          setExam(data);
        } catch {
          toast.error('No se pudo cargar el detalle de la evaluación');
          onClose();
        } finally {
          setLoading(false);
        }
      };
      fetchDetail();
    }
  }, [isOpen, examId]);

  if (!isOpen) return null;

  const handleApprove = async () => {
    if (!exam?.id) return;
    try {
      setApproving(true);
      await examService.updateStatus(exam.id, 'APROBADO');
      toast.success('¡Evaluación aprobada formalmente! Ahora está lista para imprimir.');
      setExam((prev) => ({ ...prev, estado: 'APROBADO' }));
      onStatusUpdated?.(exam.id, 'APROBADO');
    } catch (error) {
      toast.error(error.message || 'Error al aprobar la evaluación');
    } finally {
      setApproving(false);
    }
  };

  const isApproved = exam?.estado === 'APROBADO';
  const preguntas = exam?.preguntas || [];

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container"
        style={{
          maxWidth: mode === 'print' ? 900 : 760,
          maxHeight: '92vh',
          width: '95%'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {loading ? (
          <div style={{ padding: '60px 0', textAlign: 'center' }}>
            <PageLoader message="Cargando examen y preguntas pedagógicas..." />
          </div>
        ) : mode === 'print' ? (
          <div style={{ padding: 16 }}>
            <PrintableExamView exam={exam} onBack={() => setMode('review')} />
          </div>
        ) : (
          <>
            {/* Cabecera de Revisión */}
            <ExamReviewHeader
              exam={exam}
              isApproved={isApproved}
              approving={approving}
              onApprove={handleApprove}
              onOpenPrint={() => setMode('print')}
              onClose={onClose}
            />

            {/* Banner Informativo Human-in-the-Loop */}
            <div style={{ padding: '0 20px', marginTop: 14 }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  backgroundColor: 'var(--bg-surface-hover)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--border-radius-sm)',
                  fontSize: '0.82rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <ShieldCheck size={18} style={{ color: isApproved ? '#10B981' : 'var(--primary-color)', flexShrink: 0 }} />
                <span>
                  <strong>Supervisión Docente (Human-in-the-Loop):</strong> Revisa cada pregunta y justificación formulada por la IA. Una vez verificado, haz clic en <strong>"Aprobar Evaluación"</strong> para habilitar su formato de impresión.
                </span>
              </div>
            </div>

            {/* Listado de Preguntas */}
            <div
              className="modal-body"
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                maxHeight: 'calc(80vh - 160px)',
                overflowY: 'auto',
                padding: 20
              }}
            >
              {preguntas.map((q, idx) => (
                <QuestionReviewCard key={q.id || idx} question={q} index={idx} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
