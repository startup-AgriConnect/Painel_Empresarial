import React from 'react';
import { cn, getButtonClasses } from '../../design';
import type { LucideIcon } from 'lucide-react';

// ========================
// BUTTON TYPES
// ========================

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  fullWidth?: boolean;
}

// ========================
// BUTTON COMPONENT
// ========================

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({
  variant = 'primary',
  size = 'md', 
  loading = false,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  fullWidth = false,
  className,
  disabled,
  children,
  ...props
}, ref) => {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        getButtonClasses(variant, size),
        fullWidth && 'w-full',
        className
      )}
      {...props}
    >
      {loading && (
        <svg 
          className="w-4 h-4 mr-2 animate-spin" 
          fill="none" 
          viewBox="0 0 24 24"
        >
          <circle 
            className="opacity-25" 
            cx="12" 
            cy="12" 
            r="10" 
            stroke="currentColor" 
            strokeWidth="4"
          />
          <path 
            className="opacity-75" 
            fill="currentColor" 
            d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      )}
      
      {!loading && LeftIcon && (
        <LeftIcon className={cn("w-4 h-4", children ? "mr-2" : "")} />
      )}
      
      {children}
      
      {!loading && RightIcon && (
        <RightIcon className={cn("w-4 h-4", children ? "ml-2" : "")} />
      )}
    </button>
  );
});

Button.displayName = 'Button';

// ========================
// ICON BUTTON COMPONENT  
// ========================

export interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
  icon: LucideIcon;
  'aria-label': string;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon: Icon,
  variant = 'ghost',
  size = 'md',
  'aria-label': ariaLabel,
  className,
  ...props
}, ref) => {
  const iconSize = {
    xs: 'w-3 h-3',
    sm: 'w-4 h-4', 
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7',
  }[size];

  return (
    <Button
      ref={ref}
      variant={variant}
      size={size} 
      className={cn('p-2', className)}
      aria-label={ariaLabel}
      {...props}
    >
      <Icon className={iconSize} />
    </Button>
  );
});

IconButton.displayName = 'IconButton';

// ========================
// BUTTON GROUP COMPONENT
// ========================

export interface ButtonGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'none' | 'sm' | 'md';
  className?: string;
}

export const ButtonGroup: React.FC<ButtonGroupProps> = ({
  children,
  orientation = 'horizontal',
  spacing = 'sm',
  className
}) => {
  const spacingClasses = {
    none: '',
    sm: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
    md: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4',
  };

  return (
    <div 
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        spacingClasses[spacing],
        className
      )}
      role="group"
    >
      {children}
    </div>
  );
};

// ========================
// FLOATING ACTION BUTTON
// ========================

export interface FABProps extends Omit<ButtonProps, 'variant' | 'size'> {
  icon: LucideIcon;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  'aria-label': string;
}

export const FloatingActionButton: React.FC<FABProps> = ({
  icon: Icon,
  position = 'bottom-right',
  'aria-label': ariaLabel,
  className,
  ...props
}) => {
  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6',
    'bottom-left': 'fixed bottom-6 left-6', 
    'top-right': 'fixed top-6 right-6',
    'top-left': 'fixed top-6 left-6',
  };

  return (
    <Button
      variant="primary"
      className={cn(
        positionClasses[position],
        'w-14 h-14 rounded-full shadow-lg hover:shadow-xl z-50 p-0',
        className
      )}
      aria-label={ariaLabel}
      {...props}
    >
      <Icon className="w-6 h-6" />
    </Button>
  );
};