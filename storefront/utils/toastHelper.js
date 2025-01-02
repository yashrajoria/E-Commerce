import { useToast } from "@/hooks/use-toast";

const { toast } = useToast();

// Define common styles for success toast
const successToastStyle = {
  backgroundColor: "#4CAF50",
  color: "#FFFFFF",
  padding: "16px",
  borderRadius: "8px",
  fontSize: "16px",
};

// Helper function for toast notifications
export const showToast = (title, description, variant) => {
  const toastOptions = {
    title,
    description,
    ...(variant === "destructive"
      ? { variant: "destructive" }
      : { style: successToastStyle }),
  };
  toast(toastOptions);
};
