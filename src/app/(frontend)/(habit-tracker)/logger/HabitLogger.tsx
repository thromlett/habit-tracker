"use client";
import React, { useState } from "react";
import {
  useQueryClient,
  QueryClient,
  QueryClientProvider,
  HydrationBoundary,
} from "@tanstack/react-query";
import { Habit, HabitLog } from "@/lib/habit";
//import { useHabits, useLogs } from "@/hooks/";
import HabitList from "./HabitList";
import HabitLogView from "./HabitLogView";
import { SessionProvider } from "next-auth/react";

interface Props {
  initialHabits: Habit[];
  initialLogs: HabitLog[];
}

export default function HabitLogger({ initialHabits, initialLogs }: Props) {
  const qc = useQueryClient();
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
                    await fetch(`/api/habit/${selectedHabit.id}`, {
                      method: "DELETE",
                    });
                    qc.invalidateQueries({ queryKey: ["habits"] });
                    qc.invalidateQueries({ queryKey: ["logs"] });
                    setSelectedHabit(null);
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
