import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Receipt, CheckCircle2, Clock, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatDate } from "@/lib/dateFormat";
import {
  fetchStudentBills,
  generateBill,
  markBillPaid,
} from "@/redux/slices/billSlice";
import { createPaymentOrder } from "@/redux/slices/paymentSlice";
import { fetchStudents } from "@/redux/slices/userSlice";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } },
};
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const MessBill = () => {
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth.data);
  const billState = useSelector((state) => state.bill);
  const paymentState = useSelector((state) => state.payment);
  const studentState = useSelector((state) => state.user);

  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [billMonth, setBillMonth] = useState(new Date().getMonth() + 1);
  const [billYear, setBillYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (role === "ADMIN") {
      dispatch(fetchStudents());
      return;
    }

    if (user?.id) {
      dispatch(fetchStudentBills(user.id));
    }
  }, [dispatch, role, user?.id]);

  useEffect(() => {
    if (role !== "ADMIN") return;
    if (selectedStudentId) {
      dispatch(fetchStudentBills(selectedStudentId));
    }
  }, [dispatch, role, selectedStudentId]);

  const bills = billState.data.bills || [];
  const pendingBill = useMemo(
    () => bills.find((bill) => !bill.isPaid) || null,
    [bills],
  );

  const handleGenerateBill = async () => {
    if (!selectedStudentId) {
      toast.error("Select a student first");
      return;
    }

    const result = await dispatch(
      generateBill({
        studentId: selectedStudentId,
        month: Number(billMonth),
        year: Number(billYear),
      }),
    );

    if (generateBill.fulfilled.match(result)) {
      toast.success("Bill generated successfully");
      dispatch(fetchStudentBills(selectedStudentId));
      return;
    }

    toast.error(result.payload || "Failed to generate bill");
  };

  const handleMarkPaid = async (bill) => {
    const result = await dispatch(
      markBillPaid({
        billId: bill._id,
        mode: "cash",
        amount: bill.grandTotal || bill.amountPaid || 0,
      }),
    );

    if (markBillPaid.fulfilled.match(result)) {
      toast.success("Payment updated");
      if (role === "ADMIN" && selectedStudentId) {
        dispatch(fetchStudentBills(selectedStudentId));
      }
      return;
    }

    toast.error(result.payload || "Failed to update payment");
  };

  const handlePayNow = async () => {
    if (!pendingBill) {
      toast.error("No pending bill available");
      return;
    }

    const amount = pendingBill.grandTotal || 0;
    const orderResult = await dispatch(
      createPaymentOrder({
        billId: pendingBill._id,
        month: pendingBill.month,
        year: pendingBill.year,
      }),
    );

    if (createPaymentOrder.rejected.match(orderResult)) {
      toast.error(orderResult.payload || "Unable to create payment order");
      return;
    }

    const result = await dispatch(
      markBillPaid({
        billId: pendingBill._id,
        mode: "online",
        amount,
      }),
    );

    if (markBillPaid.fulfilled.match(result)) {
      toast.success("Payment successful");
      if (user?.id) {
        dispatch(fetchStudentBills(user.id));
      }
      return;
    }

    toast.error(result.payload || "Payment update failed");
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-3xl w-full"
    >
      <motion.div variants={item} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
          <Receipt className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Mess Bill
          </h1>
          <p className="text-sm text-muted-foreground">
            {role === "ADMIN"
              ? "Manage student billing"
              : "Your monthly mess charges"}
          </p>
        </div>
      </motion.div>

      {role === "ADMIN" ? (
        <motion.div
          variants={item}
          className="glass-card p-4 sm:p-5 md:p-6 space-y-3"
        >
          <h2 className="font-semibold text-foreground">
            Generate Student Bill
          </h2>
          <select
            value={selectedStudentId}
            onChange={(event) => setSelectedStudentId(event.target.value)}
            className="w-full h-11 rounded-xl bg-muted/50 border border-border/50 px-3"
          >
            <option value="">Select student</option>
            {(studentState.data.students || []).map((student) => (
              <option key={student._id} value={student._id}>
                {student.firstName} {student.lastName} ({student.email})
              </option>
            ))}
          </select>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              type="number"
              value={billMonth}
              onChange={(e) => setBillMonth(e.target.value)}
              placeholder="Month"
              min={1}
              max={12}
            />
            <Input
              type="number"
              value={billYear}
              onChange={(e) => setBillYear(e.target.value)}
              placeholder="Year"
              min={2000}
              max={2100}
            />
          </div>
          <Button
            onClick={handleGenerateBill}
            disabled={billState.actionLoading}
            className="gradient-warm text-primary-foreground border-0 min-h-11 w-full sm:w-auto"
          >
            {billState.actionLoading ? "Generating..." : "Generate Bill"}
          </Button>
        </motion.div>
      ) : null}

      {/* Outstanding */}
      <motion.div
        variants={item}
        className="glass-card p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 gradient-warm opacity-10 rounded-full blur-2xl" />
        <p className="text-sm text-muted-foreground mb-1">
          Outstanding Balance
        </p>
        <div className="flex items-baseline gap-1">
          <IndianRupee className="h-6 w-6 text-primary" />
          <span className="text-4xl font-bold font-display gradient-warm-text">
            {pendingBill
              ? Number(pendingBill.grandTotal || 0).toLocaleString()
              : "0"}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {pendingBill
            ? `Pending for ${pendingBill.month}/${pendingBill.year}`
            : "No pending dues"}
        </p>
        {role === "STUDENT" && pendingBill ? (
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="mt-4"
          >
            <Button
              disabled={paymentState.loading || billState.actionLoading}
              onClick={handlePayNow}
              className="gradient-warm text-primary-foreground rounded-xl h-11 px-8 font-semibold shadow-lg border-0"
            >
              {paymentState.loading || billState.actionLoading
                ? "Processing..."
                : "Pay Now"}
            </Button>
          </motion.div>
        ) : null}
      </motion.div>

      {billState.loading ? (
        <motion.div
          variants={item}
          className="glass-card p-5 text-sm text-muted-foreground"
        >
          Loading bills...
        </motion.div>
      ) : null}
      {billState.error ? (
        <motion.div
          variants={item}
          className="glass-card p-5 text-sm text-destructive"
        >
          {billState.error}
        </motion.div>
      ) : null}

      {/* History */}
      <div className="space-y-3">
        {bills.length === 0 ? (
          <motion.div
            variants={item}
            className="glass-card p-5 text-sm text-muted-foreground"
          >
            No bill history available
          </motion.div>
        ) : null}
        {bills.map((bill) => (
          <motion.div
            key={bill._id || `${bill.month}-${bill.year}`}
            variants={item}
            className="glass-card p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
          >
            <div>
              <h3 className="font-semibold text-foreground">{`Month ${bill.month}, ${bill.year}`}</h3>
              <p className="text-sm text-muted-foreground">
                {bill.isPaid
                  ? `Paid on ${formatDate(bill.paymentDate)}`
                  : "Pending payment"}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
              <span className="text-lg font-bold font-display text-foreground">
                ₹
                {Number(
                  bill.grandTotal || bill.amountPaid || 0,
                ).toLocaleString()}
              </span>
              {bill.isPaid ? (
                <span className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-3 py-1 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> Paid
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-medium text-warning bg-warning/10 px-3 py-1 rounded-full">
                  <Clock className="h-3 w-3" /> Pending
                </span>
              )}
              {role === "ADMIN" && !bill.isPaid ? (
                <Button
                  onClick={() => handleMarkPaid(bill)}
                  size="sm"
                  className="h-8"
                >
                  Mark Paid
                </Button>
              ) : null}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
export default MessBill;
