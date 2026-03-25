import { motion } from "framer-motion";
import { LayoutDashboard, AlertTriangle, MessageSquare, Receipt, Users, Star, TrendingUp, CheckCircle2, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const stats = [
  { label: "Total Students", value: "342", icon: Users, color: "bg-info/10 text-info" },
  { label: "Open Complaints", value: "18", icon: AlertTriangle, color: "bg-warning/10 text-warning" },
  { label: "Avg Rating", value: "4.2", icon: Star, color: "bg-secondary/20 text-secondary-foreground" },
  { label: "Payments Due", value: "₹84K", icon: Receipt, color: "bg-destructive/10 text-destructive" },
];

const feedbackData = [
  { day: "Mon", rating: 4.1 },
  { day: "Tue", rating: 3.8 },
  { day: "Wed", rating: 4.5 },
  { day: "Thu", rating: 4.0 },
  { day: "Fri", rating: 4.8 },
  { day: "Sat", rating: 4.3 },
  { day: "Sun", rating: 4.6 },
];

const complaintData = [
  { name: "Room", value: 8, color: "hsl(28, 100%, 54%)" },
  { name: "Water", value: 4, color: "hsl(45, 100%, 51%)" },
  { name: "Wi-Fi", value: 3, color: "hsl(217, 91%, 60%)" },
  { name: "Other", value: 3, color: "hsl(142, 71%, 45%)" },
];

const recentComplaints = [
  { id: "#1025", student: "Ankit P.", issue: "Fan not working", status: "pending" },
  { id: "#1024", student: "Priya M.", issue: "Water leaking", status: "resolved" },
  { id: "#1023", student: "Rahul S.", issue: "AC issue", status: "pending" },
  { id: "#1022", student: "Sneha K.", issue: "Wi-Fi down", status: "in-progress" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const AdminDashboard = () => {
  const statusStyles = {
    resolved: "text-success bg-success/10",
    pending: "text-warning bg-warning/10",
    "in-progress": "text-info bg-info/10",
  };

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-6xl">
      <motion.div variants={item}>
        <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">
          Admin <span className="gradient-warm-text">Dashboard</span>
        </h1>
        <p className="text-muted-foreground text-sm">Overview of hostel operations</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <motion.div key={stat.label} variants={item} className="glass-card p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${stat.color}`}>
              <stat.icon className="h-5 w-5" />
            </div>
            <p className="text-2xl font-bold font-display text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Feedback Chart */}
        <motion.div variants={item} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-semibold font-display text-foreground">Weekly Ratings</h2>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={feedbackData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} fontSize={12} />
              <YAxis domain={[0, 5]} axisLine={false} tickLine={false} fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
              />
              <Bar dataKey="rating" fill="url(#warmGradient)" radius={[6, 6, 0, 0]} />
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
            <h2 className="font-semibold font-display text-foreground">Complaints by Category</h2>
          </div>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={150} height={150}>
              <PieChart>
                <Pie data={complaintData} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" strokeWidth={0}>
                  {complaintData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {complaintData.map((c) => (
                <div key={c.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-sm text-foreground">{c.name}</span>
                  <span className="text-sm font-semibold text-foreground ml-auto">{c.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Recent Complaints Table */}
      <motion.div variants={item} className="glass-card p-6">
        <h2 className="font-semibold font-display text-foreground mb-4">Recent Complaints</h2>
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
              {recentComplaints.map((c) => (
                <tr key={c.id} className="border-b border-border/30 last:border-0">
                  <td className="py-3 text-sm font-mono text-muted-foreground">{c.id}</td>
                  <td className="py-3 text-sm text-foreground">{c.student}</td>
                  <td className="py-3 text-sm text-foreground">{c.issue}</td>
                  <td className="py-3 text-right">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[c.status as keyof typeof statusStyles]}`}>
                      {c.status === "resolved" ? <CheckCircle2 className="h-3 w-3" /> : <Clock className="h-3 w-3" />}
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
