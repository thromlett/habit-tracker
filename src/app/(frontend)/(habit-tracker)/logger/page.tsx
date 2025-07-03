import React from "react";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth/next";
import HabitLogger from "@/components/pages/HabitLogger";
import { getHabits, getLogs } from "@/lib/habit";

export default async function LoggerPage() {
  const session = await getServerSession();
  if (!session) {
    redirect("/login");
  }

  const habits = await getHabits();
  const logs = await getLogs();

  return <HabitLogger initialHabits={habits} initialLogs={logs} />;
}
