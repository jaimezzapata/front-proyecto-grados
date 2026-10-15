/**
 * Utilidades para formateo y extracción de datos del usuario
 */

/**
 * Obtiene las iniciales de una persona a partir de sus nombres y/o apellidos
 * @param {object|string} user - Objeto de usuario o nombre completo
 * @returns {string} Iniciales en mayúsculas (ej. "JZ")
 */
export const getUserInitials = (user) => {
  if (!user) return 'U';

  // Si se pasa un string directo
  if (typeof user === 'string') {
    const parts = user.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return parts[0]?.charAt(0)?.toUpperCase() || 'U';
  }

  const nombres = user.nombres?.trim() || '';
  const apellidos = user.apellidos?.trim() || '';

  if (nombres && apellidos) {
    return `${nombres.charAt(0)}${apellidos.charAt(0)}`.toUpperCase();
  }

  if (nombres) {
    const parts = nombres.split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return parts[0]?.charAt(0)?.toUpperCase() || 'U';
  }

  if (user.correo_institucional) {
    return user.correo_institucional.charAt(0).toUpperCase();
  }

  if (user.email) {
    return user.email.charAt(0).toUpperCase();
  }

  return 'U';
};

/**
 * Retorna el nombre completo formateado del usuario
 * @param {object} user - Objeto de usuario
 * @returns {string} Nombre completo
 */
export const getUserFullName = (user) => {
  if (!user) return 'Usuario';
  const parts = [user.nombres, user.apellidos].filter(Boolean);
  if (parts.length > 0) {
    return parts.join(' ');
  }
  return user.correo_institucional || user.email || 'Docente';
};
