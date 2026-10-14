import React from 'react';
import { UploadCloud, Brain, FileCheck } from 'lucide-react';
import './authSteps.css';

export const AuthSteps = () => {
  const steps = [
    {
      num: 'PASO 1',
      title: 'Carga tu Material',
      desc: 'Sube documentos PDF o Word de tus clases y guías académicas.',
      icon: <UploadCloud size={16} />,
      colorVar: 'var(--step-1-color)',
    },
    {
      num: 'PASO 2',
      title: 'Parametriza Bloom',
      desc: 'Define niveles cognitivos (Recordar a Evaluar) y cantidad de preguntas.',
      icon: <Brain size={16} />,
      colorVar: 'var(--step-2-color)',
    },
    {
      num: 'PASO 3',
      title: 'Edita y Exporta',
      desc: 'Ajusta con supervisión docente y descarga en Word o PDF listo para aula.',
      icon: <FileCheck size={16} />,
      colorVar: 'var(--step-3-color)',
    },
  ];

  return (
    <div className="auth-steps">
      {steps.map((step, idx) => (
        <div key={idx} className="auth-step-card">
          <div
            className="auth-step-card__header"
            style={{ backgroundColor: step.colorVar }}
          >
            <span className="auth-step-card__num">{step.num}</span>
            {step.icon}
          </div>
          <div className="auth-step-card__body">
            <h4 className="auth-step-card__title">{step.title}</h4>
            <p className="auth-step-card__desc">{step.desc}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
