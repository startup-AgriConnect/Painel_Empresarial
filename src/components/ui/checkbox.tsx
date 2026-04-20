import * as React from 'react';
import { cn } from '../../lib/utils';

const Checkbox = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          'h-4 w-4 rounded border border-gray-300 text-emerald-600 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/20',
          className
        )}
        {...props}
      />
    );
  }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
