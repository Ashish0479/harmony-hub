import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  fetchFixedMenu,
  fetchTodayMenu,
  updateTodayMenu,
} from "@/redux/slices/menuSlice";

const today = new Date().getDay();
const dayIndex = today === 0 ? 6 : today - 1;
const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const MessMenu = () => {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth.data);
  const { loading, updating, data, error } = useSelector((state) => state.menu);

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0],
    breakfast: "",
    lunch: "",
    dinner: "",
  });

  useEffect(() => {
    dispatch(fetchFixedMenu());
    dispatch(fetchTodayMenu());
  }, [dispatch]);

  const weeklyMenu = useMemo(() => {
    if (!Array.isArray(data.fixedMenu)) return [];
    return data.fixedMenu;
  }, [data.fixedMenu]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUpdateMenu = async (event) => {
    event.preventDefault();
    const result = await dispatch(updateTodayMenu(formData));
    if (updateTodayMenu.fulfilled.match(result)) {
      toast.success("Today menu updated");
      dispatch(fetchTodayMenu());
      return;
    }
    toast.error(result.payload || "Failed to update menu");
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-5xl"
    >
      <motion.div variants={item} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
          <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Weekly Mess Menu
          </h1>
          <p className="text-sm text-muted-foreground">
            Updated by admin • This week
          </p>
        </div>
      </motion.div>

      {role === "ADMIN" ? (
        <motion.form
          onSubmit={handleUpdateMenu}
          variants={item}
          className="glass-card p-5 grid md:grid-cols-4 gap-3"
        >
          <Input
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
          />
          <Input
            name="breakfast"
            value={formData.breakfast}
            onChange={handleChange}
            placeholder="Breakfast"
          />
          <Input
            name="lunch"
            value={formData.lunch}
            onChange={handleChange}
            placeholder="Lunch"
          />
          <Input
            name="dinner"
            value={formData.dinner}
            onChange={handleChange}
            placeholder="Dinner"
          />
          <div className="md:col-span-4">
            <Button
              disabled={updating}
              type="submit"
              className="gradient-warm text-primary-foreground border-0"
            >
              {updating ? "Updating..." : "Update Today Menu"}
            </Button>
          </div>
        </motion.form>
      ) : null}

      {loading ? (
        <motion.div
          variants={item}
          className="glass-card p-5 text-sm text-muted-foreground"
        >
          Loading menu...
        </motion.div>
      ) : null}
      {error ? (
        <motion.div
          variants={item}
          className="glass-card p-5 text-sm text-destructive"
        >
          {error}
        </motion.div>
      ) : null}

      <div className="space-y-3">
        {weeklyMenu.map((menu, i) => (
          <motion.div
            key={menu.day || i}
            variants={item}
            className={`glass-card p-5 ${i === dayIndex ? "ring-2 ring-primary/40" : ""}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <h3
                className={`font-semibold font-display ${i === dayIndex ? "gradient-warm-text" : "text-foreground"}`}
              >
                {menu.day}
              </h3>
              {i === dayIndex && (
                <span className="text-xs font-medium gradient-warm text-primary-foreground px-2 py-0.5 rounded-full">
                  Today
                </span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {["breakfast", "lunch", "snacks", "dinner"].map((meal) => (
                <div key={meal} className="bg-muted/40 rounded-lg p-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                    {meal}
                  </span>
                  <p className="text-sm text-foreground mt-1">
                    {menu[meal] || "-"}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
export default MessMenu;
