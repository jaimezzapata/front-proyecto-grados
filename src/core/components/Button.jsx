import React from 'react';
import './button.css';

export const Button = ({
  children,
  variant = 'primary', // primary, secondary, outline, ghost
  size = 'md',        // sm, md, lg
  type = 'button',
  disabled = false,
  loading = false,
  icon = null,
  onClick,
  className = '',
  ...props
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`core-btn core-btn--${variant} core-btn--${size} ${loading ? 'core-btn--loading' : ''} ${className}`}
      {...props}
    >
      {loading && <span className="core-btn__spinner" />}
      {!loading && icon && <span className="core-btn__icon">{icon}</span>}
      <span className="core-btn__text">{children}</span>
    </button>
  );
};
