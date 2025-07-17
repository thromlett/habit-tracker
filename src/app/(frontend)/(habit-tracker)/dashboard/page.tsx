import React from "react";
import DashboardSSR from "./DashboardSSR";
import { Quantum } from "ldrs/react";
import "ldrs/react/Quantum.css";

export default function DashboardPage() {
  return (
    <React.Suspense
      fallback={
        <div className="fixed inset-0 flex items-center justify-center bg-white/50 z-50">
          <Quantum size={50} speed={1.5} />
        </div>
      }
    >
      <DashboardSSR />
    </React.Suspense>
  );
}
