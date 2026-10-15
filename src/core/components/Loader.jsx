import React from 'react';
import './loader.css';

/**
 * Componente atómico Loader / Spinner
 * @param {'sm' | 'md' | 'lg' | 'xl'} size - Tamaño del indicador
 * @param {'spinner' | 'dots'} variant - Tipo de animación
 * @param {string} text - Texto o mensaje descriptivo opcional
 * @param {boolean} centered - Si debe centrarse horizontalmente en su contenedor
 * @param {boolean} fullscreen - Si debe presentarse como pantalla de bloqueo completa
 * @param {string} className - Clases CSS adicionales
 */
export const Loader = ({
  size = 'md',
  variant = 'spinner',
  text = null,
  centered = false,
  fullscreen = false,
  className = ''
}) => {
  const containerClasses = [
    'core-loader-container',
    centered && !fullscreen ? 'core-loader-container--centered' : '',
    fullscreen ? 'core-loader-container--fullscreen' : '',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={containerClasses} role="status" aria-live="polite">
      {variant === 'spinner' ? (
        <span className={`core-loader-spinner core-loader-spinner--${size}`} />
      ) : (
        <span className="core-loader-dots">
          <span className={`core-loader-dot core-loader-dot--${size}`} />
          <span className={`core-loader-dot core-loader-dot--${size}`} />
          <span className={`core-loader-dot core-loader-dot--${size}`} />
        </span>
      )}

      {text && <span className="core-loader-text">{text}</span>}
      <span className="sr-only">Cargando...</span>
    </div>
  );
};

/**
 * Componente PageLoader para transiciones de página, verificación de sesión o Suspense
 */
export const PageLoader = ({ message = 'Cargando plataforma...' }) => {
  return (
    <div className="core-loader-container--fullscreen" role="status" aria-live="polite">
      <div className="core-loader-brand">Z-SUITE</div>
      <span className="core-loader-spinner core-loader-spinner--lg" />
      <span className="core-loader-text" style={{ marginTop: '8px' }}>
        {message}
      </span>
    </div>
  );
};
