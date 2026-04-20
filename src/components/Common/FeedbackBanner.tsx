import React from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Button } from '../ui/button';

interface FeedbackBannerProps {
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
  onDismiss?: () => void;
}

const styles = {
  success: {
    container: 'border-emerald-200 bg-emerald-50 text-emerald-900',
    icon: CheckCircle2,
    iconClassName: 'text-emerald-600',
  },
  error: {
    container: 'border-rose-200 bg-rose-50 text-rose-900',
    icon: AlertCircle,
    iconClassName: 'text-rose-600',
  },
  info: {
    container: 'border-sky-200 bg-sky-50 text-sky-900',
    icon: Info,
    iconClassName: 'text-sky-600',
  },
};

export default function FeedbackBanner({ type, title, message, onDismiss }: FeedbackBannerProps) {
  const { container, icon: Icon, iconClassName } = styles[type];

  return (
    <Alert className={container} variant={type === 'error' ? 'destructive' : type} role="status" aria-live="polite">
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${iconClassName}`} />
        <div className="min-w-0 flex-1">
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </div>
        {onDismiss && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onDismiss}
            className="h-8 w-8 rounded-full text-current/70 hover:bg-white/60 hover:text-current"
            aria-label="Fechar mensagem"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Alert>
  );
}
