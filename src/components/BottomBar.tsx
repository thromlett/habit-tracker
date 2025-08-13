// components/BottomBar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiHome, FiList, FiPlusCircle, FiUser } from "react-icons/fi";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: <FiHome /> },
  { href: "/logger", label: "Logger", icon: <FiList /> },
  { href: "/create", label: "Create", icon: <FiPlusCircle /> },
  { href: "/profile", label: "Profile", icon: <FiUser /> },
];

export default function BottomBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow z-50 h-16 flex items-center justify-around">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`flex flex-col items-center justify-center flex-1 h-full text-xs ${
            pathname === item.href
              ? "text-blue-600 font-semibold"
              : "text-gray-500"
          }`}
        >
          <span className="text-2xl mb-1">{item.icon}</span>
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
