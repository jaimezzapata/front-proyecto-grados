import React from 'react';
import { useTheme } from './ThemeContext';
import { Sun, Moon } from 'lucide-react';
import './darkModeToggle.css';

/**
 * Botón atómico independiente para alternar entre Modo Claro y Oscuro
 */
export const DarkModeToggle = ({ className = '' }) => {
  const { mode, toggleMode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <button
      type="button"
      className={`dark-mode-toggle ${className}`.trim()}
      onClick={toggleMode}
      title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
      aria-label={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
    >
      <span className="dark-mode-toggle__icon-wrap">
        {isDark ? (
          <Sun size={17} className="dark-mode-toggle__icon dark-mode-toggle__icon--sun" />
        ) : (
          <Moon size={17} className="dark-mode-toggle__icon dark-mode-toggle__icon--moon" />
        )}
      </span>
      <span className="dark-mode-toggle__label">
        {isDark ? 'Claro' : 'Oscuro'}
      </span>
    </button>
  );
};
