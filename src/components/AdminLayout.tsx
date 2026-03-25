import { Outlet, Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { LayoutDashboard, UtensilsCrossed, AlertTriangle, MessageSquare, Users, Receipt } from "lucide-react";
import Navbar from "./Navbar";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin" },
  { icon: UtensilsCrossed, label: "Menu Mgmt", path: "/admin/menu" },
  { icon: AlertTriangle, label: "Complaints", path: "/admin/complaints" },
  { icon: MessageSquare, label: "Feedback", path: "/admin/feedback" },
  { icon: Receipt, label: "Payments", path: "/admin/payments" },
  { icon: Users, label: "Students", path: "/admin/students" },
];

const AdminLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar userName="Admin" />
      <div className="flex">
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

        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
