import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatInputDateValue } from "@/lib/dateFormat";
import {
  fetchWeeklyMenu,
  fetchTodayMenu,
  updateWeeklyMenu,
  updateTodayMenu,
} from "@/redux/slices/menuSlice";

const DAY_ORDER = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

const DAY_LABELS = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

const DEFAULT_WEEKLY = {
  monday: { breakfast: "", lunch: "", dinner: "" },
  tuesday: { breakfast: "", lunch: "", dinner: "" },
  wednesday: { breakfast: "", lunch: "", dinner: "" },
  thursday: { breakfast: "", lunch: "", dinner: "" },
  friday: { breakfast: "", lunch: "", dinner: "" },
  saturday: { breakfast: "", lunch: "", dinner: "" },
  sunday: { brunch: "", dinner: "" },
};

const getTodayKey = () => {
  const key = new Date()
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  return DAY_ORDER.includes(key) ? key : "monday";
};

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } },
};
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const MessMenu = () => {
  const dispatch = useDispatch();
  const { role } = useSelector((state) => state.auth.data);
  const { loading, updating, data, error } = useSelector((state) => state.menu);
  const todayKey = useMemo(() => getTodayKey(), []);

  const [weeklyDraft, setWeeklyDraft] = useState(DEFAULT_WEEKLY);
  const [todayOverrideDraft, setTodayOverrideDraft] = useState({
    date: new Date().toISOString().split("T")[0],
    isCustomTodayMenu: false,
    breakfast: "",
    brunch: "",
    lunch: "",
    dinner: "",
  });

  useEffect(() => {
    dispatch(fetchWeeklyMenu());
    dispatch(fetchTodayMenu());
  }, [dispatch]);

  useEffect(() => {
    const incoming = data.weeklyMenu;
    if (!incoming || typeof incoming !== "object") return;

    setWeeklyDraft({
      ...DEFAULT_WEEKLY,
      ...incoming,
      sunday: {
        ...DEFAULT_WEEKLY.sunday,
        ...(incoming.sunday || {}),
      },
    });
  }, [data.weeklyMenu]);

  useEffect(() => {
    const incoming = data.todayMenu;
    if (!incoming || typeof incoming !== "object") return;

    setTodayOverrideDraft((prev) => ({
      ...prev,
      date: incoming.date || prev.date,
      isCustomTodayMenu: Boolean(incoming.isCustomTodayMenu),
      breakfast: incoming.breakfast || "",
      brunch: incoming.brunch || "",
      lunch: incoming.lunch || "",
      dinner: incoming.dinner || "",
    }));
  }, [data.todayMenu]);

  const weeklyRows = useMemo(
    () =>
      DAY_ORDER.map((day) => ({
        day,
        label: DAY_LABELS[day],
        meals: weeklyDraft[day] || {},
      })),
    [weeklyDraft],
  );

  const handleTodayDraftChange = (event) => {
    const { name, value } = event.target;
    setTodayOverrideDraft((prev) => ({ ...prev, [name]: value }));
  };

  const handleWeeklyFieldChange = (day, meal, value) => {
    setWeeklyDraft((prev) => ({
      ...prev,
      [day]: {
        ...(prev[day] || {}),
        [meal]: value,
      },
    }));
  };

  const handleSaveWeeklyMenu = async () => {
    const result = await dispatch(
      updateWeeklyMenu({ weeklyMenu: weeklyDraft }),
    );

    if (updateWeeklyMenu.fulfilled.match(result)) {
      toast.success("Weekly menu updated");
      dispatch(fetchWeeklyMenu());
      return;
    }

    toast.error(result.payload || "Failed to update weekly menu");
  };

  const handleUpdateTodayMenu = async (event) => {
    event.preventDefault();
    const payload = todayOverrideDraft.isCustomTodayMenu
      ? todayOverrideDraft
      : {
          date: todayOverrideDraft.date,
          isCustomTodayMenu: false,
        };

    const result = await dispatch(updateTodayMenu(payload));

    if (updateTodayMenu.fulfilled.match(result)) {
      toast.success("Today menu updated");
      dispatch(fetchTodayMenu());
      return;
    }

    toast.error(result.payload || "Failed to update menu");
  };

  const todayDisplayMenu = useMemo(() => {
    const todayMenu = data.todayMenu || {};
    const entries = [
      ["Breakfast", todayMenu.breakfast],
      ["Brunch", todayMenu.brunch],
      ["Lunch", todayMenu.lunch],
      ["Dinner", todayMenu.dinner],
    ].filter(([, value]) => Boolean(value));

    return entries;
  }, [data.todayMenu]);

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="space-y-6 max-w-5xl w-full"
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
          onSubmit={handleUpdateTodayMenu}
          variants={item}
          className="glass-card p-4 sm:p-5 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <h3 className="text-base font-semibold font-display text-foreground">
              Today's Menu Override
            </h3>
            <label className="text-sm text-foreground flex items-center gap-2">
              <input
                type="checkbox"
                checked={todayOverrideDraft.isCustomTodayMenu}
                onChange={(event) =>
                  setTodayOverrideDraft((prev) => ({
                    ...prev,
                    isCustomTodayMenu: event.target.checked,
                  }))
                }
              />
              Use custom menu for today
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <Input
              name="date"
              type="date"
              value={todayOverrideDraft.date}
              onChange={handleTodayDraftChange}
            />
            <div className="flex items-center text-xs text-muted-foreground sm:col-span-1 lg:col-span-1">
              {formatInputDateValue(todayOverrideDraft.date)}
            </div>
          </div>

          {todayOverrideDraft.isCustomTodayMenu ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <Input
                name="breakfast"
                value={todayOverrideDraft.breakfast}
                onChange={handleTodayDraftChange}
                placeholder="Breakfast"
              />
              <Input
                name="brunch"
                value={todayOverrideDraft.brunch}
                onChange={handleTodayDraftChange}
                placeholder="Brunch"
              />
              <Input
                name="lunch"
                value={todayOverrideDraft.lunch}
                onChange={handleTodayDraftChange}
                placeholder="Lunch"
              />
              <Input
                name="dinner"
                value={todayOverrideDraft.dinner}
                onChange={handleTodayDraftChange}
                placeholder="Dinner"
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Weekly menu is active for today. Enable custom menu only when a
              special update is required.
            </p>
          )}

          <Input
            type="hidden"
            name="isCustomTodayMenu"
            value={String(todayOverrideDraft.isCustomTodayMenu)}
          />
          <div>
            <Button
              disabled={updating}
              type="submit"
              className="gradient-warm text-primary-foreground border-0 min-h-11 w-full sm:w-auto"
            >
              {updating
                ? "Updating..."
                : todayOverrideDraft.isCustomTodayMenu
                  ? "Save Custom Today Menu"
                  : "Use Weekly Menu For Today"}
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

      <motion.div variants={item} className="glass-card p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3 mb-4">
          <h3 className="text-lg font-semibold font-display text-foreground">
            Weekly Menu
          </h3>
          {role === "ADMIN" ? (
            <Button
              disabled={updating}
              onClick={handleSaveWeeklyMenu}
              className="gradient-warm text-primary-foreground border-0"
            >
              {updating ? "Saving..." : "Save Weekly Menu"}
            </Button>
          ) : null}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px]">
            <thead>
              <tr className="text-left text-xs text-muted-foreground border-b border-border/50">
                <th className="py-3 pr-3 font-medium">Day</th>
                <th className="py-3 pr-3 font-medium">Breakfast / Brunch</th>
                <th className="py-3 pr-3 font-medium">Lunch</th>
                <th className="py-3 pr-3 font-medium">Dinner</th>
              </tr>
            </thead>
            <tbody>
              {weeklyRows.map((row) => {
                const isToday = row.day === todayKey;
                const breakfastOrBrunch =
                  row.day === "sunday"
                    ? row.meals.brunch || "-"
                    : row.meals.breakfast || "-";
                const lunch =
                  row.day === "sunday" ? "-" : row.meals.lunch || "-";

                return (
                  <tr
                    key={row.day}
                    className={`border-b border-border/30 last:border-0 ${isToday ? "bg-muted/20" : ""}`}
                  >
                    <td className="py-3 pr-3 align-top">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {row.label}
                        </span>
                        {isToday ? (
                          <span className="text-[10px] font-medium gradient-warm text-primary-foreground px-2 py-0.5 rounded-full">
                            Today
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="py-3 pr-3 align-top">
                      {role === "ADMIN" ? (
                        <textarea
                          value={
                            breakfastOrBrunch === "-" ? "" : breakfastOrBrunch
                          }
                          onChange={(event) =>
                            handleWeeklyFieldChange(
                              row.day,
                              row.day === "sunday" ? "brunch" : "breakfast",
                              event.target.value,
                            )
                          }
                          className="w-full min-h-20 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                          placeholder={
                            row.day === "sunday" ? "Brunch" : "Breakfast"
                          }
                        />
                      ) : (
                        <p className="text-sm text-foreground">
                          {breakfastOrBrunch}
                        </p>
                      )}
                    </td>
                    <td className="py-3 pr-3 align-top">
                      {role === "ADMIN" && row.day !== "sunday" ? (
                        <textarea
                          value={lunch === "-" ? "" : lunch}
                          onChange={(event) =>
                            handleWeeklyFieldChange(
                              row.day,
                              "lunch",
                              event.target.value,
                            )
                          }
                          className="w-full min-h-20 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                          placeholder="Lunch"
                        />
                      ) : (
                        <p className="text-sm text-foreground">{lunch}</p>
                      )}
                    </td>
                    <td className="py-3 pr-3 align-top">
                      {role === "ADMIN" ? (
                        <textarea
                          value={row.meals.dinner || ""}
                          onChange={(event) =>
                            handleWeeklyFieldChange(
                              row.day,
                              "dinner",
                              event.target.value,
                            )
                          }
                          className="w-full min-h-20 rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground"
                          placeholder="Dinner"
                        />
                      ) : (
                        <p className="text-sm text-foreground">
                          {row.meals.dinner || "-"}
                        </p>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>

      <motion.div variants={item} className="glass-card p-4 sm:p-5">
        <h3 className="text-base font-semibold font-display text-foreground mb-3">
          Today's Menu
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {todayDisplayMenu.length === 0 ? (
            <p className="text-sm text-muted-foreground col-span-4">
              Menu not available
            </p>
          ) : (
            todayDisplayMenu.map(([meal, items]) => (
              <div key={meal} className="bg-muted/40 rounded-lg p-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
                  {meal}
                </span>
                <p className="text-sm text-foreground mt-1">{items}</p>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};
export default MessMenu;
