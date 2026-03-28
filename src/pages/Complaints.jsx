import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  Send,
  CheckCircle2,
  Clock,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  fetchAllComplaints,
  fetchMyComplaints,
  submitComplaint,
} from "@/redux/slices/complaintSlice";

const categories = [
  "Room Issue",
  "Electricity",
  "Water Supply",
  "Wi-Fi",
  "Cleaning",
  "Other",
];
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const Complaints = () => {
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth.data);
  const { loading, submitLoading, data, error } = useSelector(
    (state) => state.complaint,
  );

  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (role === "ADMIN") {
      dispatch(fetchAllComplaints());
      return;
    }

    if (user?.id) {
      dispatch(fetchMyComplaints(user.id));
    }
  }, [dispatch, role, user?.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category || !title.trim() || !description.trim()) {
      toast.error("Category, title and description are required");
      return;
    }

    const result = await dispatch(
      submitComplaint({
        category,
        title: title.trim(),
        description: description.trim(),
      }),
    );

    if (submitComplaint.fulfilled.match(result)) {
      toast.success("Complaint submitted successfully!");
      setCategory("");
      setTitle("");
      setDescription("");
      if (user?.id) {
        dispatch(fetchMyComplaints(user.id));
      }
      return;
    }

    toast.error(result.payload || "Failed to submit complaint");
  };

  const existingComplaints = useMemo(
    () =>
      (data || []).map((entry, index) => {
        const complaint = entry.complaint || "";
        const [titlePart, categoryPart] = complaint.split(" | ");

        return {
          id: `#${String(index + 1).padStart(4, "0")}`,
          title: titlePart || complaint || "Complaint",
          category: categoryPart || "Other",
          status: "pending",
          date: entry.date ? new Date(entry.date).toLocaleDateString() : "-",
          studentName: entry.student?.firstName
            ? `${entry.student.firstName} ${entry.student.lastName || ""}`.trim()
            : "Student",
        };
      }),
    [data],
  );

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
      className="space-y-6 max-w-3xl"
    >
      <motion.div variants={item} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
          <AlertTriangle className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Raise a Complaint
          </h1>
          <p className="text-sm text-muted-foreground">
            We'll resolve it as soon as possible
          </p>
        </div>
      </motion.div>

      {role === "STUDENT" ? (
        <motion.div variants={item} className="glass-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Category dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowDropdown(!showDropdown)}
                className="w-full h-12 rounded-xl bg-muted/50 border border-border/50 px-4 text-left text-sm flex items-center justify-between transition-all hover:border-primary/30"
              >
                <span
                  className={
                    category ? "text-foreground" : "text-muted-foreground"
                  }
                >
                  {category || "Select Category"}
                </span>
                <ChevronDown
                  className={`h-4 w-4 text-muted-foreground transition-transform ${showDropdown ? "rotate-180" : ""}`}
                />
              </button>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-14 left-0 right-0 glass-card p-2 z-10 shadow-elevated"
                >
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setCategory(cat);
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-sm text-foreground hover:bg-muted/50 transition-colors"
                    >
                      {cat}
                    </button>
                  ))}
                </motion.div>
              )}
            </div>

            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Brief title of the issue"
              className="h-12 rounded-xl bg-muted/50 border-border/50 focus:ring-2 focus:ring-primary/20"
            />
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue in detail..."
              className="rounded-xl bg-muted/40 border-border/50 min-h-[100px] resize-none focus:ring-2 focus:ring-primary/20"
            />

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                disabled={submitLoading}
                type="submit"
                className="gradient-warm text-primary-foreground rounded-xl h-11 px-8 font-semibold shadow-lg border-0"
              >
                <Send className="h-4 w-4 mr-2" />{" "}
                {submitLoading ? "Submitting..." : "Submit Complaint"}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      ) : null}

      {loading ? (
        <motion.div
          variants={item}
          className="glass-card p-6 text-sm text-muted-foreground"
        >
          Loading complaints...
        </motion.div>
      ) : null}
      {error ? (
        <motion.div
          variants={item}
          className="glass-card p-6 text-sm text-destructive"
        >
          {error}
        </motion.div>
      ) : null}

      <motion.div variants={item} className="glass-card p-6">
        <h2 className="font-semibold text-foreground mb-4">
          {role === "ADMIN" ? "All Complaints" : "Your Complaints"}
        </h2>
        <div className="space-y-3">
          {existingComplaints.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No complaints available
            </p>
          ) : null}
          {existingComplaints.map((c) => (
            <div
              key={c.id}
              className="flex items-center justify-between p-4 rounded-xl bg-muted/30"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground font-mono">
                    {c.id}
                  </span>
                  <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                    {c.category}
                  </span>
                </div>
                <p className="text-sm font-medium text-foreground mt-1">
                  {c.title}
                </p>
                {role === "ADMIN" ? (
                  <p className="text-xs text-muted-foreground">
                    {c.studentName}
                  </p>
                ) : null}
                <span className="text-xs text-muted-foreground">{c.date}</span>
              </div>
              <span
                className={`flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full ${statusStyles[c.status]}`}
              >
                {c.status === "resolved" ? (
                  <CheckCircle2 className="h-3 w-3" />
                ) : (
                  <Clock className="h-3 w-3" />
                )}
                {c.status.charAt(0).toUpperCase() + c.status.slice(1)}
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
export default Complaints;
