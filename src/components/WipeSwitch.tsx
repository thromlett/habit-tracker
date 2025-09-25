"use client";

import React from "react";
import { AnimatePresence, motion } from "framer-motion";

type Direction = "ltr" | "rtl";

type WipeSwitchProps = {
  /** Stable identifier for the currently visible panel (e.g. 'profile', 'friends') */
  activeKey: string;
  /** Child to render for the activeKey */
  children: React.ReactNode;
  /** Optional: set wipe direction; defaults to 'ltr' (left→right reveal) */
  direction?: Direction;
  /** Optional: animation duration in seconds (default 0.45) */
  duration?: number;
  /** Optional: extra className for the container */
  className?: string;
};

/**
 * Wraps the currently active child and plays a wipe when activeKey changes.
 * Render it like:
 * <WipeSwitch activeKey={view}>{view === 'profile' ? <Profile/> : <Friends/>}</WipeSwitch>
 */
export default function WipeSwitch({
  activeKey,
  children,
  direction = "ltr",
  duration = 0.45,
  className,
}: WipeSwitchProps) {
  const isLTR = direction === "ltr";

  const initialClip = isLTR
    ? "inset(0 100% 0 0 round 0px)" // covered from the right, reveal left→right
    : "inset(0 0 0 100% round 0px)"; // covered from the left, reveal right→left

  const exitClip = isLTR
    ? "inset(0 0 0 100% round 0px)" // exit towards left (covering from left edge)
    : "inset(0 100% 0 0 round 0px)"; // exit towards right

  return (
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeKey}
          initial={{ clipPath: initialClip }}
          animate={{ clipPath: "inset(0 0% 0 0 round 0px)" }}
          exit={{ clipPath: exitClip }}
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Optional sheen traveling with the wipe */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={activeKey + "-sheen"}
          initial={{ x: isLTR ? "-100%" : "100%" }}
          animate={{ x: "0%" }}
          exit={{ x: isLTR ? "100%" : "-100%" }}
          transition={{ duration, ease: [0.22, 1, 0.36, 1] }}
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "linear-gradient(90deg, rgba(0,0,0,0) 0%, rgba(255,255,255,0.08) 50%, rgba(0,0,0,0) 100%)",
            mixBlendMode: "overlay",
          }}
        />
      </AnimatePresence>
    </div>
  );
}
