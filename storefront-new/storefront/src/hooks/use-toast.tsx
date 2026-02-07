// hooks/useToast.ts
import { toast } from "sonner";

type ToastType = "success" | "error" | "info" | "warning";

const toastStyles: Record<ToastType, string> = {
  success: "bg-green-100 border-l-4 border-green-500 text-green-800",
  error: "bg-red-100 border-l-4 border-red-500 text-red-800",
  info: "bg-blue-100 border-l-4 border-blue-500 text-blue-800",
  warning: "bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800",
};

export function useToast() {
  const show = (message: string, type: ToastType = "info") => {
    toast.custom(() => (
      <div className={`${toastStyles[type]} p-4 rounded shadow`}>{message}</div>
    ));
  };

  return {
    showSuccess: (msg: string) => show(msg, "success"),
    showError: (msg: string) => show(msg, "error"),
    showInfo: (msg: string) => show(msg, "info"),
    showWarning: (msg: string) => show(msg, "warning"),
  };
}
