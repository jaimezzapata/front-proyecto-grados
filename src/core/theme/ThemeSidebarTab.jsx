import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { ChevronRight, Check, Sparkles } from 'lucide-react';
import './themeSidebarTab.css';

export const ThemeSidebarTab = () => {
  const { theme, setTheme, THEME_LABELS } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  const getThemeSymbol = () => {
    switch (theme) {
      case 'popart':
        return '⚡';
      case 'brutalism':
        return '□';
      case 'memphis':
        return '△';
      case 'neon':
        return '✦';
      default:
        return '●';
    }
  };

  return (
    <>
      <button
        type="button"
        className="theme-sidebar-tab"
        onClick={() => setIsOpen(!isOpen)}
        title="Cambiar estilo de diseño"
        aria-label="Abrir panel lateral de estilos"
      >
        <span className="theme-sidebar-tab__symbol">{getThemeSymbol()}</span>
        <span className="theme-sidebar-tab__text">ESTILOS</span>
        <span className="theme-sidebar-tab__arrow">‹</span>
      </button>

      {isOpen && (
        <>
          <div className="theme-sidebar-backdrop" onClick={() => setIsOpen(false)} />
          <div className="theme-sidebar-panel">
            <div className="theme-sidebar-panel__header">
              <Sparkles size={16} />
              <span>Selecciona un Estilo</span>
            </div>

            <div className="theme-sidebar-panel__list">
              {Object.entries(THEME_LABELS).map(([key, item]) => {
                const isActive = theme === key;
                return (
                  <button
                    key={key}
                    type="button"
                    className={`theme-sidebar-panel__item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setTheme(key);
                      setIsOpen(false);
                    }}
                  >
                    <div>
                      <div className="theme-sidebar-panel__name">{item.name}</div>
                      <div className="theme-sidebar-panel__desc">{item.desc}</div>
                    </div>
                    {isActive && <Check size={16} />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </>
  );
};
