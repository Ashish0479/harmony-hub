import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Mail, KeyRound, Lock } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiRequest, getErrorMessage } from "@/redux/apiClient";

const STEP = {
  EMAIL: "EMAIL",
  OTP: "OTP",
  PASSWORD: "PASSWORD",
};

const emailPattern = /^\S+@\S+\.\S+$/;

const ForgotPasswordDialog = ({ open, onOpenChange, initialEmail = "" }) => {
  const [step, setStep] = useState(STEP.EMAIL);
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setStep(STEP.EMAIL);
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setEmail(initialEmail || "");
  }, [open, initialEmail]);

  const title = useMemo(() => {
    if (step === STEP.OTP) return "Verify OTP";
    if (step === STEP.PASSWORD) return "Set New Password";
    return "Forgot Password";
  }, [step]);

  const description = useMemo(() => {
    if (step === STEP.OTP)
      return "Enter the 6-digit OTP sent to your email address.";
    if (step === STEP.PASSWORD)
      return "Create a new password for your account.";
    return "Enter your registered email to receive an OTP.";
  }, [step]);

  const handleSendOtp = async (event) => {
    event.preventDefault();
    const normalizedEmail = email.trim().toLowerCase();

    if (!emailPattern.test(normalizedEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      await apiRequest("/auth/forgot-password", {
        method: "POST",
        body: { email: normalizedEmail },
      });

      toast.success("OTP has been sent to your email");
      setEmail(normalizedEmail);
      setStep(STEP.OTP);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (event) => {
    event.preventDefault();
    const otpValue = otp.trim();

    if (!/^\d{6}$/.test(otpValue)) {
      toast.error("OTP must be a 6-digit number");
      return;
    }

    try {
      setLoading(true);
      await apiRequest("/auth/verify-otp", {
        method: "POST",
        body: {
          email,
          otp: otpValue,
        },
      });

      toast.success("OTP verified successfully");
      setStep(STEP.PASSWORD);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (event) => {
    event.preventDefault();

    if (!newPassword.trim() || !confirmPassword.trim()) {
      toast.error("Please fill both password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }

    try {
      setLoading(true);
      await apiRequest("/auth/reset-password", {
        method: "POST",
        body: {
          email,
          newPassword,
        },
      });

      toast.success("Password reset successful. Please login.");
      onOpenChange(false);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {step === STEP.EMAIL ? (
          <motion.form
            onSubmit={handleSendOtp}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder="Registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending OTP..." : "Send OTP"}
            </Button>
          </motion.form>
        ) : null}

        {step === STEP.OTP ? (
          <motion.form
            onSubmit={handleVerifyOtp}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="pl-10"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
          </motion.form>
        ) : null}

        {step === STEP.PASSWORD ? (
          <motion.form
            onSubmit={handleResetPassword}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </motion.form>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default ForgotPasswordDialog;
