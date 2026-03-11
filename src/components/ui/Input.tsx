import React from 'react';
import { cn, getInputClasses } from '../../design';
import type { LucideIcon } from 'lucide-react';
import { Search, X } from 'lucide-react';

// ========================
// INPUT TYPES
// ========================

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  variant?: 'default' | 'filled' | 'underlined';
  size?: 'sm' | 'md' | 'lg';
  state?: 'error' | 'success' | 'warning';
  leftIcon?: LucideIcon;
  rightIcon?: LucideIcon;
  label?: string;
  helperText?: string;
  errorText?: string;
  loading?: boolean;
}

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'filled' | 'underlined';
  state?: 'error' | 'success' | 'warning';
  label?: string;
  helperText?: string;
  errorText?: string;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  variant?: 'default' | 'filled' | 'underlined';
  size?: 'sm' | 'md' | 'lg';
  state?: 'error' | 'success' | 'warning';
  label?: string;
  helperText?: string;
  errorText?: string;
  placeholder?: string;
  options: Array<{ value: string; label: string; disabled?: boolean }>;
}

// ========================
// INPUT COMPONENT
// ========================

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({
  variant = 'default',
  size = 'md',
  state,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  label,
  helperText,
  errorText,
  loading = false,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = state === 'error' || !!errorText;
  const finalState = hasError ? 'error' : state;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {LeftIcon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <LeftIcon className="w-5 h-5 text-surface-400 dark:text-surface-500" />
          </div>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={cn(
            getInputClasses(variant, size, finalState),
            LeftIcon && 'pl-10',
            (RightIcon || loading) && 'pr-10',
            className
          )}
          {...props}
        />
        
        {(RightIcon || loading) && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {loading ? (
              <svg className="w-4 h-4 animate-spin text-surface-400" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            ) : RightIcon && (
              <RightIcon className="w-5 h-5 text-surface-400 dark:text-surface-500" />
            )}
          </div>
        )}
      </div>
      
      {(helperText || errorText) && (
        <p className={cn(
          'mt-2 text-sm',
          hasError 
            ? 'text-danger-600 dark:text-danger-400' 
            : 'text-surface-600 dark:text-surface-400'
        )}>
          {errorText || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

// ========================
// TEXTAREA COMPONENT
// ========================

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({
  variant = 'default',
  state,
  label,
  helperText,
  errorText,
  resize = 'vertical',
  className,
  id,
  rows = 4,
  ...props
}, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = state === 'error' || !!errorText;
  const finalState = hasError ? 'error' : state;

  const resizeClasses = {
    none: 'resize-none',
    vertical: 'resize-y',
    horizontal: 'resize-x', 
    both: 'resize',
  };

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={textareaId}
          className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2"
        >
          {label}
        </label>
      )}
      
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          getInputClasses(variant, 'md', finalState),
          resizeClasses[resize],
          className
        )}
        {...props}
      />
      
      {(helperText || errorText) && (
        <p className={cn(
          'mt-2 text-sm',
          hasError 
            ? 'text-danger-600 dark:text-danger-400' 
            : 'text-surface-600 dark:text-surface-400'
        )}>
          {errorText || helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';

// ========================
// SELECT COMPONENT
// ========================

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({
  variant = 'default',
  size = 'md',
  state,
  label,
  helperText,
  errorText,
  placeholder,
  options,
  className,
  id,
  ...props
}, ref) => {
  const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
  const hasError = state === 'error' || !!errorText;
  const finalState = hasError ? 'error' : state;

  return (
    <div className="w-full">
      {label && (
        <label 
          htmlFor={selectId}
          className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          className={cn(
            getInputClasses(variant, size, finalState),
            'pr-10 cursor-pointer',
            className
          )}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map(({ value, label, disabled }) => (
            <option key={value} value={value} disabled={disabled}>
              {label}
            </option>
          ))}
        </select>
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
          <svg className="w-5 h-5 text-surface-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      {(helperText || errorText) && (
        <p className={cn(
          'mt-2 text-sm',
          hasError 
            ? 'text-danger-600 dark:text-danger-400' 
            : 'text-surface-600 dark:text-surface-400'
        )}>
          {errorText || helperText}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

// ========================
// SEARCH INPUT COMPONENT
// ========================

export interface SearchInputProps extends Omit<InputProps, 'leftIcon' | 'rightIcon'> {
  onSearch?: (value: string) => void;
  onClear?: () => void;
  showClearButton?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(({
  onSearch,
  onClear,
  showClearButton = true,
  className,
  onChange,
  value,
  ...props
}, ref) => {
  const [internalValue, setInternalValue] = React.useState(value || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange?.(e);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSearch?.(String(internalValue));
    }
  };

  const handleClear = () => {
    setInternalValue('');
    onClear?.();
  };

  return (
    <Input
      ref={ref}
      type="search"
      value={value !== undefined ? value : internalValue}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      leftIcon={Search}
      rightIcon={
        showClearButton && internalValue ? 
        X : 
        undefined
      }
      className={className}
      {...props}
    />
  );
});

SearchInput.displayName = 'SearchInput';

// ========================
// INPUT GROUP COMPONENT  
// ========================

export interface InputGroupProps {
  children: React.ReactNode;
  orientation?: 'horizontal' | 'vertical';
  spacing?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const InputGroup: React.FC<InputGroupProps> = ({
  children,
  orientation = 'vertical',
  spacing = 'md',
  className
}) => {
  const spacingClasses = {
    sm: orientation === 'horizontal' ? 'space-x-2' : 'space-y-2',
    md: orientation === 'horizontal' ? 'space-x-4' : 'space-y-4',
    lg: orientation === 'horizontal' ? 'space-x-6' : 'space-y-6',
  };

  return (
    <div 
      className={cn(
        'flex',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        spacingClasses[spacing],
        className
      )}
    >
      {children}
    </div>
  );
};