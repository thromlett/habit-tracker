import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import HabitDashboard from "@/components/pages/HabitDashboard";
import { getLoggableHabits, getLogs } from "@/lib/habit-server";
import type { HabitLog, Habit } from "@/lib/habit";

export default async function DashboardSSR() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const [habits, logs] = await Promise.all([
    getLoggableHabits() as Promise<Habit[]>,
    getLogs() as Promise<HabitLog[]>,
  ]);

  return <HabitDashboard initialHabits={habits} initialLogs={logs} />;
}
