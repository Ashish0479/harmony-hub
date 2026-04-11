import { Link, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { X } from "lucide-react";
import { motion } from "framer-motion";
import { logoutUser } from "@/redux/slices/authSlice";
import NavItem from "@/components/NavItem";

const Navbar = ({ navItems = [] }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");
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
      <div className="px-3 sm:px-4 md:px-6 py-2">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto flex-1 min-w-0 py-0.5">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.route ||
                (item.route !== homePath &&
                  location.pathname.startsWith(item.route));

              return (
                <NavItem
                  key={item.route}
                  title={item.title}
                  route={item.route}
                  isActive={isActive}
                />
              );
            })}
          </div>

          <Link
            to="/login"
            onClick={handleLogout}
            className="shrink-0 inline-flex items-center justify-center rounded-md border border-border bg-background p-2 text-muted-foreground transition hover:bg-red-100 hover:text-red-500 hover:scale-110"
            aria-label="Log out"
            title="Logout"
          >
            <X className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </motion.header>
  );
};
export default Navbar;
