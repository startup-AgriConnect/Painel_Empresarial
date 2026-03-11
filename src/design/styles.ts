/**
 * 🎨 Design System Styles
 * Classes CSS otimizadas para componentes do AgriConnect
 */

import { variants } from './tokens';

// ========================
// BUTTON STYLES
// ========================

export const buttonStyles = {
  // Base styles
  base: 'inline-flex items-center justify-center font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-agriYellow-400 disabled:opacity-50 disabled:cursor-not-allowed select-none',
  
  // Size variants
  size: {
    xs: 'px-3 py-1.5 text-xs rounded-md',
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-5 py-2.5 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-xl',
    xl: 'px-8 py-4 text-lg rounded-xl',
  },

  // Color variants  
  variant: {
    primary: 'bg-agriYellow-400 text-slate-900 hover:bg-agriYellow-500 shadow-md hover:shadow-lg hover:shadow-agriYellow-500/20 active:scale-95',
    secondary: 'bg-agriGreen-500 text-white hover:bg-agriGreen-600 shadow-md hover:shadow-lg hover:shadow-agriGreen-500/20 active:scale-95',
    outline: 'border-2 border-agriYellow-400 text-agriYellow-600 hover:bg-agriYellow-400 hover:text-slate-900 dark:text-agriYellow-400 dark:hover:text-slate-900',
    ghost: 'text-surface-600 hover:bg-surface-100 dark:text-surface-400 dark:hover:bg-surface-800',
    danger: 'bg-danger-500 text-white hover:bg-danger-600 shadow-md hover:shadow-lg hover:shadow-danger-500/20 active:scale-95',
    success: 'bg-success-500 text-white hover:bg-success-600 shadow-md hover:shadow-lg hover:shadow-success-500/20 active:scale-95',
  }
} as const;

// ========================
// CARD STYLES  
// ========================

export const cardStyles = {
  base: 'transition-all duration-200',
  
  variant: {
    elevated: 'bg-white dark:bg-surface-800 shadow-elevation-2 hover:shadow-elevation-3 border border-surface-200 dark:border-surface-700',
    glass: 'glass-card dark:glass-card-dark backdrop-blur-md border border-white/20 dark:border-white/10',
    flat: 'bg-surface-50 dark:bg-surface-900 border border-surface-200 dark:border-surface-700',
    outline: 'border-2 border-surface-200 dark:border-surface-700 hover:border-agriYellow-400 dark:hover:border-agriYellow-400',
  },

  padding: {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
    xl: 'p-10',
  },

  rounded: {
    none: 'rounded-none',
    sm: 'rounded-lg',
    md: 'rounded-xl',
    lg: 'rounded-2xl',
    xl: 'rounded-3xl',
  }
} as const;

// ========================
// INPUT STYLES
// ========================

export const inputStyles = {
  base: 'block w-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-agriYellow-400 focus:border-transparent disabled:opacity-50 disabled:cursor-not-disabled',
  
  variant: {
    default: 'bg-white dark:bg-surface-800 border-2 border-surface-300 dark:border-surface-600 text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500',
    filled: 'bg-surface-100 dark:bg-surface-800 border-2 border-transparent text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500 focus:bg-white dark:focus:bg-surface-700',
    underlined: 'bg-transparent border-0 border-b-2 border-surface-300 dark:border-surface-600 rounded-none text-surface-900 dark:text-white placeholder-surface-400 dark:placeholder-surface-500',
  },

  size: {
    sm: 'px-3 py-2 text-sm rounded-lg',
    md: 'px-4 py-2.5 text-sm rounded-xl',
    lg: 'px-5 py-3 text-base rounded-xl',
  },

  state: {
    error: 'border-danger-500 focus:ring-danger-500',
    success: 'border-success-500 focus:ring-success-500',
    warning: 'border-warning-500 focus:ring-warning-500',
  }
} as const;

// ========================
// BADGE STYLES
// ========================

export const badgeStyles = {
  base: 'inline-flex items-center font-semibold transition-colors duration-200',
  
  size: {
    xs: 'px-2 py-0.5 text-xs rounded-full',
    sm: 'px-2.5 py-1 text-xs rounded-full', 
    md: 'px-3 py-1 text-sm rounded-full',
    lg: 'px-3.5 py-1.5 text-sm rounded-full',
  },

  variant: {
    primary: 'bg-agriYellow-100 text-agriYellow-800 dark:bg-agriYellow-900/30 dark:text-agriYellow-300',
    secondary: 'bg-agriGreen-100 text-agriGreen-800 dark:bg-agriGreen-900/30 dark:text-agriGreen-300',
    success: 'bg-success-100 text-success-800 dark:bg-success-900/30 dark:text-success-300', 
    warning: 'bg-warning-100 text-warning-800 dark:bg-warning-900/30 dark:text-warning-300',
    danger: 'bg-danger-100 text-danger-800 dark:bg-danger-900/30 dark:text-danger-300',
    info: 'bg-info-100 text-info-800 dark:bg-info-900/30 dark:text-info-300',
    neutral: 'bg-surface-100 text-surface-800 dark:bg-surface-800 dark:text-surface-300',
  }
} as const;

// ========================
// TABLE STYLES
// ========================

export const tableStyles = {
  wrapper: 'overflow-hidden rounded-xl border border-surface-200 dark:border-surface-700',
  table: 'w-full divide-y divide-surface-200 dark:divide-surface-700',
  thead: 'bg-surface-50 dark:bg-surface-800',
  th: 'px-6 py-3 text-left text-xs font-bold text-surface-500 dark:text-surface-400 uppercase tracking-wider',
  tbody: 'bg-white dark:bg-surface-900 divide-y divide-surface-200 dark:divide-surface-700',
  td: 'px-6 py-4 whitespace-nowrap text-sm text-surface-900 dark:text-surface-100',
  tr: 'hover:bg-surface-50 dark:hover:bg-surface-800 transition-colors duration-150',
} as const;

// ========================
// NAVIGATION STYLES
// ========================

export const navigationStyles = {
  sidebar: {
    base: 'flex flex-col transition-all duration-300 bg-gradient-to-b from-surface-900 via-surface-800 to-surface-900 border-r border-surface-700',
    open: 'w-72',
    closed: 'w-20',
  },

  navItem: {
    base: 'flex items-center transition-all duration-200 font-medium rounded-xl mx-2 my-1',
    active: 'bg-agriYellow-400 text-slate-900 shadow-lg shadow-agriYellow-400/20',
    inactive: 'text-surface-400 hover:bg-surface-700 hover:text-white',
    padding: 'px-4 py-3',
  },

  header: {
    base: 'bg-white/90 dark:bg-surface-900/90 backdrop-blur-xl border-b border-surface-200/50 dark:border-surface-800/50 sticky top-0 z-40',
    content: 'px-6 md:px-8 py-4 flex justify-between items-center',
  }
} as const;

// ========================
// LAYOUT STYLES
// ========================

export const layoutStyles = {
  container: {
    base: 'mx-auto px-4 sm:px-6 lg:px-8',
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-screen-2xl',
    full: 'max-w-none',
  },

  section: {
    base: 'py-12 lg:py-16',
    sm: 'py-8 lg:py-12',
    lg: 'py-16 lg:py-24',
  },

  grid: {
    responsive: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6',
    dashboard: 'grid grid-cols-1 lg:grid-cols-3 gap-8',
    sidebar: 'flex h-screen bg-surface-50 dark:bg-surface-950',
  }
} as const;

// ========================
// ANIMATION CLASSES
// ========================

export const animationStyles = {
  fadeIn: 'animate-fade-in',
  slideInRight: 'animate-slide-in-right',
  slideInLeft: 'animate-slide-in-left',
  scaleIn: 'animate-scale-in',
  bounceGentle: 'animate-bounce-gentle',
  pulseSubtle: 'animate-pulse-subtle',
  shimmer: 'animate-shimmer',
} as const;

// ========================
// UTILITY FUNCTIONS
// ========================

export const cn = (...classes: (string | undefined | null | false)[]): string => {
  return classes.filter(Boolean).join(' ');
};

export const getButtonClasses = (
  variant: keyof typeof buttonStyles.variant = 'primary',
  size: keyof typeof buttonStyles.size = 'md',
  className?: string
) => {
  return cn(buttonStyles.base, buttonStyles.variant[variant], buttonStyles.size[size], className);
};

export const getCardClasses = (
  variant: keyof typeof cardStyles.variant = 'elevated',
  padding: keyof typeof cardStyles.padding = 'md',
  rounded: keyof typeof cardStyles.rounded = 'lg',
  className?: string
) => {
  return cn(cardStyles.base, cardStyles.variant[variant], cardStyles.padding[padding], cardStyles.rounded[rounded], className);
};

export const getInputClasses = (
  variant: keyof typeof inputStyles.variant = 'default',
  size: keyof typeof inputStyles.size = 'md',
  state?: keyof typeof inputStyles.state,
  className?: string
) => {
  return cn(
    inputStyles.base,
    inputStyles.variant[variant],
    inputStyles.size[size],
    state && inputStyles.state[state],
    className
  );
};

export const getBadgeClasses = (
  variant: keyof typeof badgeStyles.variant = 'neutral',
  size: keyof typeof badgeStyles.size = 'md',
  className?: string
) => {
  return cn(badgeStyles.base, badgeStyles.variant[variant], badgeStyles.size[size], className);
};

// ========================
// RESPONSIVE UTILITIES
// ========================

export const responsive = {
  // Show only on specific breakpoints
  showOn: {
    sm: 'hidden sm:block',
    md: 'hidden md:block', 
    lg: 'hidden lg:block',
    xl: 'hidden xl:block',
  },

  // Hide only on specific breakpoints  
  hideOn: {
    sm: 'sm:hidden',
    md: 'md:hidden',
    lg: 'lg:hidden', 
    xl: 'xl:hidden',
  },

  // Grid breakpoints
  cols: {
    responsive: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
    dashboard: 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3',
    kpi: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
  }
} as const;