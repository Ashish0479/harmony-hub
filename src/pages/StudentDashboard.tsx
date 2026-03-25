import { motion } from "framer-motion";
import { UtensilsCrossed, Receipt, MessageSquare, AlertTriangle, Bell, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const todayMenu = {
  breakfast: "Poha, Bread Butter, Tea/Coffee",
  lunch: "Dal Tadka, Jeera Rice, Roti, Salad",
  snacks: "Samosa, Chai",
  dinner: "Paneer Butter Masala, Rice, Roti, Gulab Jamun",
};

const quickActions = [
  { icon: Receipt, label: "View Bill", path: "/mess-bill", color: "bg-info/10 text-info" },
  { icon: MessageSquare, label: "Feedback", path: "/feedback", color: "bg-success/10 text-success" },
  { icon: AlertTriangle, label: "Complaint", path: "/complaints", color: "bg-warning/10 text-warning" },
  { icon: UtensilsCrossed, label: "Menu", path: "/mess-menu", color: "bg-primary/10 text-primary" },
];

const notifications = [
  { text: "Mess bill for March has been generated", time: "2h ago" },
  { text: "Your complaint #1024 has been resolved", time: "5h ago" },
  { text: "Tomorrow's special: Biryani 🎉", time: "1d ago" },
];

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

const StudentDashboard = () => {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      {/* Welcome */}
      <motion.div variants={item} className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 gradient-warm opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">
          Good Morning, <span className="gradient-warm-text">Rahul!</span> 👋
        </h1>
        <p className="text-muted-foreground mt-1">Here's what's happening today at your hostel</p>
      </motion.div>

      {/* Today's Menu */}
      <motion.div variants={item} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg gradient-warm flex items-center justify-center">
            <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
          </div>
          <h2 className="text-lg font-semibold font-display text-foreground">Today's Menu</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(todayMenu).map(([meal, items]) => (
            <div key={meal} className="bg-muted/40 rounded-xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">{meal}</span>
              <p className="text-sm text-foreground mt-2 leading-relaxed">{items}</p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div variants={item} className="glass-card p-6">
          <h2 className="text-lg font-semibold font-display text-foreground mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link key={action.path} to={action.path}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}>
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{action.label}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={item} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold font-display text-foreground">Notifications</h2>
          </div>
          <div className="space-y-3">
            {notifications.map((n, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                <div className="w-2 h-2 rounded-full gradient-warm mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-foreground">{n.text}</p>
                  <span className="text-xs text-muted-foreground">{n.time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div variants={item} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold font-display text-foreground">Your Stats</h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Pending Bills", value: "₹2,450", color: "text-destructive" },
            { label: "Complaints", value: "1 Open", color: "text-warning" },
            { label: "Feedback Given", value: "12", color: "text-success" },
          ].map((stat) => (
            <div key={stat.label} className="text-center p-4 rounded-xl bg-muted/30">
              <p className={`text-xl font-bold font-display ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudentDashboard;
