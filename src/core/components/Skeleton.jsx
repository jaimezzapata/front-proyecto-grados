import React from 'react';
import './skeleton.css';

/**
 * Componente atómico Skeleton
 * @param {'text' | 'title' | 'circular' | 'rectangular'} variant - Forma del placeholder
 * @param {string | number} width - Ancho opcional (ej. '100%', 200, '40px')
 * @param {string | number} height - Altura opcional (ej. 24, '150px')
 * @param {number} count - Cantidad de repeticiones de la misma línea (DRY)
 * @param {string} className - Clases CSS adicionales
 * @param {object} style - Estilos en línea adicionales
 */
export const Skeleton = ({
  variant = 'text',
  width,
  height,
  count = 1,
  className = '',
  style = {}
}) => {
  const customStyles = {
    ...(width ? { width: typeof width === 'number' ? `${width}px` : width } : {}),
    ...(height ? { height: typeof height === 'number' ? `${height}px` : height } : {}),
    ...style
  };

  const skeletonClass = `core-skeleton core-skeleton--${variant} ${className}`.trim();

  if (count > 1) {
    return (
      <div className="core-skeleton-group" role="status" aria-label="Cargando contenido...">
        {Array.from({ length: count }).map((_, index) => (
          <span
            key={index}
            className={skeletonClass}
            style={{
              ...customStyles,
              // Da una variación natural de ancho a la última línea de texto
              ...(variant === 'text' && index === count - 1 && !width ? { width: '75%' } : {})
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <span
      className={skeletonClass}
      style={customStyles}
      role="status"
      aria-label="Cargando contenido..."
    />
  );
};

/**
 * SkeletonCard: Placeholder compuesto para tarjetas de contenido (exámenes, materias, recursos)
 */
export const SkeletonCard = ({ className = '' }) => {
  return (
    <div className={`core-skeleton-card ${className}`.trim()} role="status" aria-label="Cargando tarjeta...">
      <div className="core-skeleton-card__header">
        <Skeleton variant="circular" width={42} height={42} />
        <div className="core-skeleton-card__header-text">
          <Skeleton variant="title" width="60%" height={18} />
          <Skeleton variant="text" width="40%" height={12} />
        </div>
      </div>
      <div className="core-skeleton-card__body">
        <Skeleton variant="text" count={3} />
      </div>
    </div>
  );
};

/**
 * SkeletonForm: Placeholder compuesto para formularios en carga
 */
export const SkeletonForm = ({ fieldsCount = 3, className = '' }) => {
  return (
    <div className={`core-skeleton-form ${className}`.trim()} role="status" aria-label="Cargando formulario...">
      {Array.from({ length: fieldsCount }).map((_, idx) => (
        <div key={idx} className="core-skeleton-form__field">
          <Skeleton variant="text" width="30%" height={12} />
          <Skeleton variant="rectangular" height={42} />
        </div>
      ))}
      <Skeleton variant="rectangular" height={46} style={{ marginTop: '8px' }} />
    </div>
  );
};
