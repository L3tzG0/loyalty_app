import { Link, useLocation } from "react-router-dom";

export default function AdminNav() {
  const location = useLocation();

  const navItems = [
    {
      icon: "dashboard",
      label: "Dashboard",
      path: "/admin",
    },
    {
      icon: "feedback",
      label: "Feedback",
      path: "/admin/feedback",
    },
    {
      icon: "redeem",
      label: "Rewards",
      path: "/admin/rewards",
    },
    {
      icon: "storefront",
      label: "Tenants",
      path: "/admin/tenants",
    },
    {
      icon: "add_ad",
      label: "Promotions",
      path: "/admin/promotions",
    },
  ];

  return (
    <footer className="bottom-0 left-0 z-50 fixed bg-[#1E1E1E]/90 backdrop-blur-lg border-white/10 border-t w-full">
      <nav className="flex justify-evenly items-center h-14 text-[11px]">
        {navItems.map(({ icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={label}
              to={path}
              className={`flex flex-col items-center gap-0.5 transition ${
                active ? "text-[#D4AF37]" : "text-[#A9A9A9]"
              }`}
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: `'FILL' ${active ? 1 : 0}` }}
              >
                {icon}
              </span>
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </footer>
  );
}
