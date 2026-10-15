import React from 'react';
import { ThemeSidebarTab } from '../../../core/theme/ThemeSidebarTab';
import { LoginForm } from '../components/LoginForm';
import './authPage.css';

export const LoginPage = () => {
  return (
    <div className="auth-page auth-page--login-only">
      <ThemeSidebarTab />

      <main className="auth-page__content auth-page__content--login-only">
        <div className="auth-page__main-card auth-page__main-card--login-only">
          <LoginForm />
        </div>
      </main>
    </div>
  );
};
