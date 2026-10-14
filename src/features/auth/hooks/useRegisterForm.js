import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../core/context/AuthContext';
import { authService } from '../services/authService';

export const useRegisterForm = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    correo_institucional: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { saveAuthSession } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: null }));
    }
    if (serverError) {
      setServerError(null);
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.nombres.trim() || formData.nombres.trim().length < 2) {
      newErrors.nombres = 'Mínimo 2 caracteres requeridos';
    }

    if (!formData.apellidos.trim() || formData.apellidos.trim().length < 2) {
      newErrors.apellidos = 'Mínimo 2 caracteres requeridos';
    }

    if (!formData.correo_institucional.trim()) {
      newErrors.correo_institucional = 'El correo institucional es requerido';
    } else if (!formData.correo_institucional.toLowerCase().endsWith('@cesde.edu.co')) {
      newErrors.correo_institucional = 'Debe ser un correo institucional (@cesde.edu.co)';
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Mínimo 8 caracteres requeridos';
    } else if (!/^(?=.*[A-Za-z])(?=.*\d).*$/.test(formData.password)) {
      newErrors.password = 'Debe contener al menos una letra y un número';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setServerError(null);

    try {
      const payload = {
        nombres: formData.nombres.trim(),
        apellidos: formData.apellidos.trim(),
        correo_institucional: formData.correo_institucional.trim(),
        password: formData.password
      };

      await authService.register(payload);
      setSuccessMessage('¡Cuenta creada exitosamente! Iniciando sesión...');

      // Auto login inmediato tras registro
      const loginData = await authService.login({
        email: payload.correo_institucional,
        password: payload.password
      });

      saveAuthSession(loginData.token, loginData.user);
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
      }, 1000);
    } catch (err) {
      setServerError(err.message || 'Error al crear la cuenta. Verifique los datos ingresados.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    serverError,
    successMessage,
    isSubmitting,
    handleChange,
    handleSubmit
  };
};
