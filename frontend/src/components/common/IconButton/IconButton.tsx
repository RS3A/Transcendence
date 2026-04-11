import React from 'react';
import styles from './IconButton.module.css';

interface IconButtonProps {
  variant?: 'primary' | 'secondary' | 'withdraw' | 'rating' | 'capacity';
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({
  variant = 'primary',
  className = '',
  children,
  icon,
  onClick,
  disabled = false,
}) => {
  return (
    <button
      className={`icon-button icon-button--${variant} ${className} ${disabled ? 'disabled' : ''}`}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
    >
      {icon && <span className={styles.iconButtonIcon}>{icon}</span>}
      <span className={styles.iconButtonText}>{children}</span>
    </button>
  );
};

export default IconButton;
