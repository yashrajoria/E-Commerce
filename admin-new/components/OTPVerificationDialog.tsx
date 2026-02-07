import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { toast } from "sonner";
import { CheckCircle, Mail, RefreshCcw } from "lucide-react";
import axios from "axios";

interface OTPVerificationDialogProps {
  open: boolean;
  onClose: () => void;
  email: string;
}

const OTPVerificationDialog = ({
  open,
  onClose,
  email,
}: OTPVerificationDialogProps) => {
  const [value, setValue] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleVerify = async () => {
    if (value.length < 6) {
      toast.error("Please enter a valid OTP code");
      return;
    }

    setIsVerifying(true);

    try {
      const res = await axios.post(
        "/api/auth/verify-otp",
        {
          email,
          code: value,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      setIsVerified(true);
      toast.success("OTP verified successfully");
    } catch (error) {
      console.error(error);
      toast.error("OTP verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    setIsResending(true);

    try {
      // Replace with real resend endpoint if available
      await axios.post("/api/auth/resend-otp", { email });
      setValue("");
      toast.success("New OTP code sent to your email");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="glass-effect max-w-md p-8 rounded-3xl shadow-2xl">
        {isVerified ? (
          <motion.div
            className="flex flex-col items-center justify-center py-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            >
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            </motion.div>
            <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
            <p className="text-muted-foreground mb-6">
              Your email has been successfully verified.
            </p>
            <Button
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
              aria-label="Continue"
              onClick={onClose}
            >
              Continue
            </Button>
          </motion.div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center">
                Verify Your Email
              </DialogTitle>
              <DialogDescription className="text-center pt-2">
                <div className="flex items-center justify-center mb-2">
                  <Mail className="h-5 w-5 mr-2 text-blue-400" />
                  <span>We&apos;ve sent a verification code to</span>
                </div>
                <span className="font-medium text-blue-400">{email}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <div className="mb-5 flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={value}
                  onChange={setValue}
                  disabled={isVerifying}
                  aria-label="Enter 6-digit OTP code"
                >
                  <InputOTPGroup>
                    {Array.from({ length: 6 }).map((_, idx) => (
                      <InputOTPSlot
                        key={idx}
                        index={idx}
                        className="w-12 h-14 text-xl mx-1 rounded-lg border-2 border-blue-200 focus:border-blue-500 transition-all"
                        aria-label={`OTP digit ${idx + 1}`}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center mb-2"
              >
                <Button
                  variant="link"
                  size="sm"
                  className="text-xs text-muted-foreground"
                  disabled={isResending}
                  onClick={handleResendOTP}
                  aria-label="Resend OTP code"
                >
                  {isResending ? (
                    <>
                      <RefreshCcw className="h-3 w-3 mr-1 animate-spin" />
                      Resending code...
                    </>
                  ) : (
                    "Didn't receive code? Resend"
                  )}
                </Button>
              </motion.div>
            </div>

            <DialogFooter>
              <Button
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white"
                disabled={value.length < 6 || isVerifying}
                onClick={handleVerify}
                aria-label="Verify Email"
              >
                {isVerifying ? "Verifying..." : "Verify Email"}
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default OTPVerificationDialog;
