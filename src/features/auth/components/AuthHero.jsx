import React from 'react';
import { Sparkles, Brain, Sliders, FileDown } from 'lucide-react';
import './authHero.css';

export const AuthHero = () => {
  return (
    <div className="auth-hero">
      <div className="auth-hero__glow" />
      
      <div className="auth-hero__badge">
        <Sparkles size={14} />
        <span>Inteligencia Artificial Pedagógica</span>
      </div>

      <h1 className="auth-hero__title">
        Diseña evaluaciones académicas válidas y estructuradas en segundos.
      </h1>

      <p className="auth-hero__description">
        Transforma tus diapositivas y guías de clase en exámenes rigurosos alineados con la Taxonomía de Bloom y supervisión docente interactiva.
      </p>

      <div className="auth-hero__features">
        <div className="auth-hero__feature-item">
          <div className="auth-hero__feature-icon">
            <Brain size={18} />
          </div>
          <div className="auth-hero__feature-text">
            <strong>Taxonomía de Bloom</strong>
            <span>Preguntas desde recordar hasta evaluar y crear.</span>
          </div>
        </div>

        <div className="auth-hero__feature-item">
          <div className="auth-hero__feature-icon">
            <Sliders size={18} />
          </div>
          <div className="auth-hero__feature-text">
            <strong>Supervisión Human-in-the-Loop</strong>
            <span>El docente edita, calibra y aprueba antes de imprimir.</span>
          </div>
        </div>

        <div className="auth-hero__feature-item">
          <div className="auth-hero__feature-icon">
            <FileDown size={18} />
          </div>
          <div className="auth-hero__feature-text">
            <strong>Exportación Word y PDF</strong>
            <span>Versión estudiante para aula y solucionario docente.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
