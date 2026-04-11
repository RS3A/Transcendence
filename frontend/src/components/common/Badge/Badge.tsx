import * as React from "react";
import styles from './Badge.module.css';

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant = "default", ...props }, ref) => {
  const variantClass = `badge-${variant}`;

  return (
    <div
      ref={ref}
      className={`badge ${variantClass} ${className || ''}`.trim()}
      {...props}
    />
  );
});
Badge.displayName = "Badge";

export { Badge };
