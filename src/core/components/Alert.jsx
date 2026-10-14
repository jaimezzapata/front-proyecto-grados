import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';
import './alert.css';

export const Alert = ({
  type = 'error', // error, success, info, warning
  title = null,
  message,
  onClose = null,
  className = ''
}) => {
  if (!message) return null;

  const icons = {
    error: <AlertCircle size={18} />,
    success: <CheckCircle size={18} />,
    info: <Info size={18} />,
    warning: <AlertCircle size={18} />
  };

  return (
    <div className={`core-alert core-alert--${type} ${className}`} role="alert">
      <span className="core-alert__icon">{icons[type] || icons.info}</span>
      <div className="core-alert__content">
        {title && <span className="core-alert__title">{title}</span>}
        <span className="core-alert__msg">{message}</span>
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="core-alert__close"
          aria-label="Cerrar notificación"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
