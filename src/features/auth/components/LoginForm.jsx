import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Lock, LogIn } from 'lucide-react';
import { Input } from '../../../core/components/Input';
import { Button } from '../../../core/components/Button';
import { Alert } from '../../../core/components/Alert';
import { useLoginForm } from '../hooks/useLoginForm';
import './authForms.css';

export const LoginForm = () => {
  const { formData, errors, serverError, isSubmitting, handleChange, handleSubmit } = useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      <div className="auth-form__header">
        <h2 className="auth-form__title">Iniciar Sesión</h2>
        <p className="auth-form__subtitle">
          Ingresa tus credenciales docentes para acceder a la plataforma
        </p>
      </div>

      {serverError && <Alert type="error" message={serverError} />}

      <div className="auth-form__fields">
        <Input
          id="email"
          label="Correo Institucional"
          type="email"
          placeholder="ejemplo@cesde.edu.co"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
          icon={<Mail size={18} />}
          required
          autoComplete="email"
        />

        <Input
          id="password"
          label="Contraseña"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
          icon={<Lock size={18} />}
          required
          autoComplete="current-password"
        />
      </div>

      <div className="auth-form__actions">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          icon={<LogIn size={18} />}
          className="auth-form__submit-btn"
        >
          {isSubmitting ? 'Verificando...' : 'Acceder al Sistema'}
        </Button>
      </div>

      <div className="auth-form__footer">
        <span>¿No tienes una cuenta de docente?</span>
        <Link to="/register" className="auth-form__link">
          Crear cuenta
        </Link>
      </div>
    </form>
  );
};
