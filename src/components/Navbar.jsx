import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Bell, User, LogOut, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { logoutUser } from "@/redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const Navbar = ({ userName = "Student", onMenuClick }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
  const navigate = useNavigate();
  const homePath = isAdmin ? "/admin" : "/dashboard";

  const handleLogout = async () => {
    await dispatch(logoutUser());
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-50 glass-card rounded-none border-x-0 border-t-0"
    >
      <div className="flex items-center justify-between px-3 sm:px-4 md:px-6 h-16">
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-xl hover:bg-muted/50 transition-colors"
            aria-label="Open sidebar menu"
          >
            <Menu className="h-5 w-5 text-muted-foreground" />
          </button>

          <Link to={homePath} className="flex items-center gap-2">
            <span className="text-xl font-bold font-display gradient-warm-text">
              HostelHub
            </span>
          </Link>
        </div>

        <div className="flex items-center gap-1 sm:gap-2 md:gap-3">
          <button className="relative p-2 rounded-xl hover:bg-muted/50 transition-colors">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full gradient-warm" />
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-border">
            <div className="w-8 h-8 rounded-full gradient-warm flex items-center justify-center">
              <User className="h-4 w-4 text-primary-foreground hover:bg-muted/50 transition-colors" onClick={() => navigate('/profile')} />
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:block">
              {userName}
            </span>
          </div>

          <Link
            to="/login"
            onClick={handleLogout}
            className="p-2 rounded-xl hover:bg-muted/50 transition-colors"
          >
            <LogOut className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </motion.header>
  );
};
export default Navbar;
