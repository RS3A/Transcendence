import React from 'react';
import './Button.css';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
}

export default function Button({ children, onClick, className, style }: ButtonProps) {
  return (
    <button className={`button ${className || ''}`} onClick={onClick} style={style}>
      {children}
    </button>
  );
}