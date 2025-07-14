"use client";
import React /*,  { useState } */ from "react";
import {
  //useQuery,
  useQueryClient,
  //QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query";
import { Habit, HabitLog } from "@/lib/habit";
//import { useHabits, useLogs } from "@/hooks/";
import HabitDash from "../HabitDash";
import { SessionProvider } from "next-auth/react";

// Types for your habits and logs

interface Props {
  initialHabits: Habit[];
  initialLogs: HabitLog[];
}
export default function DashboardPage({ initialHabits, initialLogs }: Props) {
  const queryClient = useQueryClient();

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary
          state={{
            queries: [
              { queryKey: ["habitsLoggable"], state: { data: initialHabits } },
              { queryKey: ["logs"], state: { data: initialLogs } },
            ],
          }}
        >
          <div className="pb-20 min-h-screen bg-gray-50">
            <main className="max-w-md mx-auto pt-8 px-4">
              <h1 className="text-2xl font-bold mb-4">Your Habits</h1>

              <HabitDash />

              {/* Loading & Error States */}
              {/* {(habitsLoading || logsLoading) && <p>Loading…</p>}
              {(habitsError || logsError) && (
                <p className="text-red-500">
                  Failed to load habits. Try again later.
                </p>
              )} */}

              {/* No Habits */}
              {/* 
              {!habitsLoading && habits.length === 0 && (
                <p className="text-gray-400">No habits yet.</p>
              )} */}

              {/* Habit List */}
            </main>
          </div>
        </HydrationBoundary>
      </QueryClientProvider>
    </SessionProvider>
  );
}
