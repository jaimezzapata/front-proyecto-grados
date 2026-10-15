import React, { useState, useEffect } from 'react';
import { useTheme } from './ThemeContext';
import { Palette, Check, Sparkles } from 'lucide-react';
import './themeSidebarTab.css';

export const ThemeSidebarTab = () => {
  const { theme, setTheme, THEME_LABELS } = useTheme();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('.theme-hover-tab')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen]);

  return (
    <aside
      className={`theme-hover-tab ${isOpen ? 'theme-hover-tab--open' : ''}`}
      aria-label="Selector de estilo visual"
    >
      {/* Pestaña / Botón compacto y sutil */}
      <button
        type="button"
        className="theme-hover-tab__handle"
        onClick={() => setIsOpen((prev) => !prev)}
        title="Cambiar estilo de diseño"
        aria-label="Abrir selector de estilos"
      >
        <Palette size={16} className="theme-hover-tab__icon" />
      </button>

      {/* Panel que se revela al pasar el cursor o tocar */}
      <div className="theme-hover-tab__panel">
        <div className="theme-hover-tab__header">
          <div className="theme-hover-tab__header-title">
            <Sparkles size={15} />
            <span>Estilos de Diseño</span>
          </div>
        </div>

        <div className="theme-hover-tab__list">
          {Object.entries(THEME_LABELS).map(([key, item]) => {
            const isActive = theme === key;
            return (
              <button
                key={key}
                type="button"
                className={`theme-hover-tab__item ${isActive ? 'active' : ''}`}
                onClick={() => {
                  setTheme(key);
                  setIsOpen(false);
                }}
              >
                <div className="theme-hover-tab__item-info">
                  <span className="theme-hover-tab__item-name">{item.name}</span>
                  <span className="theme-hover-tab__item-desc">{item.desc}</span>
                </div>
                {isActive && <Check size={15} className="theme-hover-tab__check" />}
              </button>
            );
          })}
        </div>
      </div>
    </aside>
  );
};
