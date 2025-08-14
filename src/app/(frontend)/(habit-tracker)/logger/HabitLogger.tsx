"use client";
import React, { useState } from "react";
import {
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query";
import { Habit, HabitLog } from "@/lib/habit";
import HabitList from "./HabitList";
import HabitLogView from "./HabitLogView";
import { SessionProvider } from "next-auth/react";

interface Props {
  initialHabits: Habit[];
  initialLogs: HabitLog[];
}

export default function HabitLogger({ initialHabits, initialLogs }: Props) {
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);
  const [queryClient] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <HydrationBoundary
          state={{
            queries: [
              { queryKey: ["habits"], state: { data: initialHabits } },
              { queryKey: ["logs"], state: { data: initialLogs } },
            ],
          }}
        >
          <div className="pb-20 min-h-screen bg-gray-50">
            <main className="max-w-md mx-auto pt-8 px-4">
              <h1 className="text-2xl font-bold mb-4">
                {selectedHabit ? selectedHabit.name : "Your Habits"}
              </h1>

              {/* List or Detail View */}
              {selectedHabit ? (
                <HabitLogView
                  habit={selectedHabit}
                  logs={initialLogs.filter(
                    (log) => log.habitId === selectedHabit.id
                  )}
                  onBack={() => setSelectedHabit(null)}
                  onDelete={async () => {
                    if (!selectedHabit) return;
                    const id = selectedHabit.id;

                    // Optimistic update for instant UI feedback
                    queryClient.setQueryData<Habit[]>(["habits"], (old) =>
                      (old ?? []).filter((h) => h.id !== id)
                    );
                    queryClient.setQueryData<HabitLog[]>(["logs"], (old) =>
                      (old ?? []).filter((l) => l.habitId !== id)
                    );
                    setSelectedHabit(null);

                    try {
                      const res = await fetch("/api/habit", {
                        method: "DELETE",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ habitId: id }),
                      });
                      if (!res.ok) {
                        const msg = await res.text().catch(() => "");
                        console.error(
                          "Failed to delete habit:",
                          res.status,
                          msg
                        );
                      }
                    } catch (err) {
                      console.error("Delete request failed:", err);
                    } finally {
                      // Ensure server truth after optimistic change
                      await queryClient.invalidateQueries({
                        queryKey: ["habits"],
                      });
                      await queryClient.invalidateQueries({
                        queryKey: ["logs"],
                      });
                    }
                  }}
                />
              ) : (
                <HabitList onSelect={setSelectedHabit} />
              )}
            </main>
          </div>
        </HydrationBoundary>
      </QueryClientProvider>
    </SessionProvider>
  );
}
