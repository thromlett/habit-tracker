import React from "react";
import LoggerSSR from "./LoggerSSR";
import LoadIcon from "@/components/LoadIcon";

export default async function LoggerPage() {
  return (
    <React.Suspense fallback={<LoadIcon />}>
      <LoggerSSR />
    </React.Suspense>
  );
}
