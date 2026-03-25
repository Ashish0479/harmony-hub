import { useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = () => {
    if (rating === 0) return toast.error("Please select a rating");
    toast.success("Thank you for your feedback! 🎉");
    setRating(0);
    setComment("");
  };

  const pastFeedback = [
    { date: "Mar 20", rating: 4, comment: "Food quality was good today" },
    { date: "Mar 15", rating: 3, comment: "Lunch was a bit cold" },
    { date: "Mar 10", rating: 5, comment: "Loved the Sunday special!" },
  ];

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-3xl">
      <motion.div variants={item} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
          <MessageSquare className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Mess Feedback</h1>
          <p className="text-sm text-muted-foreground">Help us improve your dining experience</p>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Rate Today's Mess</h2>

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

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-4">
          <Button onClick={handleSubmit} className="gradient-warm text-primary-foreground rounded-xl h-11 px-8 font-semibold shadow-lg border-0">
            <Send className="h-4 w-4 mr-2" /> Submit Feedback
          </Button>
        </motion.div>
      </motion.div>

      <motion.div variants={item} className="glass-card p-6">
        <h2 className="font-semibold text-foreground mb-4">Previous Feedback</h2>
        <div className="space-y-3">
          {pastFeedback.map((fb, i) => (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
              <div className="flex gap-0.5 shrink-0 mt-0.5">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`h-3 w-3 ${s <= fb.rating ? "text-secondary fill-secondary" : "text-muted-foreground/30"}`} />
                ))}
              </div>
              <div>
                <p className="text-sm text-foreground">{fb.comment}</p>
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
