import React from "react";
import DashboardSSR from "./DashboardSSR";
import LoadIcon from "@/components/LoadIcon";

export default function DashboardPage() {
  return (
    <React.Suspense fallback={<LoadIcon />}>
      <DashboardSSR />
    </React.Suspense>
  );
}
