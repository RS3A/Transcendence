import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import "./Dialog.css";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Portal>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Portal>
>(({ ...props }, ref) => (
  <DialogPrimitive.Portal ref={ref} {...props} />
));
DialogPortal.displayName = DialogPrimitive.Portal.displayName;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={`dialog-overlay ${className || ''}`.trim()}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={`dialog-content ${className || ''}`.trim()}
      {...props}
    >
      {children}
      <DialogPrimitive.Close className={styles.dialogClose}>
        <X className={styles.dialogCloseIcon} />
        <span className={styles.dialogCloseSrOnly}>Close</span>
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={`dialog-title ${className || ''}`.trim()}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={`dialog-description ${className || ''}`.trim()}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

const DialogFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`dialog-footer ${className || ''}`.trim()}
      {...props}
    />
  )
);
DialogFooter.displayName = "DialogFooter";

const DialogHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={`dialog-header ${className || ''}`.trim()}
      {...props}
    />
  )
);
DialogHeader.displayName = "DialogHeader";

const DialogClose = DialogPrimitive.Close;

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
  DialogHeader,
};