import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const panelVariants = {
  hidden: { x: "-100%" },
  visible: { x: 0 },
  exit: { x: "-100%" },
};

const MobileSidebar = ({ isOpen, navItems, locationPath, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen ? (
        <>
          <motion.button
            type="button"
            aria-label="Close sidebar overlay"
            className="fixed inset-0 z-40 bg-black/50 md:hidden"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          <motion.aside
            className="fixed inset-y-0 left-0 z-50 w-[82vw] max-w-[320px] glass-card rounded-none border-y-0 border-l-0 p-4 pt-5 md:hidden"
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ type: "tween", duration: 0.25 }}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-base font-semibold font-display text-foreground">
                Navigation
              </span>
              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-lg hover:bg-muted/50"
                aria-label="Close sidebar"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <nav className="flex flex-col gap-1">
              {navItems.map((item) => {
                const isActive = locationPath === item.path;
                return (
                  <Link key={item.path} to={item.path} onClick={onClose}>
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "gradient-warm text-primary-foreground shadow-md"
                          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.label}
                    </div>
                  </Link>
                );
              })}
            </nav>
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
};

export default MobileSidebar;
