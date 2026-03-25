import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, UtensilsCrossed, Receipt, MessageSquare, AlertTriangle } from "lucide-react";
import Navbar from "./Navbar";

const navItems = [
  { icon: Home, label: "Dashboard", path: "/dashboard" },
  { icon: UtensilsCrossed, label: "Mess Menu", path: "/mess-menu" },
  { icon: Receipt, label: "Mess Bill", path: "/mess-bill" },
  { icon: MessageSquare, label: "Feedback", path: "/feedback" },
  { icon: AlertTriangle, label: "Complaints", path: "/complaints" },
];

const StudentLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar userName="Rahul S." />
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-64 flex-col p-4 pt-6 gap-1 sticky top-16 h-[calc(100vh-4rem)]">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path}>
                <motion.div
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "gradient-warm text-primary-foreground shadow-md"
                      : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </motion.div>
              </Link>
            );
          })}
        </aside>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 pb-24 md:pb-6">
          <Outlet />
        </main>

        {/* Mobile bottom nav */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-card rounded-none border-x-0 border-b-0 z-50">
          <div className="flex justify-around py-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path} className="flex flex-col items-center gap-1 p-2">
                  <item.icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
                  <span className={`text-[10px] font-medium ${isActive ? "text-primary" : "text-muted-foreground"}`}>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
};

export default StudentLayout;
