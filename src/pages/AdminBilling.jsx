import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { FileText, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getMonthlyBill } from "@/redux/slices/billingSlice";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.08 } },
};
const item = { hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } };

const AdminBilling = () => {
  const dispatch = useDispatch();
  const billingState = useSelector((state) => state.billing);

  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  const billRows = billingState.data.bills || [];

  const grandTotal = useMemo(
    () => billRows.reduce((sum, row) => sum + Number(row.totalAmount || 0), 0),
    [billRows],
  );

  const handleGenerate = () => {
    dispatch(getMonthlyBill({ month: Number(month), year: Number(year) }));
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-7xl w-full"
    >
      <motion.div variants={item} className="glass-card p-4 sm:p-5 md:p-6">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold font-display text-foreground">
              Monthly Billing
            </h1>
            <p className="text-sm text-muted-foreground">
              Generate student-wise monthly bills from attendance.
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <Input
              type="number"
              min={1}
              max={12}
              value={month}
              onChange={(event) => setMonth(event.target.value)}
              className="w-full sm:w-24"
            />
            <Input
              type="number"
              min={2000}
              max={2100}
              value={year}
              onChange={(event) => setYear(event.target.value)}
              className="w-full sm:w-28"
            />
            <Button
              onClick={handleGenerate}
              disabled={billingState.loading}
              className="gradient-warm text-primary-foreground border-0 min-h-11 w-full sm:w-auto"
            >
              <Calculator className="h-4 w-4 mr-2" />
              {billingState.loading ? "Generating..." : "Generate Bill"}
            </Button>
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={item}
        className="glass-card p-3 sm:p-4 md:p-6 overflow-x-auto"
      >
        {billingState.error ? (
          <p className="text-sm text-destructive mb-3">{billingState.error}</p>
        ) : null}

        <table className="w-full min-w-[1100px] text-sm">
          <thead>
            <tr className="text-left text-xs text-muted-foreground border-b border-border/50">
              <th className="py-3 pr-3 font-medium">Student Name</th>
              <th className="py-3 pr-3 font-medium">Room</th>
              <th className="py-3 pr-3 font-medium">Present Days</th>
              <th className="py-3 pr-3 font-medium">Per Day Charge</th>
              <th className="py-3 pr-3 font-medium">Guest</th>
              <th className="py-3 pr-3 font-medium">Extra (Rs)</th>
              <th className="py-3 pr-3 font-medium text-right">Total Amount</th>
            </tr>
          </thead>
          <tbody>
            {billRows.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    No bill data available. Select month/year and click
                    Generate.
                  </div>
                </td>
              </tr>
            ) : null}
            {billRows.map((row) => (
              <tr
                key={String(row.studentId)}
                className="border-b border-border/30 last:border-b-0"
              >
                <td className="py-3 pr-3 font-medium text-foreground">
                  {row.name || "-"}
                </td>
                <td className="py-3 pr-3 text-foreground">
                  {row.roomNumber || "-"}
                </td>
                <td className="py-3 pr-3 text-foreground">
                  {row.breakdown?.presentDays || 0}
                </td>
                <td className="py-3 pr-3 text-foreground">
                  ₹{Number(row.breakdown?.perDayCharge || 0).toLocaleString()}
                </td>
                <td className="py-3 pr-3 text-foreground">
                  {row.breakdown?.guest || 0}
                </td>
                <td className="py-3 pr-3 text-foreground">
                  {row.breakdown?.extra || 0}
                </td>
                <td className="py-3 pr-3 text-right font-semibold text-foreground">
                  ₹{Number(row.totalAmount || 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
          {billRows.length > 0 ? (
            <tfoot>
              <tr>
                <td
                  colSpan={7}
                  className="pt-4 text-right font-semibold text-foreground"
                >
                  Grand Total
                </td>
                <td className="pt-4 text-right font-bold text-foreground">
                  ₹{grandTotal.toLocaleString()}
                </td>
              </tr>
            </tfoot>
          ) : null}
        </table>
      </motion.div>
    </motion.div>
  );
};

export default AdminBilling;
