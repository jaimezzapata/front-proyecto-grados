import React from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, UserPlus } from 'lucide-react';
import { Input } from '../../../core/components/Input';
import { Button } from '../../../core/components/Button';
import { Alert } from '../../../core/components/Alert';
import { useRegisterForm } from '../hooks/useRegisterForm';
import './authForms.css';

export const RegisterForm = () => {
  const { formData, errors, serverError, successMessage, isSubmitting, handleChange, handleSubmit } = useRegisterForm();

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      <div className="auth-form__header">
        <h1 className="auth-form__brand">Z-SUITE</h1>
        <p className="auth-form__subtitle">
          Crea tu cuenta para acceder a la plataforma
        </p>
      </div>

      {serverError && <Alert type="error" message={serverError} />}
      {successMessage && <Alert type="success" message={successMessage} />}

      <div className="auth-form__fields">
        <div className="auth-form__row">
          <Input
            id="nombres"
            label="Nombres"
            placeholder="Jaime"
            value={formData.nombres}
            onChange={handleChange}
            error={errors.nombres}
            icon={<User size={18} />}
            required
            autoComplete="given-name"
          />
          <Input
            id="apellidos"
            label="Apellidos"
            placeholder="Zapata"
            value={formData.apellidos}
            onChange={handleChange}
            error={errors.apellidos}
            required
            autoComplete="family-name"
          />
        </div>

        <Input
          id="correo_institucional"
          label="Correo Institucional"
          type="email"
          placeholder="usuario@cesde.edu.co"
          value={formData.correo_institucional}
          onChange={handleChange}
          error={errors.correo_institucional}
          helperText="Debe finalizar obligatoriamente en @cesde.edu.co"
          icon={<Mail size={18} />}
          required
          autoComplete="email"
        />

        <div className="auth-form__row">
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
            autoComplete="new-password"
          />
          <Input
            id="confirmPassword"
            label="Confirmar"
            type="password"
            placeholder="••••••••"
            value={formData.confirmPassword}
            onChange={handleChange}
            error={errors.confirmPassword}
            required
            autoComplete="new-password"
          />
        </div>
      </div>

      <div className="auth-form__actions">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          icon={<UserPlus size={18} />}
          className="auth-form__submit-btn"
        >
          {isSubmitting ? 'Creando cuenta...' : 'Crear Cuenta'}
        </Button>
      </div>

      <div className="auth-form__footer">
        <span>¿Ya tienes una cuenta?</span>
        <Link to="/login" className="auth-form__link">
          Iniciar sesión
        </Link>
      </div>
    </form>
  );
};
