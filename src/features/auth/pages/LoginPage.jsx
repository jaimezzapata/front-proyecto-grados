import React from 'react';
import { ThemeSelector } from '../../../core/theme/ThemeSelector';
import { ThemeSidebarTab } from '../../../core/theme/ThemeSidebarTab';
import { useTheme } from '../../../core/theme/ThemeContext';
import { LoginForm } from '../components/LoginForm';
import { AuthSteps } from '../components/AuthSteps';
import { GraduationCap, Sparkles, ShieldCheck } from 'lucide-react';
import './authPage.css';

export const LoginPage = () => {
  const { theme, THEME_LABELS } = useTheme();

  const getBadgeText = () => {
    switch (theme) {
      case 'popart':
        return '★ 100% RIGOR PEDAGÓGICO';
      case 'brutalism':
        return '[100% TAXONOMÍA BLOOM]';
      case 'memphis':
        return '★ 100% SUPERVISIÓN DOCENTE';
      case 'neon':
        return '⚡ MOTOR IA PEDAGÓGICO';
      default:
        return '100% Rigor Académico';
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
                Evaluaciones IA
              </span>
              <span className="auth-page__tag">Taxonomía de Bloom</span>
            </div>
            <span className="auth-page__tag auth-page__tag--edition">
              {THEME_LABELS[theme]?.name} EDITION
            </span>
          </div>

          <div className="auth-page__hero-section">
            <h1 className="auth-page__title">
              Diseña tus Evaluaciones de Clase
            </h1>
            <p className="auth-page__subtitle">
              Genera exámenes válidos y estructurados a partir de diapositivas o guías de clase con supervisión docente interactiva (Human-in-the-Loop).
            </p>

            <div className="auth-page__badge-sticker">
              <ShieldCheck size={16} />
              <span>{getBadgeText()}</span>
            </div>
          </div>

          <AuthSteps />

          <section className="auth-page__form-section">
            <LoginForm />
          </section>
        </div>
      </main>

      <footer className="auth-page__footer">
        <span>Proyecto de Grado en Ingeniería de Software &bull; Jaime Zapata</span>
      </footer>
    </div>
  );
};
