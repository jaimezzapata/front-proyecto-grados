import React from 'react';
import { CheckCircle2, Circle, Sparkles, HelpCircle } from 'lucide-react';

/**
 * Tarjeta individual atómica para revisar una pregunta pedagógica (Human-in-the-Loop) (SRP)
 */
export const QuestionReviewCard = ({ question, index }) => {
  const opciones = question.opciones || [];
  const puntaje = question.puntaje || 1;

  return (
    <div
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: 'var(--border-width) solid var(--border-color)',
        borderRadius: 'var(--border-radius)',
        padding: '18px',
        boxShadow: 'var(--shadow-sm)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        textAlign: 'left'
      }}
    >
      {/* Cabecera de la pregunta con badges */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              width: 28,
              height: 28,
              borderRadius: 'var(--border-radius-sm)',
              backgroundColor: 'var(--primary-color)',
              color: 'var(--primary-contrast)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '0.85rem'
            }}
          >
            {index + 1}
          </span>
          <span
            style={{
              fontSize: '0.74rem',
              fontWeight: 800,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              padding: '2px 8px',
              backgroundColor: 'var(--bg-surface-hover)',
              borderRadius: 'var(--border-radius-sm)',
              border: '1px solid var(--border-subtle)',
              color: 'var(--text-secondary)'
            }}
          >
            {question.tipo_pregunta?.replace('_', ' ') || 'OPCIÓN MÚLTIPLE'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {question.nivel_bloom && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '2px 8px',
                backgroundColor: 'rgba(245, 158, 11, 0.12)',
                color: '#D97706',
                border: '1px solid #F59E0B',
                borderRadius: 'var(--border-radius-sm)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4
              }}
            >
              <Sparkles size={11} />
              Bloom: {question.nivel_bloom}
            </span>
          )}
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            {puntaje} {puntaje === 1 ? 'punto' : 'puntos'}
          </span>
        </div>
      </div>

      {/* Enunciado */}
      <p style={{ margin: 0, fontSize: '0.98rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.45 }}>
        {question.enunciado}
      </p>

      {/* Alternativas / Opciones de respuesta */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {opciones.map((opt, optIdx) => {
          const letter = String.fromCharCode(65 + optIdx); // A, B, C, D
          const isCorrect = Boolean(opt.es_correcta);

          return (
            <div
              key={opt.id || optIdx}
              style={{
                border: isCorrect ? '2px solid #10B981' : '1px solid var(--border-subtle)',
                backgroundColor: isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'var(--bg-surface)',
                borderRadius: 'var(--border-radius-sm)',
                padding: '10px 14px',
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                <span
                  style={{
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    color: isCorrect ? '#10B981' : 'var(--text-muted)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6
                  }}
                >
                  {isCorrect ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                  {letter})
                </span>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: isCorrect ? 700 : 500, flex: 1 }}>
                  {opt.texto_opcion}
                </span>
              </div>

              {opt.retroalimentacion && (
                <span style={{ fontSize: '0.78rem', color: isCorrect ? '#059669' : 'var(--text-muted)', marginLeft: 26 }}>
                  {opt.retroalimentacion}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* Justificación pedagógica Bloom */}
      {question.justificacion_pedagogica && (
        <div
          style={{
            padding: '8px 12px',
            backgroundColor: 'var(--bg-surface-hover)',
            borderRadius: 'var(--border-radius-sm)',
            fontSize: '0.8rem',
            color: 'var(--text-secondary)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: 6
          }}
        >
          <HelpCircle size={14} style={{ color: 'var(--primary-color)', flexShrink: 0, marginTop: 2 }} />
          <span>
            <strong>Justificación pedagógica:</strong> {question.justificacion_pedagogica}
          </span>
        </div>
      )}
    </div>
  );
};
