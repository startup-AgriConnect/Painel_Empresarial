/**
 * 🎨 AgriConnect Design System Tokens
 * Centraliza constantes visuais, espaçamentos e configurações de design
 */

// ========================
// COLOR PALETTE
// ========================

export const colors = {
  // Brand Colors
  brand: {
    primary: '#fbbf24',      // agriYellow-400
    secondary: '#10b981',    // agriGreen-500
    accent: '#f59e0b',       // agriYellow-500
  },

  // Surface Colors
  surface: {
    primary: '#ffffff',
    secondary: '#f8fafc',
    tertiary: '#f1f5f9',
    inverse: '#0f172a',
    overlay: 'rgba(0, 0, 0, 0.5)',
  },

  // Text Colors
  text: {
    primary: '#0f172a',
    secondary: '#475569',
    tertiary: '#64748b',
    inverse: '#ffffff',
    disabled: '#94a3b8',
  },

  // Status Colors
  status: {
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
  },

  // Glass Effect
  glass: {
    light: 'rgba(255, 255, 255, 0.25)',
    dark: 'rgba(15, 23, 42, 0.25)',
    border: 'rgba(255, 255, 255, 0.18)',
    borderDark: 'rgba(255, 255, 255, 0.1)',
  }
} as const;

// ========================
// TYPOGRAPHY
// ========================

export const typography = {
  fontFamily: {
    sans: 'Inter, system-ui, sans-serif',
    display: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, Fira Code, monospace',
  },

  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },

  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    black: 900,
  },

  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  }
} as const;

// ========================
// SPACING & LAYOUT
// ========================

export const spacing = {
  // Base spacing scale
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  2: '0.5rem',      // 8px
  3: '0.75rem',     // 12px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  8: '2rem',        // 32px
  10: '2.5rem',     // 40px
  12: '3rem',       // 48px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  32: '8rem',       // 128px

  // Component specific
  component: {
    padding: {
      xs: '0.5rem',
      sm: '0.75rem',
      md: '1rem',
      lg: '1.5rem',
      xl: '2rem',
    },
    margin: {
      xs: '0.5rem',
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
      xl: '3rem',
    },
  }
} as const;

// ========================
// BORDER RADIUS
// ========================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  '4xl': '2rem',    // 32px
  full: '9999px',
} as const;

// ========================
// SHADOWS & EFFECTS
// ========================

export const shadows = {
  none: 'none',
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

  // Special effects
  glow: '0 0 20px -5px rgba(251, 191, 36, 0.3)',
  glowGreen: '0 0 20px -5px rgba(16, 185, 129, 0.3)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
} as const;

// ========================
// TRANSITIONS & ANIMATIONS
// ========================

export const transitions = {
  duration: {
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
  },

  easing: {
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    linear: 'linear',
    spring: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  }
} as const;

// ========================
// COMPONENT VARIANTS
// ========================

export const variants = {
  button: {
    size: {
      xs: {
        padding: '0.375rem 0.75rem',
        fontSize: '0.75rem',
        borderRadius: '0.375rem',
      },
      sm: {
        padding: '0.5rem 1rem',
        fontSize: '0.875rem',
        borderRadius: '0.5rem',
      },
      md: {
        padding: '0.625rem 1.25rem',
        fontSize: '0.875rem',
        borderRadius: '0.5rem',
      },
      lg: {
        padding: '0.75rem 1.5rem',
        fontSize: '1rem',
        borderRadius: '0.75rem',
      },
      xl: {
        padding: '1rem 2rem',
        fontSize: '1.125rem',
        borderRadius: '0.75rem',
      },
    },

    variant: {
      primary: {
        backgroundColor: '#fbbf24',
        color: '#0f172a',
        hover: '#f59e0b',
      },
      secondary: {
        backgroundColor: '#10b981',
        color: '#ffffff',
        hover: '#047857',
      },
      outline: {
        backgroundColor: 'transparent',
        border: '2px solid #fbbf24',
        color: '#fbbf24',
        hover: '#fbbf24',
        hoverColor: '#0f172a',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: '#475569',
        hover: 'rgba(251, 191, 36, 0.1)',
      },
    }
  },

  card: {
    variant: {
      elevated: {
        backgroundColor: '#ffffff',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        borderRadius: '1rem',
      },
      glass: {
        backgroundColor: 'rgba(255, 255, 255, 0.25)',
        backdropFilter: 'blur(8px)',
        border: '1px solid rgba(255, 255, 255, 0.18)',
        borderRadius: '1.5rem',
      },
      flat: {
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
      },
    }
  }
} as const;

// ========================
// BREAKPOINTS
// ========================

export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1600px',
  '4xl': '1920px',
} as const;

// ========================
// Z-INDEX SCALE
// ========================

export const zIndex = {
  hide: -1,
  base: 0,
  docked: 10,
  dropdown: 1000,
  sticky: 1100,
  banner: 1200,
  overlay: 1300,
  modal: 1400,
  popover: 1500,
  skipLink: 1600,
  toast: 1700,
  tooltip: 1800,
} as const;

// ========================
// GRID SYSTEM
// ========================

export const grid = {
  columns: {
    1: '1fr',
    2: 'repeat(2, 1fr)',
    3: 'repeat(3, 1fr)',
    4: 'repeat(4, 1fr)',
    5: 'repeat(5, 1fr)',
    6: 'repeat(6, 1fr)',
    12: 'repeat(12, 1fr)',
  },

  gaps: {
    xs: '0.5rem',
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
    xl: '2.5rem',
  }
} as const;