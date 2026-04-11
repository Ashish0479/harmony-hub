import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const navItems = [
  { title: "Dashboard", route: "/dashboard" },
  { title: "Menu", route: "/mess-menu" },
  { title: "Billing", route: "/mess-bill" },
  { title: "Complaints", route: "/complaints" },
  { title: "Notifications", route: "/announcements" },
  { title: "Profile", route: "/profile" },
];

const StudentLayout = () => {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar navItems={navItems} />
      <main className="p-3 sm:p-4 md:p-6">
        <Outlet />
      </main>
    </div>
  );
};
export default StudentLayout;
