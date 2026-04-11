import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const navItems = [
  { title: "Dashboard", route: "/admin" },
  { title: "Students", route: "/admin/students" },
  { title: "Attendance", route: "/admin/attendance" },
  { title: "Billing", route: "/admin/billing" },
  { title: "Menu", route: "/admin/menu" },
  { title: "Complaints", route: "/admin/complaints" },
  { title: "Announcements", route: "/admin/announcements" },
];

const AdminLayout = () => {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar navItems={navItems} />
      <main className="p-3 sm:p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};
export default AdminLayout;
