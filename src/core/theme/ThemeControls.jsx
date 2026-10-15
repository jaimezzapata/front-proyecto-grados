import React from 'react';
import { useTheme } from './ThemeContext';
import { ThemeSidebarTab } from './ThemeSidebarTab';
import { Sun, Moon } from 'lucide-react';
import './themeControls.css';

/**
 * Contenedor desacoplado de controles visuales:
 * 1. Botón independiente de alternancia Claro/Oscuro (Directo a 1 clic)
 * 2. Pestaña independiente de selección de estilos de diseño
 */
export const ThemeControls = () => {
  const { mode, toggleMode } = useTheme();
  const isDark = mode === 'dark';

  return (
    <div className="theme-floating-group" aria-label="Controles visuales de tema y modo">
      {/* Botón flotante independiente para conmutar Claro / Oscuro */}
      <button
        type="button"
        className="theme-mode-fab"
        onClick={toggleMode}
        title={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
        aria-label={isDark ? 'Cambiar a Modo Claro' : 'Cambiar a Modo Oscuro'}
      >
        {isDark ? (
          <Sun size={17} className="theme-mode-fab__icon theme-mode-fab__icon--sun" />
        ) : (
          <Moon size={17} className="theme-mode-fab__icon theme-mode-fab__icon--moon" />
        )}
      </button>

      {/* Pestaña independiente para elegir entre los 5 estilos visuales */}
      <ThemeSidebarTab />
    </div>
  );
};
