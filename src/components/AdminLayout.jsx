import { useEffect, useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  UtensilsCrossed,
  CalendarCheck2,
  Calculator,
  AlertTriangle,
  MessageSquare,
  Users,
  Receipt,
  CalendarRange,
  Megaphone,
} from "lucide-react";
import Navbar from "./Navbar";
import MobileSidebar from "./MobileSidebar";
const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/admin" },
  { icon: UtensilsCrossed, label: "Menu Mgmt", path: "/admin/menu" },
  { icon: CalendarCheck2, label: "Attendance", path: "/admin/attendance" },
  { icon: Calculator, label: "Monthly Bill", path: "/admin/billing" },
  { icon: AlertTriangle, label: "Complaints", path: "/admin/complaints" },
  { icon: MessageSquare, label: "Feedback", path: "/admin/feedback" },
  { icon: Receipt, label: "Payments", path: "/admin/payments" },
  { icon: CalendarRange, label: "Rebates", path: "/admin/rebates" },
  {
    icon: Megaphone,
    label: "Announcements",
    path: "/admin/announcements",
  },
  { icon: Users, label: "Students", path: "/admin/students" },
];
const AdminLayout = () => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.data.user);
  const userName = user?.firstName || "Admin";
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen gradient-bg">
      <Navbar userName={userName} onMenuClick={() => setIsSidebarOpen(true)} />
      <MobileSidebar
        isOpen={isSidebarOpen}
        navItems={navItems}
        locationPath={location.pathname}
        onClose={() => setIsSidebarOpen(false)}
      />
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

        <main className="flex-1 p-3 sm:p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
export default AdminLayout;
