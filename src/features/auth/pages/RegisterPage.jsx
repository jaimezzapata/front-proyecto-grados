import React from 'react';
import { RegisterForm } from '../components/RegisterForm';
import './authPage.css';

export const RegisterPage = () => {
  return (
    <div className="auth-page auth-page--login-only">
      <main className="auth-page__content auth-page__content--register-only">
        <div className="auth-page__main-card auth-page__main-card--register-only">
          <RegisterForm />
        </div>
      </main>
    </div>
  );
};
