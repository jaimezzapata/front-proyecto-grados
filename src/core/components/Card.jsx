import React from 'react';
import './card.css';

export const Card = ({
  children,
  className = '',
  variant = 'default', // default, elevated, flat
  padding = 'normal',  // none, normal, large
  ...props
}) => {
  return (
    <div
      className={`core-card core-card--${variant} core-card--pad-${padding} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
