// components/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  className?: string;
  isPressed?: boolean; // For explicit pressed state if needed
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  isPressed = false,
  ...props
}) => {
  const baseClasses = `
    relative flex items-center justify-center
    px-4 py-2 rounded-xl text-lg font-semibold
    transition-all duration-200 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
    active:shadow-3d-button-pressed active:top-0.5 active:left-0.5
    ${isPressed ? 'shadow-3d-button-pressed top-0.5 left-0.5' : 'shadow-3d-button hover:shadow-xl hover:-translate-y-0.5 hover:-translate-x-0.5'}
  `;

  const variantClasses = {
    primary: 'bg-primary text-white hover:bg-primary/90',
    secondary: 'bg-secondary text-white hover:bg-secondary/90',
    outline: 'bg-transparent border-2 border-primary text-primary hover:bg-primary/10',
    ghost: 'bg-transparent text-primary hover:bg-primary/10 hover:shadow-none',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;