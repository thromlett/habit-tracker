import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import HabitLogger from "@/components/pages/HabitLogger";
import { getHabits, getLogs } from "@/lib/habit-server";
import type { HabitLog, Habit } from "@/lib/habit";

export default async function LoggerPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const habits = (await getHabits()) as Habit[];
  const logs = (await getLogs()) as HabitLog[];

  return <HabitLogger initialHabits={habits} initialLogs={logs} />;
}
