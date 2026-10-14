import React, { createContext, useContext, useState, useEffect } from 'react';
import './themeTokens.css';

const ThemeContext = createContext(null);

export const THEMES = {
  MINIMALISM: 'minimalism',
  BRUTALISM: 'brutalism',
  POPART: 'popart',
  MEMPHIS: 'memphis',
  NEON: 'neon'
};

export const MODES = {
  LIGHT: 'light',
  DARK: 'dark'
};

const THEME_LABELS = {
  [THEMES.MINIMALISM]: { name: 'Minimalismo', desc: 'Sobrio, limpio y sin distracciones' },
  [THEMES.BRUTALISM]: { name: 'Neobrutalismo', desc: 'Bordes gruesos y sombras duras' },
  [THEMES.POPART]: { name: 'Pop Art', desc: 'Vibrante, editorial y tipo cómic' },
  [THEMES.MEMPHIS]: { name: 'Memphis 80s', desc: 'Geométrico, lúdico y pastel' },
  [THEMES.NEON]: { name: 'Cyber Neón', desc: 'Glow futurista y glassmorphism' }
};

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    return localStorage.getItem('evalia_theme') || THEMES.MINIMALISM;
  });

  const [mode, setModeState] = useState(() => {
    return localStorage.getItem('evalia_mode') || MODES.LIGHT;
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('evalia_theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.setAttribute('data-mode', mode);
    localStorage.setItem('evalia_mode', mode);
  }, [mode]);

  const setTheme = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setThemeState(newTheme);
    }
  };

  const setMode = (newMode) => {
    if (Object.values(MODES).includes(newMode)) {
      setModeState(newMode);
    }
  };

  const toggleMode = () => {
    setModeState((prev) => (prev === MODES.LIGHT ? MODES.DARK : MODES.LIGHT));
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        mode,
        setTheme,
        setMode,
        toggleMode,
        THEMES,
        MODES,
        THEME_LABELS
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe ser utilizado dentro de un ThemeProvider');
  }
  return context;
};
