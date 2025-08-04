"use client";

import { useState, useRef, useEffect } from "react";

export interface MenuItem {
  label: string;
  onClick: () => void;
}

interface HamburgerMenuProps {
  items: MenuItem[];
  widthClass?: string; // optional Tailwind width, e.g. 'w-64'
}

export default function HamburgerMenu({
  items,
  widthClass = "w-64",
}: HamburgerMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // close on outside click
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Toggle menu"
        aria-expanded={isOpen}
        className="p-2 bg-white rounded-lg shadow hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
      >
        <span className="relative block w-6 h-6">
          {/* Top bar */}
          <span
            className={`
              absolute left-0 w-6 h-0.5 bg-gray-800 rounded-full
              transition-all duration-200 origin-center
              ${isOpen ? "top-1/2 rotate-45" : "top-1"}
            `}
          />
          {/* Middle bar */}
          <span
            className={`
              absolute left-0 w-6 h-0.5 bg-gray-800 rounded-full
              transition-opacity duration-0
              ${isOpen ? "opacity-0" : "top-1/2 -translate-y-1/2"}
            `}
          />
          {/* Bottom bar */}
          <span
            className={`
              absolute left-0 w-6 h-0.5 bg-gray-800 rounded-full
              transition-all duration-200 origin-center
              ${isOpen ? "top-1/2 -rotate-45" : "bottom-1"}
            `}
          />
        </span>
      </button>

      {isOpen && (
        <div
          className={`
            absolute right-0 mt-2 ${widthClass}
            bg-white rounded-lg shadow-lg overflow-hidden
            animate-fadeIn scale-95 origin-top-right
          `}
        >
          {items.map((item, i) => (
            <button
              key={i}
              onClick={() => {
                item.onClick();
                setIsOpen(false); // auto-close after click
              }}
              className="block w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-100 transition"
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
