import { Link, useLocation } from "react-router-dom";
import { Bell, User, LogOut } from "lucide-react";
import { motion } from "framer-motion";

interface NavbarProps {
  userName?: string;
}

const Navbar = ({ userName = "Student" }: NavbarProps) => {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0"
    >
      <div className="flex items-center justify-between px-6 h-16">
        <Link to={isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2">
          <span className="text-xl font-bold font-display gradient-warm-text">HostelHub</span>
        </Link>

        <div className="flex items-center gap-3">
          <button className="relative p-2 rounded-xl hover:bg-muted/50 transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full gradient-warm" />
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="w-8 h-8 rounded-full gradient-warm flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:block">{userName}</span>
          </div>

          <Link to="/login" className="p-2 rounded-xl hover:bg-muted/50 transition-colors">
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </motion.header>
  );
};

export default Navbar;
