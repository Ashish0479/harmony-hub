import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  AlertTriangle,
  MessageSquare,
  Receipt,
  Users,
  Star,
  TrendingUp,
  CheckCircle2,
  Clock,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { fetchStudents } from "@/redux/slices/userSlice";
import { fetchAllFeedbacks } from "@/redux/slices/feedbackSlice";
import { fetchAllComplaints } from "@/redux/slices/complaintSlice";
import { fetchBillsForStudents } from "@/redux/slices/billSlice";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const students = useSelector((state) => state.user.data.students) || [];
  const feedbacks = useSelector((state) => state.feedback.data.list) || [];
  const complaints = useSelector((state) => state.complaint.data) || [];
  const adminBills = useSelector((state) => state.bill.data.adminBills) || [];

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchAllFeedbacks());
    dispatch(fetchAllComplaints());
  }, [dispatch]);

  useEffect(() => {
    if (students.length > 0) {
      dispatch(fetchBillsForStudents(students.map((student) => student._id)));
    }
  }, [dispatch, students]);

  const avgRating = useMemo(() => {
    const validRatings = feedbacks.filter(
      (item) => typeof item.rating === "number",
    );
    if (validRatings.length === 0) return "0.0";
    const sum = validRatings.reduce((total, item) => total + item.rating, 0);
    return (sum / validRatings.length).toFixed(1);
  }, [feedbacks]);

  const paymentsDue = useMemo(() => {
    const dueAmount = adminBills
      .filter((bill) => !bill.isPaid)
      .reduce((total, bill) => total + Number(bill.grandTotal || 0), 0);
    return dueAmount;
  }, [adminBills]);

  const stats = [
    {
      label: "Total Students",
      value: String(students.length),
      icon: Users,
      color: "bg-info/10 text-info",
    },
    {
      label: "Open Complaints",
      value: String(complaints.length),
      icon: AlertTriangle,
      color: "bg-warning/10 text-warning",
    },
    {
      label: "Avg Rating",
      value: avgRating,
      icon: Star,
      color: "bg-secondary/20 text-secondary-foreground",
    },
    {
      label: "Payments Due",
      value: `₹${paymentsDue.toLocaleString()}`,
      icon: Receipt,
      color: "bg-destructive/10 text-destructive",
    },
  ];

  const feedbackData = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
    (day, index) => {
      const dayRatings = feedbacks
        .filter((entry) => {
          if (!entry.date || typeof entry.rating !== "number") return false;
          return new Date(entry.date).getDay() === index;
        })
        .map((entry) => entry.rating);

      const rating = dayRatings.length
        ? dayRatings.reduce((sum, value) => sum + value, 0) / dayRatings.length
        : 0;

      return { day, rating: Number(rating.toFixed(1)) };
    },
  );

  const complaintMap = complaints.reduce((acc, complaint) => {
    const raw = complaint.complaint || "Other";
    const parts = raw.split(" | ");
    const category = parts[1] || "Other";
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {});

  const palette = [
    "hsl(28, 100%, 54%)",
    "hsl(45, 100%, 51%)",
    "hsl(217, 91%, 60%)",
    "hsl(142, 71%, 45%)",
    "hsl(0, 84%, 60%)",
  ];

  const complaintData = Object.keys(complaintMap).map((name, index) => ({
    name,
    value: complaintMap[name],
    color: palette[index % palette.length],
  }));

  const recentComplaints = complaints.slice(0, 6).map((complaint, index) => {
    const raw = complaint.complaint || "Complaint";
    const parts = raw.split(" | ");
    return {
      id: `#${String(index + 1).padStart(4, "0")}`,
      student: complaint.student?.firstName
        ? `${complaint.student.firstName} ${complaint.student.lastName || ""}`.trim()
        : "Student",
      issue: parts[0] || raw,
      status: "pending",
    };
  });

  const statusStyles = {
    resolved: "text-success bg-success/10",
    pending: "text-warning bg-warning/10",
    "in-progress": "text-info bg-info/10",
  };
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-6xl"
    >
      <motion.div variants={item}>
        <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">
          Admin <span className="gradient-warm-text">Dashboard</span>
        </h1>
        <p className="text-muted-foreground text-sm">
          Overview of hostel operations
        </p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={item}
            className="glass-card p-5"
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}
            >
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold font-display text-foreground">
              {stat.value}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Feedback Chart */}
        <motion.div variants={item} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-semibold font-display text-foreground">
              Weekly Ratings
            </h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={feedbackData}>
              <XAxis
                dataKey="day"
                axisLine={false}
                tickLine={false}
                fontSize={12}
              />
              <YAxis
                domain={[0, 5]}
                axisLine={false}
                tickLine={false}
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Bar
                dataKey="rating"
                fill="url(#warmGradient)"
                radius={[6, 6, 0, 0]}
              />
              <defs>
                <linearGradient id="warmGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(28, 100%, 54%)" />
                  <stop offset="100%" stopColor="hsl(45, 100%, 51%)" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Complaint Breakdown */}
        <motion.div variants={item} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-primary" />
            <h2 className="font-semibold font-display text-foreground">
              Complaints by Category
            </h2>
          </div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie
                  data={complaintData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {complaintData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {complaintData.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-sm text-foreground">{c.name}</span>
                  <span className="text-sm font-semibold text-foreground ml-auto">
                    {c.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Complaints Table */}
      <motion.div variants={item} className="glass-card p-6">
        <h2 className="font-semibold font-display text-foreground mb-4">
          Recent Complaints
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border/50">
                <th className="pb-3 font-medium">ID</th>
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Issue</th>
                <th className="pb-3 font-medium text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentComplaints.length === 0 ? (
                <tr>
                  <td
                    className="py-3 text-sm text-muted-foreground"
                    colSpan={4}
                  >
                    No complaints available
                  </td>
                </tr>
              ) : null}
              {recentComplaints.map((c) => (
                <tr
                  key={c.id}
                  className="border-b border-border/30 last:border-0"
                >
                  <td className="py-3 text-sm font-mono text-muted-foreground">
                    {c.id}
                  </td>
                  <td className="py-3 text-sm text-foreground">{c.student}</td>
                  <td className="py-3 text-sm text-foreground">{c.issue}</td>
                  <td className="py-3 text-right">
                    <span
                      className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[c.status]}`}
                    >
                      {c.status === "resolved" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : (
                        <Clock className="h-3 w-3" />
                      )}
                      {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
};
export default AdminDashboard;
