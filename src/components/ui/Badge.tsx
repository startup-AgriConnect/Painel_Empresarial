import React from 'react';
import { cn, getBadgeClasses } from '../../design';
import type { LucideIcon } from 'lucide-react';

// ========================
// BADGE TYPES
// ========================

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  dot?: boolean;
  pulse?: boolean;
}

// ========================
// BADGE COMPONENT
// ========================

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(({
  variant = 'neutral',
  size = 'md',
  icon: Icon,
  dot = false,
  pulse = false,
  className,
  children,
  ...props
}, ref) => {
  return (
    <span
      ref={ref}
      className={cn(
        getBadgeClasses(variant, size),
        pulse && 'animate-pulse-subtle',
        className
      )}
      {...props}
    >
      {dot && (
        <span 
          className={cn(
            'w-2 h-2 rounded-full mr-1.5',
            variant === 'primary' && 'bg-agriYellow-500',
            variant === 'secondary' && 'bg-agriGreen-500',
            variant === 'success' && 'bg-success-500',
            variant === 'warning' && 'bg-warning-500',
            variant === 'danger' && 'bg-danger-500',
            variant === 'info' && 'bg-info-500',
            variant === 'neutral' && 'bg-surface-500',
            pulse && 'animate-pulse'
          )} 
        />
      )}
      
      {Icon && (
        <Icon className={cn(
          'mr-1',
          size === 'xs' && 'w-3 h-3',
          size === 'sm' && 'w-3 h-3',
          size === 'md' && 'w-4 h-4',
          size === 'lg' && 'w-4 h-4'
        )} />
      )}
      
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

// ========================
// STATUS BADGE COMPONENT
// ========================

export interface StatusBadgeProps extends Omit<BadgeProps, 'variant' | 'dot'> {
  status: 'online' | 'offline' | 'busy' | 'away' | 'loading';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className,
  children,
  ...props
}) => {
  const statusConfig = {
    online: { variant: 'success' as const, dot: true, pulse: false, text: 'Online' },
    offline: { variant: 'neutral' as const, dot: true, pulse: false, text: 'Offline' },
    busy: { variant: 'danger' as const, dot: true, pulse: false, text: 'Ocupado' },
    away: { variant: 'warning' as const, dot: true, pulse: false, text: 'Ausente' },
    loading: { variant: 'info' as const, dot: true, pulse: true, text: 'Carregando...' },
  };

  const config = statusConfig[status];

  return (
    <Badge
      variant={config.variant}
      dot={config.dot}
      pulse={config.pulse}
      className={className}
      {...props}
    >
      {children || config.text}
    </Badge>
  );
};

// ========================
// NOTIFICATION BADGE
// ========================

export interface NotificationBadgeProps {
  count?: number;
  max?: number;
  showZero?: boolean;
  invisible?: boolean;
  variant?: 'danger' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  children: React.ReactElement;
}

export const NotificationBadge: React.FC<NotificationBadgeProps> = ({
  count = 0,
  max = 99,
  showZero = false,
  invisible = false,
  variant = 'danger',
  size = 'md',
  className,
  children
}) => {
  const displayValue = count > max ? `${max}+` : count.toString();
  const shouldShow = count > 0 || showZero;

  const sizeClasses = {
    sm: 'w-4 h-4 text-xs',
    md: 'w-5 h-5 text-xs',
    lg: 'w-6 h-6 text-sm',
  };

  const variantClasses = {
    danger: 'bg-danger-500 text-white',
    warning: 'bg-warning-500 text-black',
    info: 'bg-info-500 text-white',
  };

  return (
    <div className="relative inline-block">
      {children}
      {shouldShow && !invisible && (
        <span
          className={cn(
            'absolute -top-1 -right-1 flex items-center justify-center rounded-full font-semibold leading-none transform transition-transform',
            sizeClasses[size],
            variantClasses[variant],
            count > 0 && 'animate-scale-in',
            className
          )}
        >
          {displayValue}
        </span>
      )}
    </div>
  );
};

// ========================
// PROGRESS BAR COMPONENT
// ========================

export interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  label?: string;
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  label,
  showValue = false,
  animated = false,
  className
}) => {
  const percentage = Math.min((value / max) * 100, 100);

  const sizeClasses = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const variantClasses = {
    primary: 'bg-agriYellow-400',
    secondary: 'bg-agriGreen-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    danger: 'bg-danger-500',
  };

  return (
    <div className={cn('w-full', className)}>
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-surface-700 dark:text-surface-300">
              {label}
            </span>
          )}
          {showValue && (
            <span className="text-sm text-surface-600 dark:text-surface-400">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}
      
      <div className={cn(
        'w-full bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden',
        sizeClasses[size]
      )}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-500 ease-out',
            variantClasses[variant],
            animated && 'animate-pulse-subtle'
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// ========================
// CIRCULAR PROGRESS
// ========================

export interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  label?: string;
  showValue?: boolean;
  className?: string;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  max = 100,
  size = 120,
  strokeWidth = 8,
  variant = 'primary',
  label,
  showValue = true,
  className
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const variantColors = {
    primary: '#fbbf24',
    secondary: '#10b981',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-surface-200 dark:text-surface-700"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={variantColors[variant]}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-500 ease-out"
        />
      </svg>
      
      {(label || showValue) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {showValue && (
            <span className="text-2xl font-bold text-surface-900 dark:text-surface-100">
              {Math.round(percentage)}%
            </span>
          )}
          {label && (
            <span className="text-sm text-surface-600 dark:text-surface-400 mt-1">
              {label}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

// ========================
// SKELETON COMPONENT
// ========================

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: 'text' | 'rectangular' | 'circular';
  animation?: 'pulse' | 'wave' | 'none';
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '1rem',
  variant = 'rectangular',
  animation = 'pulse',
  className
}) => {
  const variantClasses = {
    text: 'rounded',
    rectangular: 'rounded-lg',
    circular: 'rounded-full',
  };

  const animationClasses = {
    pulse: 'animate-pulse',
    wave: 'animate-shimmer',
    none: '',
  };

  return (
    <div
      className={cn(
        'bg-surface-200 dark:bg-surface-700',
        variantClasses[variant],
        animationClasses[animation],
        className
      )}
      style={{ width, height }}
    />
  );
};