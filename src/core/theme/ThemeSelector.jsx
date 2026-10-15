import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { Palette, Sun, Moon, Check, Sparkles, ChevronDown } from 'lucide-react';
import './themeSelector.css';

export const ThemeSelector = () => {
  const { theme, mode, setTheme, toggleMode, THEMES, THEME_LABELS } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="theme-selector-container">
      {/* Botón de Modo Claro / Oscuro */}
      <button
        type="button"
        className="theme-mode-btn"
        onClick={toggleMode}
        title={mode === 'light' ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
        aria-label="Conmutar modo claro u oscuro"
      >
        {mode === 'light' ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {/* Botón para abrir el menú de Estilos Artísticos */}
      <button
        type="button"
        className="theme-palette-btn"
        onClick={() => setIsOpen(!isOpen)}
        title="Cambiar estilo de diseño"
        aria-label="Abrir selector de temas visuales"
      >
        <Palette size={18} className="theme-btn-icon" />
        <span className="theme-current-name">{THEME_LABELS[theme]?.name}</span>
        <ChevronDown size={14} className="theme-chevron-icon" />
      </button>

      {/* Menú desplegable flotante */}
      {isOpen && (
        <>
          <div className="theme-backdrop" onClick={() => setIsOpen(false)} />
          <div className="theme-dropdown-menu">
            <div className="theme-dropdown-header">
              <Sparkles size={16} />
              <span>Estilos de Diseño</span>
            </div>

            <div className="theme-options-list">
              {Object.entries(THEME_LABELS).map(([key, item]) => {
                const isActive = theme === key;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`theme-option-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setTheme(key);
                      setIsOpen(false);
                    }}
                  >
                    <div className="theme-option-info">
                      <span className="theme-option-name">{item.name}</span>
                      <span className="theme-option-desc">{item.desc}</span>
                    </div>
                    {isActive && <Check size={16} className="theme-check-icon" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
