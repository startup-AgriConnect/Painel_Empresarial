import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-gray-100 text-gray-700',
        success: 'border-transparent bg-emerald-100 text-emerald-700',
        destructive: 'border-transparent bg-rose-100 text-rose-700',
        warning: 'border-transparent bg-amber-100 text-amber-700',
        secondary: 'border-transparent bg-blue-100 text-blue-700',
        outline: 'border-gray-200 bg-white text-gray-700',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

function Badge({ className, variant, ...props }: React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
