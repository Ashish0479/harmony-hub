import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

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

          {/* Student routes */}
          <Route element={<StudentLayout />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/mess-menu" element={<MessMenu />} />
            <Route path="/mess-bill" element={<MessBill />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/complaints" element={<Complaints />} />
          </Route>

          {/* Admin routes */}
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/menu" element={<MessMenu />} />
            <Route path="/admin/complaints" element={<Complaints />} />
            <Route path="/admin/feedback" element={<Feedback />} />
            <Route path="/admin/payments" element={<MessBill />} />
            <Route path="/admin/students" element={<StudentDashboard />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
