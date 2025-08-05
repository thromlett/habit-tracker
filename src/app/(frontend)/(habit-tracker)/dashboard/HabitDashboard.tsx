"use client";
import React, { useState } from "react";
import { useQueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Habit, HabitLog } from "@/lib/habit";
import HabitDash from "./HabitDash";
import HabitOthers from "./HabitOthers";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";
import HeatMapComponent from "@/components/HeatMapComponent";
import { useLogs } from "@/hooks/useLogs";
import { useLoggableHabit } from "@/hooks/useLoggableHabit";

interface Props {
  initialHabits: Habit[];
  initialLoggableHabits: Habit[];
  initialLogs: HabitLog[];
  initialFollowing: Habit[];
  initialGlobal: Habit[];
}
export default function DashboardPage({
  initialLoggableHabits,
  initialLogs,
  initialFollowing,
  initialGlobal,
}: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("You");

  const { data: habits = initialLoggableHabits } = useLoggableHabit(
    ["habitsLoggable"],
    { initialData: initialLoggableHabits }
  );
  const { data: logs = initialLogs } = useLogs(["logs"], {
    initialData: initialLogs,
  });

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <TopBar
          tabs={["You", "Following", "Global"]}
          selectedTab={currentTab}
          onSelectTab={setCurrentTab}
          notificationCount={69}
          onProfileClick={() => router.push("/profile")}
          onNotificationClick={() => router.push("/notifications")}
        />
        {currentTab === "You" && (
          <div className="pb-20 min-h-screen bg-gray-50">
            <main className="max-w-md mx-auto pt-8 px-4">
              <HeatMapComponent logs={initialLogs} />
              <h1 className="text-2xl font-bold mb-4">Your Habits</h1>
              <HabitDash habits={habits} logs={logs} />
            </main>
          </div>
        )}
        {currentTab === "Following" && (
          <div className="pb-20 min-h-screen bg-gray-50">
            <main className="max-w-md mx-auto pt-8 px-4">
              <h1 className="text-2xl font-bold mb-4">Your Followed Habits</h1>
              <HabitOthers habits={initialFollowing} logs={initialLogs} />
            </main>
          </div>
        )}
        {currentTab === "Global" && (
          <div className="pb-20 min-h-screen bg-gray-50">
            <main className="max-w-md mx-auto pt-8 px-4">
              <h1 className="text-2xl font-bold mb-4">Global Habits</h1>
              <HabitOthers habits={initialGlobal} logs={initialLogs} />
            </main>
          </div>
        )}
      </QueryClientProvider>
    </SessionProvider>
  );
}
