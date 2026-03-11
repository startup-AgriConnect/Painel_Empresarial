import React from "react";
import { cn, getCardClasses } from "../../design";
import type { LucideIcon } from "lucide-react";

// ========================
// CARD TYPES
// ========================

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "elevated" | "glass" | "flat" | "outline";
  padding?: "none" | "sm" | "md" | "lg" | "xl";
  rounded?: "none" | "sm" | "md" | "lg" | "xl";
  hoverable?: boolean;
  loading?: boolean;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  subtitle?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  justify?: "start" | "center" | "end" | "between";
}

// ========================
// CARD COMPONENT
// ========================

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      variant = "elevated",
      padding = "md",
      rounded = "lg",
      hoverable = false,
      loading = false,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    if (loading) {
      return (
        <div
          ref={ref}
          className={cn(
            getCardClasses(variant, padding, rounded),
            "animate-pulse",
            className,
          )}
          {...props}
        >
          <div className="space-y-4">
            <div className="h-4 bg-surface-200 dark:bg-surface-700 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded"></div>
              <div className="h-3 bg-surface-200 dark:bg-surface-700 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(
          getCardClasses(variant, padding, rounded),
          hoverable && "hover:-translate-y-1 hover:shadow-lg cursor-pointer",
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";

// ========================
// CARD HEADER COMPONENT
// ========================

export const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  (
    { title, subtitle, icon: Icon, action, className, children, ...props },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-start justify-between",
          (title || subtitle || Icon) && "mb-4",
          className,
        )}
        {...props}
      >
        <div className="flex items-start space-x-3 min-w-0 flex-1">
          {Icon && (
            <div className="flex-shrink-0 w-10 h-10 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
              <Icon className="w-5 h-5 text-primary-600 dark:text-primary-400" />
            </div>
          )}

          <div className="min-w-0 flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 truncate">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-surface-600 dark:text-surface-400 mt-1 line-clamp-2">
                {subtitle}
              </p>
            )}
            {children}
          </div>
        </div>

        {action && <div className="flex-shrink-0 ml-4">{action}</div>}
      </div>
    );
  },
);

CardHeader.displayName = "CardHeader";

// ========================
// CARD CONTENT COMPONENT
// ========================

export const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("text-surface-700 dark:text-surface-300", className)}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardContent.displayName = "CardContent";

// ========================
// CARD FOOTER COMPONENT
// ========================

export const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ justify = "end", className, children, ...props }, ref) => {
    const justifyClasses = {
      start: "justify-start",
      center: "justify-center",
      end: "justify-end",
      between: "justify-between",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center mt-6",
          justifyClasses[justify],
          className,
        )}
        {...props}
      >
        {children}
      </div>
    );
  },
);

CardFooter.displayName = "CardFooter";

// ========================
// STATS CARD COMPONENT
// ========================

export interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: LucideIcon;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "default" | "success" | "warning" | "danger" | "info";
  loading?: boolean;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend = "neutral",
  trendValue,
  color = "default",
  loading = false,
  className,
}) => {
  const colorClasses = {
    default:
      "text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20",
    success:
      "text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/20",
    warning:
      "text-warning-600 dark:text-warning-400 bg-warning-50 dark:bg-warning-900/20",
    danger:
      "text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-900/20",
    info: "text-info-600 dark:text-info-400 bg-info-50 dark:bg-info-900/20",
  };

  const trendClasses = {
    up: "text-success-600 dark:text-success-400 bg-success-50 dark:bg-success-900/20",
    down: "text-danger-600 dark:text-danger-400 bg-danger-50 dark:bg-danger-900/20",
    neutral:
      "text-surface-600 dark:text-surface-400 bg-surface-50 dark:bg-surface-800",
  };

  return (
    <Card hoverable loading={loading} className={className}>
      <div className="flex items-start justify-between mb-4">
        {Icon && (
          <div className={cn("p-3 rounded-xl", colorClasses[color])}>
            <Icon className="w-5 h-5" />
          </div>
        )}

        {trendValue && (
          <div
            className={cn(
              "px-2.5 py-1 rounded-full text-xs font-semibold",
              trendClasses[trend],
            )}
          >
            {trend === "up" && "↗"}
            {trend === "down" && "↘"}
            {trendValue}
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-surface-600 dark:text-surface-400 mb-1">
          {title}
        </p>
        <p className="text-3xl font-bold text-surface-900 dark:text-surface-100 tracking-tight">
          {value}
        </p>
        {subtitle && (
          <p className="text-xs text-surface-500 dark:text-surface-500 mt-2">
            {subtitle}
          </p>
        )}
      </div>
    </Card>
  );
};

// ========================
// METRIC CARD COMPONENT
// ========================

export interface MetricCardProps {
  label: string;
  value: string | number;
  change?: {
    value: string;
    trend: "up" | "down" | "neutral";
    period?: string;
  };
  icon?: LucideIcon;
  loading?: boolean;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  icon: Icon,
  loading = false,
  className,
}) => {
  return (
    <Card variant="glass" loading={loading} className={className}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-surface-500 dark:text-surface-500 uppercase tracking-wider mb-2">
            {label}
          </p>
          <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">
            {value}
          </p>
          {change && (
            <div className="flex items-center mt-2 space-x-1">
              <span
                className={cn(
                  "text-sm font-medium",
                  change.trend === "up" &&
                    "text-success-600 dark:text-success-400",
                  change.trend === "down" &&
                    "text-danger-600 dark:text-danger-400",
                  change.trend === "neutral" &&
                    "text-surface-600 dark:text-surface-400",
                )}
              >
                {change.trend === "up" && "↗"}
                {change.trend === "down" && "↘"}
                {change.value}
              </span>
              {change.period && (
                <span className="text-xs text-surface-500 dark:text-surface-500">
                  {change.period}
                </span>
              )}
            </div>
          )}
        </div>

        {Icon && (
          <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/20 rounded-lg flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
        )}
      </div>
    </Card>
  );
};
