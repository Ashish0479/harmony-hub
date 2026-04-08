import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Hash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiRequest, getErrorMessage } from "@/redux/apiClient";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState("");
  const [roomNo, setRoomNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpDialogOpen, setIsOtpDialogOpen] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const normalizedEmail = email.trim().toLowerCase();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !fullName.trim() ||
      !roomNo.trim() ||
      !email.trim() ||
      !password.trim() ||
      !confirmPassword.trim()
    ) {
      toast.error("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const [firstName, ...rest] = fullName.trim().split(" ");
    const lastName = rest.join(" ");

    try {
      setSignupLoading(true);
      await apiRequest("/auth/signup-initiate", {
        method: "POST",
        body: {
          firstName,
          lastName,
          room_no: roomNo.trim(),
          email: normalizedEmail,
          password,
        },
      });

      toast.success("OTP sent to your email");
      setIsOtpDialogOpen(true);
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSignupLoading(false);
    }
  };

  const handleVerifySignupOtp = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp.trim())) {
      toast.error("OTP must be a 6-digit number");
      return;
    }

    try {
      setVerifyLoading(true);
      await apiRequest("/auth/signup-verify", {
        method: "POST",
        body: {
          email: normalizedEmail,
          otp: otp.trim(),
        },
      });

      toast.success("Signup successful. Please login.");
      setIsOtpDialogOpen(false);
      setOtp("");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full gradient-warm opacity-10 blur-3xl animate-float" />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-secondary opacity-10 blur-3xl animate-float"
        style={{ animationDelay: "3s" }}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-display gradient-warm-text">
            HostelHub
          </h1>
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-semibold font-display text-foreground mb-1">
            Get Started
          </h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Student signup only
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className="pl-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="relative">
              <Hash className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={roomNo}
                onChange={(e) => setRoomNo(e.target.value)}
                placeholder="Room Number"
                required
                className="pl-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Email address"
                className="pl-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="pl-10 pr-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm Password"
                className="pl-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button
                disabled={signupLoading}
                type="submit"
                className="w-full h-12 rounded-xl gradient-warm text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 border-0"
              >
                {signupLoading ? "Creating..." : "Create Account"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>

        <Dialog open={isOtpDialogOpen} onOpenChange={setIsOtpDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Verify Signup OTP</DialogTitle>
              <DialogDescription>
                Enter the OTP sent to {normalizedEmail || "your email"}.
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleVerifySignupOtp} className="space-y-4">
              <Input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
              />

              <Button type="submit" className="w-full" disabled={verifyLoading}>
                {verifyLoading ? "Verifying..." : "Verify OTP"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};
export default Signup;
