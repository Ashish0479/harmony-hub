import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { CalendarCheck2 } from "lucide-react";
import { fetchAllRebates } from "@/redux/slices/rebateSlice";
import { formatDate } from "@/lib/dateFormat";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const AdminRebates = () => {
  const dispatch = useDispatch();
  const rebateState = useSelector((state) => state.rebate);

  useEffect(() => {
    dispatch(fetchAllRebates());
  }, [dispatch]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-6xl"
    >
      <motion.div variants={item} className="glass-card p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
            <CalendarCheck2 className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">
              Rebate Requests
            </h1>
            <p className="text-sm text-muted-foreground">
              All student rebate applications
            </p>
          </div>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-card p-6">
        {rebateState.loading ? (
          <p className="text-sm text-muted-foreground">Loading rebates...</p>
        ) : null}
        {rebateState.error ? (
          <p className="text-sm text-destructive">{rebateState.error}</p>
        ) : null}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border/50">
                <th className="pb-3 font-medium">Student</th>
                <th className="pb-3 font-medium">Email</th>
                <th className="pb-3 font-medium">Room</th>
                <th className="pb-3 font-medium">Range</th>
                <th className="pb-3 font-medium">Days</th>
                <th className="pb-3 font-medium">Applied On</th>
              </tr>
            </thead>
            <tbody>
              {(rebateState.data.allRebates || []).length === 0 ? (
                <tr>
                  <td
                    className="py-3 text-sm text-muted-foreground"
                    colSpan={6}
                  >
                    No rebates found
                  </td>
                </tr>
              ) : null}
              {(rebateState.data.allRebates || []).map((rebate) => (
                <tr
                  key={rebate._id}
                  className="border-b border-border/30 last:border-0"
                >
                  <td className="py-3 text-sm text-foreground">
                    {rebate.studentId?.firstName || "-"}{" "}
                    {rebate.studentId?.lastName || ""}
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    {rebate.studentId?.email || "-"}
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    {rebate.studentId?.room_no || "-"}
                  </td>
                  <td className="py-3 text-sm text-foreground">
                    {formatDate(rebate.fromDate)} to {formatDate(rebate.toDate)}
                  </td>
                  <td className="py-3 text-sm text-foreground">
                    {rebate.totalDays}
                  </td>
                  <td className="py-3 text-sm text-muted-foreground">
                    {formatDate(rebate.createdAt)}
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

export default AdminRebates;
