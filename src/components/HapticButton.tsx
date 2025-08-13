"use client";
import React from "react";
import { NativeBridge } from "@/utils/ReactNativeBridge";

type HapticEffect =
  | "impactLight"
  | "impactMedium"
  | "impactHeavy"
  | "success"
  | string;

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  haptic?: HapticEffect | false; // false = disable for this instance
  trigger?: "pointerdown" | "click"; // pointerdown feels snappier
};

export function HapticButton({
  haptic = "impactMedium",
  trigger = "pointerdown",
  onClick,
  onPointerDown,
  ...rest
}: Props) {
  const doHaptic = () => {
    if (haptic) NativeBridge.haptic(haptic);
  };

  if (trigger === "pointerdown") {
    return (
      <button
        {...rest}
        onPointerDown={(e) => {
          doHaptic();
          onPointerDown?.(e);
        }}
        onClick={onClick}
      />
    );
  }

  return (
    <button
      {...rest}
      onClick={(e) => {
        doHaptic();
        onClick?.(e);
      }}
    />
  );
}
