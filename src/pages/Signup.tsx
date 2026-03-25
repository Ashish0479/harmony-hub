import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, User, ArrowRight, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<"student" | "admin">("student");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = role === "admin" ? "/admin" : "/dashboard";
  };

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full gradient-warm opacity-10 blur-3xl animate-float" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full bg-secondary opacity-10 blur-3xl animate-float" style={{ animationDelay: "3s" }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold font-display gradient-warm-text">HostelHub</h1>
          <p className="text-muted-foreground mt-2">Create your account</p>
        </div>

        <div className="glass-card p-8">
          <h2 className="text-2xl font-semibold font-display text-foreground mb-1">Get Started</h2>
          <p className="text-muted-foreground mb-6 text-sm">Join the smart campus experience</p>

          {/* Role Toggle */}
          <div className="flex gap-2 mb-6 p-1 bg-muted/50 rounded-xl">
            {(["student", "admin"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  role === r
                    ? "gradient-warm text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r === "admin" ? <Shield className="h-4 w-4" /> : <User className="h-4 w-4" />}
                {r === "student" ? "Student" : "Admin"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Full Name" className="pl-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="email" placeholder="Email address" className="pl-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="pl-10 pr-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input type="password" placeholder="Confirm Password" className="pl-10 h-12 rounded-xl bg-muted/50 border-border/50 focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>

            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
              <Button type="submit" className="w-full h-12 rounded-xl gradient-warm text-primary-foreground font-semibold text-base shadow-lg hover:shadow-xl transition-all duration-300 border-0">
                Create Account
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </motion.div>
          </form>

          <p className="text-center mt-6 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
