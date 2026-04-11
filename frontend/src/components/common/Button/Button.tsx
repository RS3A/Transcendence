import React from 'react';
import styles from './Button.module.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  disabled?: boolean;
}

export default function Button({ children, onClick, className, style, disabled }: ButtonProps) {
  return (
    <button className={`button ${className || ''}`} onClick={onClick} style={style} disabled={disabled}>
      {children}
    </button>
  );
}
