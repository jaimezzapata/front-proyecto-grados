import React, { useState } from 'react';
import { Button } from '../../../core/components/Button';
import { Printer, Eye, CheckCircle2, ArrowLeft } from 'lucide-react';
import './printableExam.css';

/**
 * Vista de formato oficial imprimible para el estudiante y clave docente (Módulo 5: Exportación / MVP 1) (SRP)
 */
export const PrintableExamView = ({ exam, onBack }) => {
  const [viewMode, setViewMode] = useState('student'); // 'student' | 'teacher'
  const preguntas = exam?.preguntas || [];
  const asignatura = exam?.asignatura || {};
  const fecha = exam?.created_at ? new Date(exam.created_at).toLocaleDateString('es-CO') : new Date().toLocaleDateString('es-CO');

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="printable-wrapper">
      {/* Barra de control en pantalla (Oculta al imprimir) */}
      <div className="printable-controls no-print">
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Button variant="ghost" size="sm" icon={<ArrowLeft size={16} />} onClick={onBack}>
            Volver a Revisión
          </Button>
          <div className="printable-mode-toggle">
            <button
              type="button"
              className={`printable-toggle-btn ${viewMode === 'student' ? 'printable-toggle-btn--active' : ''}`}
              onClick={() => setViewMode('student')}
            >
              <Eye size={14} /> Versión Estudiante (Sin Respuestas)
            </button>
            <button
              type="button"
              className={`printable-toggle-btn ${viewMode === 'teacher' ? 'printable-toggle-btn--active' : ''}`}
              onClick={() => setViewMode('teacher')}
            >
              <CheckCircle2 size={14} /> Clave Docente (Respuestas)
            </button>
          </div>
        </div>

        <Button variant="primary" size="sm" icon={<Printer size={16} />} onClick={handlePrint}>
          Imprimir / Guardar como PDF
        </Button>
      </div>

      {/* Hoja Formal Imprimible */}
      <div className="printable-sheet">
        {/* Cabecera Institucional CESDE */}
        <header className="printable-header">
          <div className="printable-header__brand">
            <h2 className="printable-header__inst">CESDE • FORMACIÓN TÉCNICA LABORAL</h2>
            <p className="printable-header__sub">Sistema de Gestión de Evaluaciones Académicas</p>
          </div>
          <div className="printable-header__scorebox">
            <span>CALIFICACIÓN</span>
            <div className="printable-header__scoreline" />
          </div>
        </header>

        {/* Ficha de Identificación del Estudiante */}
        <div className="printable-student-card">
          <div className="printable-info-row">
            <div className="printable-field" style={{ flex: 2 }}>
              <span className="printable-field__label">ESTUDIANTE:</span>
              <span className="printable-field__line" />
            </div>
            <div className="printable-field" style={{ flex: 1 }}>
              <span className="printable-field__label">DOCUMENTO:</span>
              <span className="printable-field__line" />
            </div>
          </div>

          <div className="printable-info-row">
            <div className="printable-field" style={{ flex: 2 }}>
              <span className="printable-field__label">ASIGNATURA:</span>
              <span className="printable-field__val">{asignatura.nombre || exam.titulo}</span>
            </div>
            <div className="printable-field" style={{ flex: 1 }}>
              <span className="printable-field__label">FECHA:</span>
              <span className="printable-field__val">{fecha}</span>
            </div>
          </div>
        </div>

        {/* Título de la Evaluación e Instrucciones */}
        <div className="printable-exam-title">
          <h3>{exam.titulo}</h3>
          {viewMode === 'student' && (
            <p className="printable-instructions">
              <strong>Instrucciones:</strong> Lea cuidadosamente cada uno de los enunciados. Para las preguntas de opción múltiple, marque con una equis (X) la casilla correspondiente a la única respuesta que considere correcta. No se permite el uso de tachones ni dispositivos electrónicos no autorizados.
            </p>
          )}
          {viewMode === 'teacher' && (
            <p className="printable-instructions" style={{ backgroundColor: '#FEF3C7', padding: '6px 10px', border: '1px solid #F59E0B' }}>
              <strong>GUÍA DE CALIFICACIÓN DOCENTE:</strong> Las respuestas correctas están resaltadas con un visto bueno y su retroalimentación pedagógica.
            </p>
          )}
        </div>

        {/* Listado de Preguntas Numeradas */}
        <div className="printable-questions">
          {preguntas.map((q, idx) => (
            <div key={q.id || idx} className="printable-question-item">
              <div className="printable-question-enunciado">
                <span className="printable-question-num">{idx + 1}.</span>
                <span>{q.enunciado}</span>
                <span className="printable-question-points">({q.puntaje || 1} pt)</span>
              </div>

              <div className="printable-options-grid">
                {(q.opciones || []).map((opt, optIdx) => {
                  const letter = String.fromCharCode(65 + optIdx);
                  const isCorrect = Boolean(opt.es_correcta);

                  return (
                    <div
                      key={opt.id || optIdx}
                      className={`printable-option ${viewMode === 'teacher' && isCorrect ? 'printable-option--correct' : ''}`}
                    >
                      <span className="printable-checkbox">
                        {viewMode === 'teacher' && isCorrect ? '✓' : '( )'}
                      </span>
                      <span className="printable-option-letter">{letter})</span>
                      <span className="printable-option-text">{opt.texto_opcion}</span>
                    </div>
                  );
                })}
              </div>

              {viewMode === 'teacher' && q.justificacion_pedagogica && (
                <div className="printable-teacher-note">
                  <strong>Criterio Bloom ({q.nivel_bloom}):</strong> {q.justificacion_pedagogica}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
