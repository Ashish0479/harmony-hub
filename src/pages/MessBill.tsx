import { motion } from "framer-motion";
import { Receipt, CheckCircle2, Clock, IndianRupee } from "lucide-react";
import { Button } from "@/components/ui/button";

const bills = [
  { month: "March 2026", amount: 2450, status: "pending" as const, due: "Apr 5, 2026" },
  { month: "February 2026", amount: 2450, status: "paid" as const, paidOn: "Mar 2, 2026" },
  { month: "January 2026", amount: 2450, status: "paid" as const, paidOn: "Feb 1, 2026" },
];

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.1 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const MessBill = () => {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-3xl">
      <motion.div variants={item} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
          <Receipt className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Mess Bill</h1>
          <p className="text-sm text-muted-foreground">Your monthly mess charges</p>
        </div>
      </motion.div>

      {/* Outstanding */}
      <motion.div variants={item} className="glass-card p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 gradient-warm opacity-10 rounded-full blur-2xl" />
        <p className="text-sm text-muted-foreground mb-1">Outstanding Balance</p>
        <div className="flex items-baseline gap-1">
          <IndianRupee className="h-6 w-6 text-primary" />
          <span className="text-4xl font-bold font-display gradient-warm-text">2,450</span>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Due by Apr 5, 2026</p>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-4">
          <Button className="gradient-warm text-primary-foreground rounded-xl h-11 px-8 font-semibold shadow-lg border-0">
            Pay Now
          </Button>
        </motion.div>
      </motion.div>

      {/* History */}
      <div className="space-y-3">
        {bills.map((bill) => (
          <motion.div key={bill.month} variants={item} className="glass-card p-5 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-foreground">{bill.month}</h3>
              <p className="text-sm text-muted-foreground">
                {bill.status === "paid" ? `Paid on ${bill.paidOn}` : `Due: ${bill.due}`}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold font-display text-foreground">₹{bill.amount.toLocaleString()}</span>
              {bill.status === "paid" ? (
                <span className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-3 py-1 rounded-full">
                  <CheckCircle2 className="h-3 w-3" /> Paid
                </span>
              ) : (
                <span className="flex items-center gap-1 text-xs font-medium text-warning bg-warning/10 px-3 py-1 rounded-full">
                  <Clock className="h-3 w-3" /> Pending
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default MessBill;
