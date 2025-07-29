import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import HabitDashboard from "@/app/(frontend)/(habit-tracker)/dashboard/HabitDashboard";
import {
  getHabits,
  getLoggableHabits,
  getLogs,
  getFollowingHabits,
  getGlobalHabits,
} from "@/lib/habit-server";
import type { HabitLog, Habit } from "@/lib/habit";

export default async function DashboardSSR() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const [habits, loggableHabits, logs, following, global] = await Promise.all([
    getHabits() as Promise<Habit[]>,
    getLoggableHabits() as Promise<Habit[]>,
    getLogs() as Promise<HabitLog[]>,
    getFollowingHabits() as Promise<Habit[]>,
    getGlobalHabits() as Promise<Habit[]>,
  ]);

  return (
    <HabitDashboard
      initialHabits={habits}
      initialLoggableHabits={loggableHabits}
      initialLogs={logs}
      initialFollowing={following}
      initialGlobal={global}
    />
  );
}
