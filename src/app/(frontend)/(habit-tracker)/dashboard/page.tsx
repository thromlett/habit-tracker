import React from "react";
import DashboardSSR from "./DashboardSSR";
import LoadIcon from "@/components/LoadIcon";
import BottomBar from "@/components/BottomBar";

export default function DashboardPage() {
  return (
    <React.Suspense fallback={<LoadIcon />}>
      <DashboardSSR />
      <BottomBar />
    </React.Suspense>
  );
}
