import { Link } from "react-router-dom";

const NavItem = ({ title, route, isActive }) => {
  return (
    <Link
      to={route}
      className={`shrink-0 rounded-lg px-3 py-2 text-sm font-medium shadow-sm transition duration-200 ${
        isActive
          ? "bg-primary text-primary-foreground"
          : "bg-muted/70 text-foreground hover:bg-muted"
      }`}
    >
      {title}
    </Link>
  );
};

export default NavItem;
