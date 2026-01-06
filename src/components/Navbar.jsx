import { Link, useLocation } from "react-router-dom";

export default function FooterNav() {
  const location = useLocation();

  const navItems = [
    { icon: "home", label: "Home", path: "/home" },
    { icon: "redeem", label: "Rewards", path: "/rewards" },
    { icon: "storefront", label: "Tenants", path: "/tenants" },
    { icon: "person", label: "Profile", path: "/profile" },
    { icon: "more_horiz", label: "More", path: "/more" },
  ];

  return (
    <footer className="sticky bottom-0 bg-[#1E1E1E]/80 backdrop-blur-lg border-t border-white/10">
      <nav className="flex justify-around items-center h-20 px-2 text-xs font-medium">
        {navItems.map(({ icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={label}
              to={path}
              className={`flex flex-col items-center justify-center gap-1 w-16 transition ${
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
