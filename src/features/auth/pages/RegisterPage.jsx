import React from 'react';
import { ThemeSelector } from '../../../core/theme/ThemeSelector';
import { ThemeSidebarTab } from '../../../core/theme/ThemeSidebarTab';
import { useTheme } from '../../../core/theme/ThemeContext';
import { RegisterForm } from '../components/RegisterForm';
import { AuthSteps } from '../components/AuthSteps';
import { GraduationCap, Sparkles, UserPlus } from 'lucide-react';
import './authPage.css';

export const RegisterPage = () => {
  const { theme, THEME_LABELS } = useTheme();

  const getBadgeText = () => {
    switch (theme) {
      case 'popart':
        return '★ ALTA DOCENTE INSTANTÁNEA';
      case 'brutalism':
        return '[REGISTRO DOCENTE DIRECTO]';
      case 'memphis':
        return '★ ÚNETE A LA RED EVALIA';
      case 'neon':
        return '⚡ ACCESO INSTITUCIONAL';
      default:
        return 'Registro Académico';
    }
  };

  return (
    <div className="auth-page">
      <ThemeSidebarTab />

      <div className="auth-page__topbar-wrapper">
        <header className="auth-page__topbar">
          <div className="auth-page__brand">
            <div className="auth-page__brand-icon">
              <GraduationCap size={22} />
            </div>
            <div className="auth-page__brand-info">
              <span className="auth-page__brand-title">EvalIA</span>
              <span className="auth-page__brand-tagline">Evaluaciones Académicas con IA</span>
            </div>
          </div>

          <div className="auth-page__controls">
            <ThemeSelector />
          </div>
        </header>
      </div>

      <div className="auth-page__hazard" />

      <main className="auth-page__content">
        <div className="auth-page__main-card">
          <div className="auth-page__card-top-tags">
            <div className="auth-page__tag-group">
              <span className="auth-page__tag auth-page__tag--accent">
                <Sparkles size={12} />
                Nuevo Docente
              </span>
              <span className="auth-page__tag">Taxonomía de Bloom</span>
            </div>
            <span className="auth-page__tag auth-page__tag--edition">
              {THEME_LABELS[theme]?.name} EDITION
            </span>
          </div>

          <div className="auth-page__hero-section">
            <h1 className="auth-page__title">
              Crea tu Cuenta Docente
            </h1>
            <p className="auth-page__subtitle">
              Configura tu perfil institucional para comenzar a generar exámenes estructurados a partir de tus materias y recursos de clase.
            </p>

            <div className="auth-page__badge-sticker">
              <UserPlus size={16} />
              <span>{getBadgeText()}</span>
            </div>
          </div>

          <AuthSteps />

          <section className="auth-page__form-section">
            <RegisterForm />
          </section>
        </div>
      </main>

      <footer className="auth-page__footer">
        <span>Proyecto de Grado en Ingeniería de Software &bull; Jaime Zapata</span>
      </footer>
    </div>
  );
};
