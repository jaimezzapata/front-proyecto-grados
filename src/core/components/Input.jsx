import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import './input.css';

export const Input = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error = null,
  helperText = null,
  icon = null,
  required = false,
  autoComplete,
  disabled = false,
  className = '',
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`core-input-group ${error ? 'core-input-group--error' : ''} ${className}`}>
      {label && (
        <label htmlFor={id} className="core-input-label">
          {label} {required && <span className="core-input-required">*</span>}
        </label>
      )}

      <div className="core-input-wrapper">
        {icon && <span className="core-input-icon-left">{icon}</span>}
        
        <input
          id={id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          disabled={disabled}
          className={`core-input-field ${icon ? 'core-input-field--with-icon' : ''} ${isPassword ? 'core-input-field--with-toggle' : ''}`}
          {...props}
        />

        {isPassword && (
          <button
            type="button"
            className="core-input-toggle-btn"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Ver contraseña'}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>

      {error && <span className="core-input-error-msg">{error}</span>}
      {!error && helperText && <span className="core-input-helper-msg">{helperText}</span>}
    </div>
  );
};
