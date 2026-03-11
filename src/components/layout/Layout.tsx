import React from 'react';
import { cn } from '../../design';

// ========================
// LAYOUT TYPES
// ========================

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
}

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12 | 'auto' | 'responsive';
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  responsive?: boolean;
  autoRows?: boolean;
}

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'col' | 'row-reverse' | 'col-reverse';
  align?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
}

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  size?: 'sm' | 'md' | 'lg';
  background?: 'default' | 'muted' | 'accent';
  fullHeight?: boolean;
}

export interface DashboardLayoutProps {
  sidebar: React.ReactNode;
  header?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  sidebarOpen?: boolean;
  className?: string;
}

// ========================
// CONTAINER COMPONENT
// ========================

export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({
  size = 'lg',
  padding = 'md',
  center = true,
  className,
  children,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'max-w-3xl',
    md: 'max-w-5xl',
    lg: 'max-w-7xl',
    xl: 'max-w-screen-2xl',
    full: 'max-w-none',
  };

  const paddingClasses = {
    none: '',
    sm: 'px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
    xl: 'px-8 sm:px-12 lg:px-16',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'w-full',
        sizeClasses[size],
        paddingClasses[padding],
        center && 'mx-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Container.displayName = 'Container';

// ========================
// GRID COMPONENT
// ========================

export const Grid = React.forwardRef<HTMLDivElement, GridProps>(({
  cols = 'responsive',
  gap = 'md',
  responsive = true,
  autoRows = false,
  className,
  children,
  ...props
}, ref) => {
  const colsClasses = {
    1: 'grid-cols-1',
    2: responsive ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2',
    3: responsive ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-3',
    4: responsive ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-4',
    5: responsive ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5' : 'grid-cols-5',
    6: responsive ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6' : 'grid-cols-6',
    12: 'grid-cols-12',
    auto: 'grid-cols-auto-fit',
    responsive: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  const gapClasses = {
    none: 'gap-0',
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
    xl: 'gap-10',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'grid',
        colsClasses[cols],
        gapClasses[gap],
        autoRows && 'grid-rows-auto',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Grid.displayName = 'Grid';

// ========================
// FLEX COMPONENT
// ========================

export const Flex = React.forwardRef<HTMLDivElement, FlexProps>(({
  direction = 'row',
  align = 'start',
  justify = 'start',
  wrap = false,
  gap = 'none',
  className,
  children,
  ...props
}, ref) => {
  const directionClasses = {
    row: 'flex-row',
    col: 'flex-col',
    'row-reverse': 'flex-row-reverse',
    'col-reverse': 'flex-col-reverse',
  };

  const alignClasses = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
    baseline: 'items-baseline',
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const gapClasses = {
    none: '',
    sm: direction.includes('col') ? 'space-y-2' : 'space-x-2',
    md: direction.includes('col') ? 'space-y-4' : 'space-x-4',
    lg: direction.includes('col') ? 'space-y-6' : 'space-x-6',
    xl: direction.includes('col') ? 'space-y-8' : 'space-x-8',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'flex',
        directionClasses[direction],
        alignClasses[align],
        justifyClasses[justify],
        wrap && 'flex-wrap',
        gapClasses[gap],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Flex.displayName = 'Flex';

// ========================
// SECTION COMPONENT
// ========================

export const Section = React.forwardRef<HTMLElement, SectionProps>(({
  size = 'md',
  background = 'default',
  fullHeight = false,
  className,
  children,
  ...props
}, ref) => {
  const sizeClasses = {
    sm: 'py-8 lg:py-12',
    md: 'py-12 lg:py-16',
    lg: 'py-16 lg:py-24',
  };

  const backgroundClasses = {
    default: 'bg-surface-50 dark:bg-surface-950',
    muted: 'bg-surface-100 dark:bg-surface-900',
    accent: 'bg-gradient-to-br from-agriYellow-50 via-surface-50 to-agriGreen-50 dark:from-agriYellow-950/20 dark:via-surface-950 dark:to-agriGreen-950/20',
  };

  return (
    <section
      ref={ref}
      className={cn(
        sizeClasses[size],
        backgroundClasses[background],
        fullHeight && 'min-h-screen flex items-center',
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
});

Section.displayName = 'Section';

// ========================
// DASHBOARD LAYOUT COMPONENT
// ========================

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  sidebar,
  header,
  footer,
  children,
  sidebarOpen = true,
  className
}) => {
  return (
    <div className={cn('flex h-screen bg-surface-50 dark:bg-surface-950', className)}>
      {/* Sidebar */}
      <aside
        className={cn(
          'flex-shrink-0 transition-all duration-300 z-50',
          sidebarOpen ? 'w-72' : 'w-20'
        )}
      >
        {sidebar}
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        {header && (
          <header className="flex-shrink-0">
            {header}
          </header>
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto focus:outline-none">
          <div className="relative">
            {children}
          </div>
        </main>

        {/* Footer */}
        {footer && (
          <footer className="flex-shrink-0">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
};

// ========================
// CARD GRID COMPONENT
// ========================

export interface CardGridProps extends GridProps {
  children: React.ReactNode;
  minCardWidth?: number;
}

export const CardGrid: React.FC<CardGridProps> = ({
  minCardWidth = 300,
  gap = 'md',
  className,
  children,
  ...props
}) => {
  return (
    <Grid
      cols="auto"
      gap={gap}
      className={cn(
        'grid-cols-auto-fit',
        className
      )}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${minCardWidth}px, 1fr))`,
      }}
      {...props}
    >
      {children}
    </Grid>
  );
};

// ========================
// MASONRY LAYOUT COMPONENT
// ========================

export interface MasonryLayoutProps {
  columns?: 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const MasonryLayout: React.FC<MasonryLayoutProps> = ({
  columns = 3,
  gap = 'md',
  children,
  className
}) => {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6', 
    lg: 'gap-8',
  };

  return (
    <div
      className={cn(
        'columns-1 sm:columns-2',
        columns >= 3 && 'lg:columns-3',
        columns >= 4 && 'xl:columns-4',
        gapClasses[gap],
        className
      )}
    >
      {React.Children.map(children, (child, index) => (
        <div key={index} className="break-inside-avoid mb-6">
          {child}
        </div>
      ))}
    </div>
  );
};

// ========================
// SPLIT LAYOUT COMPONENT
// ========================

export interface SplitLayoutProps {
  left: React.ReactNode;
  right: React.ReactNode;
  ratio?: '1:1' | '1:2' | '2:1' | '1:3' | '3:1';
  direction?: 'horizontal' | 'vertical';
  responsive?: boolean;
  gap?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SplitLayout: React.FC<SplitLayoutProps> = ({
  left,
  right,
  ratio = '1:1',
  direction = 'horizontal',
  responsive = true,
  gap = 'md',
  className
}) => {
  const ratioClasses = {
    '1:1': direction === 'horizontal' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-rows-2',
    '1:2': direction === 'horizontal' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-rows-3',
    '2:1': direction === 'horizontal' ? 'grid-cols-1 lg:grid-cols-3' : 'grid-rows-3',
    '1:3': direction === 'horizontal' ? 'grid-cols-1 lg:grid-cols-4' : 'grid-rows-4',
    '3:1': direction === 'horizontal' ? 'grid-cols-1 lg:grid-cols-4' : 'grid-rows-4',
  };

  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6',
    lg: 'gap-8',
  };

  const getColSpan = (side: 'left' | 'right') => {
    const spans = {
      '1:1': { left: '', right: '' },
      '1:2': { left: 'lg:col-span-1', right: 'lg:col-span-2' },
      '2:1': { left: 'lg:col-span-2', right: 'lg:col-span-1' },
      '1:3': { left: 'lg:col-span-1', right: 'lg:col-span-3' },
      '3:1': { left: 'lg:col-span-3', right: 'lg:col-span-1' },
    };
    return spans[ratio][side];
  };

  return (
    <div
      className={cn(
        'grid',
        ratioClasses[ratio],
        gapClasses[gap],
        className
      )}
    >
      <div className={getColSpan('left')}>
        {left}
      </div>
      <div className={getColSpan('right')}>
        {right}
      </div>
    </div>
  );
};

// ========================
// UTILITY COMPONENTS
// ========================

export const Spacer: React.FC<{ size?: 'sm' | 'md' | 'lg' | 'xl' }> = ({ 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-4',
    md: 'h-8',
    lg: 'h-12',
    xl: 'h-16',
  };

  return <div className={sizeClasses[size]} />;
};

export const Divider: React.FC<{ 
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}> = ({ orientation = 'horizontal', className }) => {
  return (
    <div
      className={cn(
        'bg-surface-200 dark:bg-surface-700',
        orientation === 'horizontal' ? 'h-px w-full' : 'w-px h-full',
        className
      )}
    />
  );
};