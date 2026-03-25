import { motion } from "framer-motion";
import { UtensilsCrossed } from "lucide-react";

const weeklyMenu = [
  { day: "Monday", breakfast: "Idli, Sambar, Chutney", lunch: "Rajma, Rice, Roti, Salad", snacks: "Bread Pakora, Tea", dinner: "Aloo Gobi, Dal, Rice, Roti" },
  { day: "Tuesday", breakfast: "Poha, Jalebi, Tea", lunch: "Chole, Rice, Roti, Raita", snacks: "Vada Pav, Chai", dinner: "Mix Veg, Dal Fry, Rice, Roti" },
  { day: "Wednesday", breakfast: "Paratha, Curd, Pickle", lunch: "Dal Tadka, Jeera Rice, Roti", snacks: "Samosa, Coffee", dinner: "Paneer Butter Masala, Rice, Naan" },
  { day: "Thursday", breakfast: "Upma, Banana, Tea", lunch: "Kadhi Chawal, Roti, Papad", snacks: "Bhel Puri, Juice", dinner: "Shahi Paneer, Rice, Roti, Kheer" },
  { day: "Friday", breakfast: "Chole Bhature, Lassi", lunch: "Aloo Matar, Rice, Roti", snacks: "Cake, Tea", dinner: "Biryani, Raita, Gulab Jamun" },
  { day: "Saturday", breakfast: "Dosa, Chutney, Sambar", lunch: "Matar Paneer, Rice, Roti", snacks: "Pav Bhaji", dinner: "Dal Makhani, Rice, Butter Naan" },
  { day: "Sunday", breakfast: "Aloo Paratha, Curd", lunch: "Special Thali", snacks: "Momos, Cold Drink", dinner: "Chicken/Paneer Curry, Rice, Naan, Ice Cream" },
];

const today = new Date().getDay();
const dayIndex = today === 0 ? 6 : today - 1;

const container = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { staggerChildren: 0.05 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

const MessMenu = () => {
  return (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-6 max-w-5xl">
      <motion.div variants={item} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-warm flex items-center justify-center">
          <UtensilsCrossed className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display text-foreground">Weekly Mess Menu</h1>
          <p className="text-sm text-muted-foreground">Updated by admin • This week</p>
        </div>
      </motion.div>

      <div className="space-y-3">
        {weeklyMenu.map((menu, i) => (
          <motion.div
            key={menu.day}
            variants={item}
            className={`glass-card p-5 ${i === dayIndex ? "ring-2 ring-primary/40" : ""}`}
          >
            <div className="flex items-center gap-2 mb-3">
              <h3 className={`font-semibold font-display ${i === dayIndex ? "gradient-warm-text" : "text-foreground"}`}>
                {menu.day}
              </h3>
              {i === dayIndex && (
                <span className="text-xs font-medium gradient-warm text-primary-foreground px-2 py-0.5 rounded-full">Today</span>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {(["breakfast", "lunch", "snacks", "dinner"] as const).map((meal) => (
                <div key={meal} className="bg-muted/40 rounded-lg p-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{meal}</span>
                  <p className="text-sm text-foreground mt-1">{menu[meal]}</p>
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
