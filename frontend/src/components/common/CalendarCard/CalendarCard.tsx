import * as React from "react";
import styles from './CalendarCard.module.css';

const CalendarCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }: any, ref: any) => (
    <div
      ref={ref}
      className={`calendar-card ${className || ''}`.trim()}
      {...props}
    />
  )
);
CalendarCard.displayName = "CalendarCard";

const CalendarCardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`calendar-card-header ${className || ''}`.trim()}
      {...props}
    />
  )
);
CalendarCardHeader.displayName = "CalendarCardHeader";

const CalendarCardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3
      ref={ref}
      className={`calendar-card-title ${className || ''}`.trim()}
      {...props}
    />
  )
);
CalendarCardTitle.displayName = "CalendarCardTitle";

const CalendarCardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={`calendar-card-description ${className || ''}`.trim()}
      {...props}
    />
  )
);
CalendarCardDescription.displayName = "CalendarCardDescription";

const CalendarCardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`calendar-card-content ${className || ''}`.trim()}
      {...props}
    />
  )
);
CalendarCardContent.displayName = "CalendarCardContent";

const CalendarCardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`calendar-card-footer ${className || ''}`.trim()}
      {...props}
    />
  )
);
CalendarCardFooter.displayName = "CalendarCardFooter";

export {
  CalendarCard,
  CalendarCardHeader,
  CalendarCardFooter,
  CalendarCardTitle,
  CalendarCardDescription,
  CalendarCardContent,
};
