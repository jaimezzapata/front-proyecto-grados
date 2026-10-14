import React from 'react';
import { Card } from '../../../core/components/Card';
import { ThemeSelector } from '../../../core/theme/ThemeSelector';
import { RegisterForm } from '../components/RegisterForm';
import { AuthHero } from '../components/AuthHero';
import { GraduationCap } from 'lucide-react';
import './authPage.css';

export const RegisterPage = () => {
  return (
    <div className="auth-page">
      <header className="auth-page__topbar">
        <div className="auth-page__brand">
          <div className="auth-page__brand-icon">
            <GraduationCap size={22} />
          </div>
          <span className="auth-page__brand-title">EvalIA</span>
        </div>

        <div className="auth-page__controls">
          <ThemeSelector />
        </div>
      </header>

      <main className="auth-page__content">
        <div className="auth-page__grid">
          <AuthHero />
          
          <div className="auth-page__form-wrapper">
            <Card padding="large" className="auth-page__card">
              <RegisterForm />
            </Card>
          </div>
        </div>
      </main>

      <footer className="auth-page__footer">
        <span>Proyecto de Grado en Ingeniería de Software &bull; Jaime Zapata</span>
      </footer>
    </div>
  );
};
