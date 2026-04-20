import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const alertVariants = cva('relative w-full rounded-2xl border px-4 py-3 text-sm', {
  variants: {
    variant: {
      default: 'border-gray-200 bg-white text-gray-900',
      success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
      destructive: 'border-rose-200 bg-rose-50 text-rose-900',
      info: 'border-sky-200 bg-sky-50 text-sky-900',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

function Alert({
  className,
  variant,
  ...props
}: React.ComponentProps<'div'> & VariantProps<typeof alertVariants>) {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

function AlertTitle({ className, ...props }: React.ComponentProps<'h5'>) {
  return <h5 className={cn('mb-1 font-semibold leading-none tracking-tight', className)} {...props} />;
}

function AlertDescription({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('text-sm [&_p]:leading-relaxed', className)} {...props} />;
}

export { Alert, AlertTitle, AlertDescription };
