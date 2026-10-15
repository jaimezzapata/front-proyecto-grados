import React from 'react';
import { getUserInitials, getUserFullName } from '../utils/userUtils';
import './avatar.css';

/**
 * Componente atómico Avatar para mostrar iniciales del usuario
 * @param {object|string} user - Objeto de usuario o iniciales
 * @param {'sm' | 'md' | 'lg' | 'xl'} size - Tamaño del avatar
 * @param {boolean} showDetails - Si muestra el nombre y rol al lado (chip)
 * @param {string} className - Clases adicionales
 */
export const Avatar = ({
  user = null,
  size = 'md',
  showDetails = false,
  className = ''
}) => {
  const initials = getUserInitials(user);
  const fullName = getUserFullName(user);
  const role = user?.rol || 'Docente';

  const avatarElement = (
    <div
      className={`core-avatar core-avatar--${size} ${className}`.trim()}
      title={fullName}
      aria-label={`Avatar de ${fullName}`}
    >
      <span>{initials}</span>
    </div>
  );

  if (!showDetails) {
    return avatarElement;
  }

  return (
    <div className="core-user-chip">
      {avatarElement}
      <div className="core-user-chip__info">
        <span className="core-user-chip__name">{fullName}</span>
        <span className="core-user-chip__role">{role}</span>
      </div>
    </div>
  );
};
