import { useToast } from "../../../hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "./Toast";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        return (
          <Toast 
            key={id} 
            {...props}
            onDismiss={() => dismiss(id)}
          >
            <div className={`${styles.grid} ${styles.gap1}`}>
              {title && <ToastTitle>{title}</ToastTitle>}
              {description && <ToastDescription>{description}</ToastDescription>}
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
