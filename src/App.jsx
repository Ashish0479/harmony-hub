import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import StudentLayout from "./components/StudentLayout";
import AdminLayout from "./components/AdminLayout";
import StudentDashboard from "./pages/StudentDashboard";
import MessMenu from "./pages/MessMenu";
import MessBill from "./pages/MessBill";
import Feedback from "./pages/Feedback";
import Complaints from "./pages/Complaints";
import AdminDashboard from "./pages/AdminDashboard";
import AdminAttendance from "./pages/AdminAttendance";
import AdminBilling from "./pages/AdminBilling";
import StudentRebate from "./pages/StudentRebate";
import AdminRebates from "./pages/AdminRebates";
import Announcements from "./pages/Announcements";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children, role }) => {
  const { isAuthenticated, role: currentRole } = useSelector(
    (state) => state.auth.data,
  );

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (role && currentRole !== role) {
    return (
      <Navigate
        to={currentRole === "ADMIN" ? "/admin" : "/dashboard"}
        replace
      />
    );
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            element={
              <ProtectedRoute role="STUDENT">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/mess-menu" element={<MessMenu />} />
            <Route path="/mess-bill" element={<MessBill />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/rebate" element={<StudentRebate />} />
            <Route path="/announcements" element={<Announcements />} />
          </Route>

          <Route
            element={
              <ProtectedRoute role="ADMIN">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/menu" element={<MessMenu />} />
            <Route path="/admin/attendance" element={<AdminAttendance />} />
            <Route path="/admin/billing" element={<AdminBilling />} />
            <Route path="/admin/complaints" element={<Complaints />} />
            <Route path="/admin/feedback" element={<Feedback />} />
            <Route path="/admin/payments" element={<MessBill />} />
            <Route path="/admin/students" element={<StudentDashboard />} />
            <Route path="/admin/rebates" element={<AdminRebates />} />
            <Route path="/admin/announcements" element={<Announcements />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
