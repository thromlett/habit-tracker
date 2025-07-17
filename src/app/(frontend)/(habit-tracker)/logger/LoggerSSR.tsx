import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import HabitLogger from "@/app/(frontend)/(habit-tracker)/logger/HabitLogger";
import { getHabits, getLogs } from "@/lib/habit-server";
import type { HabitLog, Habit } from "@/lib/habit";

export default async function LoggerSSR() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const [habits, logs] = await Promise.all([
    getHabits() as Promise<Habit[]>,
    getLogs() as Promise<HabitLog[]>,
  ]);

  return <HabitLogger initialHabits={habits} initialLogs={logs} />;
}
