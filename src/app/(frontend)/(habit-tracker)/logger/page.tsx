import React from "react";
import LoggerSSR from "./LoggerSSR";
import LoadIcon from "@/components/LoadIcon";
import BottomBar from "@/components/BottomBar";

export default function LoggerPage() {
  return (
    <React.Suspense fallback={<LoadIcon />}>
      <LoggerSSR />
      <BottomBar />
    </React.Suspense>
  );
}
