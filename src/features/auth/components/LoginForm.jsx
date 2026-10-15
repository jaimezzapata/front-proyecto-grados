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
        <h1 className="auth-form__brand">Z-SUITE</h1>
        <p className="auth-form__subtitle">
          Ingresa tus credenciales para acceder a la plataforma
        </p>
      </div>

      {serverError && <Alert type="error" message={serverError} />}

      <div className="auth-form__fields">
        <Input
          id="email"
          label="Correo Electrónico"
          type="email"
          placeholder="usuario@ejemplo.edu.co"
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

      <div className="auth-form__options">
        <label className="auth-form__checkbox-label">
          <input
            type="checkbox"
            name="rememberMe"
            defaultChecked
            className="auth-form__checkbox"
          />
          <span>Recordar sesión</span>
        </label>
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
          {isSubmitting ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </div>

      <div className="auth-form__footer">
        <span>¿No tienes una cuenta?</span>
        <Link to="/register" className="auth-form__link">
          Crear cuenta
        </Link>
      </div>
    </form>
  );
};
