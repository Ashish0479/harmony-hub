import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Star, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { formatDate } from "@/lib/dateFormat";
import {
  fetchAllFeedbacks,
  fetchStudentFeedbacks,
  submitFeedback,
} from "@/redux/slices/feedbackSlice";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const Feedback = () => {
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth.data);
  const { loading, submitLoading, data, error } = useSelector(
    (state) => state.feedback,
  );

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  useEffect(() => {
    if (role === "ADMIN") {
      dispatch(fetchAllFeedbacks());
      return;
    }

    if (user?.id) {
      dispatch(fetchStudentFeedbacks(user.id));
    }
  }, [dispatch, role, user?.id]);

  const handleSubmit = async () => {
    if (rating === 0) return toast.error("Please select a rating");

    const result = await dispatch(
      submitFeedback({
        suggestion: comment,
        rating,
      }),
    );

    if (submitFeedback.fulfilled.match(result)) {
      toast.success("Thank you for your feedback! 🎉");
      if (user?.id) {
        dispatch(fetchStudentFeedbacks(user.id));
      }
    } else {
      toast.error(result.payload || "Failed to submit feedback");
    }

    setRating(0);
    setComment("");
  };

  const pastFeedback = useMemo(() => {
    return (data.list || []).map((entry) => ({
      date: formatDate(entry.date),
      rating: entry.rating || 0,
      comment: entry.suggestion || entry.message || "No comment",
      studentName: entry.student?.firstName
        ? `${entry.student.firstName} ${entry.student.lastName || ""}`.trim()
        : "Student",
    }));
  }, [data.list]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-3xl"
    >
      <motion.div variants={item} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
          <MessageSquare className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Mess Feedback
          </h1>
          <p className="text-sm text-muted-foreground">
            Help us improve your dining experience
          </p>
        </div>
      </motion.div>

      {role === "STUDENT" ? (
        <motion.div variants={item} className="glass-card p-6">
          <h2 className="font-semibold text-foreground mb-4">
            Rate Today's Mess
          </h2>

          <div className="flex gap-2 mb-6">
            {[1, 2, 3, 4, 5].map((star) => (
              <motion.button
                key={star}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
                onClick={() => setRating(star)}
              >
                <Star
                  className={`h-8 w-8 transition-colors ${
                    star <= (hover || rating)
                      ? "text-secondary fill-secondary"
                      : "text-muted-foreground/30"
                  }`}
                />
              </motion.button>
            ))}
            {rating > 0 && (
              <span className="ml-2 text-sm text-muted-foreground self-center">
                {["", "Poor", "Fair", "Good", "Great", "Excellent"][rating]}
              </span>
            )}
          </div>

          <Textarea
            placeholder="Share your thoughts about the food, service, hygiene..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="rounded-xl bg-muted/40 border-border/50 min-h-[100px] resize-none focus:ring-2 focus:ring-primary/20"
          />

          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4"
          >
            <Button
              disabled={submitLoading}
              onClick={handleSubmit}
              className="gradient-warm text-primary-foreground rounded-xl h-11 px-8 font-semibold shadow-lg border-0"
            >
              <Send className="h-4 w-4 mr-2" />{" "}
              {submitLoading ? "Submitting..." : "Submit Feedback"}
            </Button>
          </motion.div>
        </motion.div>
      ) : null}

      {loading ? (
        <motion.div
          variants={item}
          className="glass-card p-6 text-sm text-muted-foreground"
        >
          Loading feedback...
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
          {role === "ADMIN" ? "All Feedback" : "Previous Feedback"}
        </h2>
        <div className="space-y-3">
          {pastFeedback.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No feedback available
            </p>
          ) : null}
          {pastFeedback.map((fb, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 rounded-xl bg-muted/30"
            >
              <div className="flex gap-0.5 shrink-0 mt-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`h-3 w-3 ${s <= fb.rating ? "text-secondary fill-secondary" : "text-muted-foreground/30"}`}
                  />
                ))}
              </div>
              <div>
                <p className="text-sm text-foreground">{fb.comment}</p>
                {role === "ADMIN" ? (
                  <p className="text-xs text-muted-foreground">
                    {fb.studentName}
                  </p>
                ) : null}
                <span className="text-xs text-muted-foreground">{fb.date}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};
export default Feedback;
