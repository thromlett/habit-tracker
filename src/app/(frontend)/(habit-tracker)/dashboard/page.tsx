import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import HabitDashboard from "@/components/pages/HabitDashboard";
import { getHabitsLoggable, getLogs } from "@/lib/habit";

export default async function DashboardPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const habits = await getHabitsLoggable();
  const logs = await getLogs();

  return <HabitDashboard initialHabits={habits} initialLogs={logs} />;
}
