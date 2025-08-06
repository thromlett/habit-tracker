// DashboardClient.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HabitDashboard from "./HabitDashboard";
import type { HabitLog, Habit } from "@/lib/habit";

const queryClient = new QueryClient();

export default function DashboardClient(props: {
  initialHabits: Habit[];
  initialLogs: HabitLog[];
  initialLoggableHabits: Habit[];
  initialFollowing: Habit[];
  initialGlobal: Habit[];
}) {
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <HabitDashboard
          initialHabits={props.initialHabits}
          initialLogs={props.initialLogs}
          initialLoggableHabits={props.initialLoggableHabits}
          initialFollowing={props.initialFollowing}
          initialGlobal={props.initialGlobal}
        />
      </QueryClientProvider>
    </SessionProvider>
  );
}
