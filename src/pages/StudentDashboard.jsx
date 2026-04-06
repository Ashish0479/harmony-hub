import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  UtensilsCrossed,
  Receipt,
  MessageSquare,
  AlertTriangle,
  Bell,
  TrendingUp,
  CalendarCheck2,
  Megaphone,
} from "lucide-react";
import { Link } from "react-router-dom";
import { fetchTodayMenu } from "@/redux/slices/menuSlice";
import { fetchStudentBills } from "@/redux/slices/billSlice";
import { fetchStudentFeedbacks } from "@/redux/slices/feedbackSlice";
import { fetchMyComplaints } from "@/redux/slices/complaintSlice";
import { fetchAnnouncements } from "@/redux/slices/announcementSlice";
import {
  createStudent,
  deleteStudent,
  fetchStudents,
} from "@/redux/slices/userSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

const quickActions = [
  {
    icon: Receipt,
    label: "View Bill",
    path: "/mess-bill",
    color: "bg-info/10 text-info",
  },
  {
    icon: MessageSquare,
    label: "Feedback",
    path: "/feedback",
    color: "bg-success/10 text-success",
  },
  {
    icon: AlertTriangle,
    label: "Complaint",
    path: "/complaints",
    color: "bg-warning/10 text-warning",
  },
  {
    icon: UtensilsCrossed,
    label: "Menu",
    path: "/mess-menu",
    color: "bg-primary/10 text-primary",
  },
  {
    icon: CalendarCheck2,
    label: "Apply Rebate",
    path: "/rebate",
    color: "bg-info/10 text-info",
  },
  {
    icon: Megaphone,
    label: "Announcements",
    path: "/announcements",
    color: "bg-secondary/20 text-secondary-foreground",
  },
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
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth.data);
  const menuState = useSelector((state) => state.menu);
  const billState = useSelector((state) => state.bill);
  const complaintState = useSelector((state) => state.complaint);
  const feedbackState = useSelector((state) => state.feedback);
  const announcementState = useSelector((state) => state.announcement);
  const userState = useSelector((state) => state.user);
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    room_no: "",
  });

  useEffect(() => {
    if (role === "ADMIN") {
      dispatch(fetchStudents());
      return;
    }

    dispatch(fetchTodayMenu());
    if (!user?.id) return;
    dispatch(fetchStudentBills(user.id));
    dispatch(fetchMyComplaints(user.id));
    dispatch(fetchStudentFeedbacks(user.id));
    dispatch(fetchAnnouncements());
  }, [dispatch, role, user?.id]);

  if (role === "ADMIN") {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="space-y-6 max-w-5xl"
      >
        <motion.div variants={item} className="glass-card p-6">
          <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">
            Students
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage students in your hostel
          </p>
        </motion.div>

        <motion.div variants={item} className="glass-card p-6">
          <h2 className="text-lg font-semibold font-display text-foreground mb-4">
            Create Student
          </h2>
          <div className="grid md:grid-cols-2 gap-3">
            <Input
              placeholder="First name"
              value={newStudent.firstName}
              onChange={(event) =>
                setNewStudent((prev) => ({
                  ...prev,
                  firstName: event.target.value,
                }))
              }
            />
            <Input
              placeholder="Last name"
              value={newStudent.lastName}
              onChange={(event) =>
                setNewStudent((prev) => ({
                  ...prev,
                  lastName: event.target.value,
                }))
              }
            />
            <Input
              placeholder="Email"
              type="email"
              value={newStudent.email}
              onChange={(event) =>
                setNewStudent((prev) => ({
                  ...prev,
                  email: event.target.value,
                }))
              }
            />
            <Input
              placeholder="Password"
              type="password"
              value={newStudent.password}
              onChange={(event) =>
                setNewStudent((prev) => ({
                  ...prev,
                  password: event.target.value,
                }))
              }
            />
            <Input
              placeholder="Room number"
              value={newStudent.room_no}
              onChange={(event) =>
                setNewStudent((prev) => ({
                  ...prev,
                  room_no: event.target.value,
                }))
              }
            />
          </div>
          <Button
            className="mt-4"
            disabled={userState.actionLoading}
            onClick={async () => {
              if (
                !newStudent.firstName ||
                !newStudent.email ||
                !newStudent.password
              ) {
                toast.error("First name, email and password are required");
                return;
              }

              const result = await dispatch(createStudent(newStudent));
              if (createStudent.fulfilled.match(result)) {
                toast.success("Student created");
                setNewStudent({
                  firstName: "",
                  lastName: "",
                  email: "",
                  password: "",
                  room_no: "",
                });
                dispatch(fetchStudents());
                return;
              }

              toast.error(result.payload || "Failed to create student");
            }}
          >
            {userState.actionLoading ? "Creating..." : "Create Student"}
          </Button>
        </motion.div>

        <motion.div variants={item} className="glass-card p-6">
          <h2 className="text-lg font-semibold font-display text-foreground mb-4">
            Student List
          </h2>
          {userState.loading ? (
            <p className="text-sm text-muted-foreground">Loading students...</p>
          ) : null}
          {userState.error ? (
            <p className="text-sm text-destructive">{userState.error}</p>
          ) : null}
          <div className="space-y-3">
            {(userState.data.students || []).map((student) => (
              <div
                key={student._id}
                className="bg-muted/40 rounded-xl p-4 flex items-center justify-between gap-3"
              >
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {student.firstName} {student.lastName}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {student.email}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Room: {student.room_no || "-"}
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={async () => {
                    const result = await dispatch(deleteStudent(student._id));
                    if (deleteStudent.fulfilled.match(result)) {
                      toast.success("Student removed");
                      dispatch(fetchStudents());
                    } else {
                      toast.error(result.payload || "Delete failed");
                    }
                  }}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const todayMenu = menuState.data.todayMenu || {};
  const pendingBill = (billState.data.bills || []).find((bill) => !bill.isPaid);
  const notifications = useMemo(() => {
    const list = [];
    if (pendingBill) {
      list.push({
        text: `Mess bill ${pendingBill.month}/${pendingBill.year} is pending`,
        time: "now",
      });
    }
    if ((complaintState.data || []).length > 0) {
      list.push({
        text: "Your complaint has been received by admin",
        time: "recent",
      });
    }
    if (todayMenu?.breakfast || todayMenu?.lunch || todayMenu?.dinner) {
      list.push({ text: "Today's menu has been updated", time: "today" });
    }
    return list;
  }, [pendingBill, complaintState.data, todayMenu]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-5xl"
    >
      {/* Welcome */}
      <motion.div
        variants={item}
        className="glass-card p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 gradient-warm opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />
        <h1 className="text-2xl md:text-3xl font-bold font-display text-foreground">
          Good Morning,{" "}
          <span className="gradient-warm-text">
            {user?.firstName || "Student"}!
          </span>{" "}
          👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening today at your hostel
        </p>
      </motion.div>

      {/* Today's Menu */}
      <motion.div variants={item} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg gradient-warm flex items-center justify-center">
            <UtensilsCrossed className="h-4 w-4 text-primary-foreground" />
          </div>
          <h2 className="text-lg font-semibold font-display text-foreground">
            Today's Menu
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(todayMenu).length === 0 ? (
            <p className="text-sm text-muted-foreground col-span-4">
              Menu not available
            </p>
          ) : null}
          {Object.entries(todayMenu).map(([meal, items]) => (
            <div key={meal} className="bg-muted/40 rounded-xl p-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {meal}
              </span>
              <p className="text-sm text-foreground mt-2 leading-relaxed">
                {items}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.div variants={item} className="glass-card p-6">
          <h2 className="text-lg font-semibold font-display text-foreground mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <Link key={action.path} to={action.path}>
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color}`}
                  >
                    <action.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {action.label}
                  </span>
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Notifications */}
        <motion.div variants={item} className="glass-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold font-display text-foreground">
              Notifications
            </h2>
          </div>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No notifications yet
              </p>
            ) : null}
            {notifications.map((n, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-muted/30"
              >
                <div className="w-2 h-2 rounded-full gradient-warm mt-2 shrink-0" />
                <div>
                  <p className="text-sm text-foreground">{n.text}</p>
                  <span className="text-xs text-muted-foreground">
                    {n.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Stats */}
      <motion.div variants={item} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Megaphone className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold font-display text-foreground">
            Latest Announcements
          </h2>
        </div>
        <div className="space-y-3">
          {(announcementState.data.list || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No announcements yet
            </p>
          ) : null}
          {(announcementState.data.list || []).slice(0, 3).map((entry) => (
            <div key={entry._id} className="bg-muted/30 rounded-xl p-3">
              <p className="text-sm font-semibold text-foreground">
                {entry.title}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {entry.message}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div variants={item} className="glass-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold font-display text-foreground">
            Your Stats
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[
            {
              label: "Pending Bills",
              value: pendingBill
                ? `₹${Number(pendingBill.grandTotal || 0).toLocaleString()}`
                : "₹0",
              color: "text-destructive",
            },
            {
              label: "Complaints",
              value: `${(complaintState.data || []).length} Open`,
              color: "text-warning",
            },
            {
              label: "Feedback Given",
              value: `${(feedbackState.data.list || []).length}`,
              color: "text-success",
            },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-4 rounded-xl bg-muted/30"
            >
              <p className={`text-xl font-bold font-display ${stat.color}`}>
                {stat.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
export default StudentDashboard;
