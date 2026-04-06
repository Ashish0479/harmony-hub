import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CalendarCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { applyRebate, fetchStudentRebates } from "@/redux/slices/rebateSlice";
import { formatDate, formatInputDateValue } from "@/lib/dateFormat";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const StudentRebate = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.data.user);
  const rebateState = useSelector((state) => state.rebate);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  useEffect(() => {
    if (!user?.id) return;
    dispatch(fetchStudentRebates(user.id));
  }, [dispatch, user?.id]);

  const onApply = async () => {
    if (!fromDate || !toDate) {
      toast.error("Please select from and to dates");
      return;
    }

    const result = await dispatch(applyRebate({ fromDate, toDate }));

    if (applyRebate.fulfilled.match(result)) {
      toast.success("Rebate applied successfully");
      setFromDate("");
      setToDate("");
      if (user?.id) {
        dispatch(fetchStudentRebates(user.id));
      }
      return;
    }

    toast.error(result.payload || "Unable to apply rebate");
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-4xl"
    >
      <motion.div variants={item} className="glass-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
            <CalendarCheck2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">
              Apply Rebate
            </h1>
            <p className="text-sm text-muted-foreground">
              Submit mess leave for future dates only
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-card p-6 space-y-4">
        <h2 className="text-lg font-semibold font-display text-foreground">
          Rebate Request
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          <Input
            type="date"
            value={fromDate}
            onChange={(event) => setFromDate(event.target.value)}
          />
          <Input
            type="date"
            value={toDate}
            onChange={(event) => setToDate(event.target.value)}
          />
        </div>
        <p className="text-xs text-muted-foreground">
          Selected: {formatInputDateValue(fromDate)} to{" "}
          {formatInputDateValue(toDate)}
        </p>
        <Button
          onClick={onApply}
          disabled={rebateState.actionLoading}
          className="gradient-warm text-primary-foreground border-0"
        >
          {rebateState.actionLoading ? "Applying..." : "Apply Rebate"}
        </Button>
        <p className="text-xs text-muted-foreground">
          Rules: apply at least 1 day in advance, max 5 rebate days per month,
          and no overlapping date ranges.
        </p>
      </motion.div>

      <motion.div variants={item} className="glass-card p-6">
        <h2 className="text-lg font-semibold font-display text-foreground mb-4">
          Your Rebate History
        </h2>
        {rebateState.loading ? (
          <p className="text-sm text-muted-foreground">Loading rebates...</p>
        ) : null}
        {rebateState.error ? (
          <p className="text-sm text-destructive">{rebateState.error}</p>
        ) : null}
        <div className="space-y-3">
          {(rebateState.data.studentRebates || []).length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No rebates applied yet
            </p>
          ) : null}
          {(rebateState.data.studentRebates || []).map((rebate) => (
            <div
              key={rebate._id}
              className="bg-muted/30 rounded-xl p-4 flex items-center justify-between gap-3"
            >
              <div>
                <p className="text-sm font-semibold text-foreground">
                  {formatDate(rebate.fromDate)} to {formatDate(rebate.toDate)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Applied: {formatDate(rebate.createdAt)}
                </p>
              </div>
              <span className="text-sm font-semibold text-primary">
                {rebate.totalDays} day(s)
              </span>
            </div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default StudentRebate;
