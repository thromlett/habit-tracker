"use client";
import React, { useState } from "react";
import {
  //useQuery,
  useQueryClient,
  //QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query";
import { Habit, HabitLog } from "@/lib/habit";
import HabitDash from "./HabitDash";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/TopBar";

// Types for your habits and logs

interface Props {
  initialHabits: Habit[];
  initialLoggableHabits: Habit[];
  initialLogs: HabitLog[];
}
export default function DashboardPage({
  initialHabits,
  initialLoggableHabits,
  initialLogs,
}: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [currentTab, setCurrentTab] = useState("You");

  return (
    <SessionProvider>
      <TopBar
        tabs={["You", "Following", "Global"]}
        selectedTab={currentTab}
        onSelectTab={setCurrentTab}
        notificationCount={69}
        onProfileClick={() => router.push("/profile")}
        onNotificationClick={() => router.push("/notifications")}
      />
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary
          state={{
            queries: [
              { queryKey: ["habitsLoggable"], state: { data: initialHabits } },
              { queryKey: ["logs"], state: { data: initialLogs } },
            ],
          }}
        >
          {currentTab === "You" && (
            <div className="pb-20 min-h-screen bg-gray-50">
              <main className="max-w-md mx-auto pt-8 px-4">
                <h1 className="text-2xl font-bold mb-4">Your Habits</h1>
                <HabitDash habits={initialLoggableHabits} logs={initialLogs} />
              </main>
            </div>
          )}
          {currentTab === "Following" && (
            <div className="pb-20 min-h-screen bg-gray-50">
              <main className="max-w-md mx-auto pt-8 px-4">
                <h1 className="text-2xl font-bold mb-4">
                  Your Followed Habits
                </h1>
                <HabitDash habits={initialHabits} logs={initialLogs} />
              </main>
            </div>
          )}
          {currentTab === "Global" && <p>Showing global feed...</p>}
        </HydrationBoundary>
      </QueryClientProvider>
    </SessionProvider>
  );
}
