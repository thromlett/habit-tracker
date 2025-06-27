// bugged: back end logic for displaying habits should be disconnected from dashobard logic
"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import BottomBar from "../../../components/BottomBar";
import HabitLogView from "../../../components/HabitLogView";

// Types for your habits and logs
type Habit = {
  id: string;
  name: string;
  description?: string;
};

type HabitLog = {
  id: string;
  habitId: string;
  completed: boolean;
  timeStamp: string;
};

// Fetcher functions
const fetchHabits = (): Promise<Habit[]> =>
  fetch("/api/habit").then((res) => res.json());

const fetchLogs = (): Promise<HabitLog[]> =>
  fetch("/api/habit/log").then((res) => res.json());

// Utility to compare dates
function isSameDay(a: string | Date, b: string | Date) {
  const da = new Date(a);
  const db = new Date(b);
  return (
    da.getFullYear() === db.getFullYear() &&
    da.getMonth() === db.getMonth() &&
    da.getDate() === db.getDate()
  );
}

export default function DashboardPage() {
  //const queryClient = useQueryClient();
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  // Queries for habits and logs
  const {
    data: habits = [],
    isLoading: habitsLoading,
    error: habitsError,
  } = useQuery({
    queryKey: ["habits"],
    queryFn: fetchHabits,
  });

  const {
    data: logs = [],
    isLoading: logsLoading,
    error: logsError,
  } = useQuery({
    queryKey: ["logs"],
    queryFn: fetchLogs,
  });

  // Find today's log for a habit
  function getTodaysLog(habitId: string) {
    const today = new Date();
    return logs.find(
      (log) => log.habitId === habitId && isSameDay(log.timeStamp, today)
    );
  }

  // Combined loading & error states
  const isLoading = habitsLoading || logsLoading;
  const isError = Boolean(habitsError || logsError);

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <main className="max-w-md mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold mb-4">
          {selectedHabit ? selectedHabit.name : "Your Habits"}
        </h1>

        {/* Loading & Error States */}
        {isLoading && <p>Loading…</p>}
        {isError && (
          <p className="text-red-500">
            Failed to load habits. Try again later.
          </p>
        )}

        {/* No Habits */}
        {!isLoading && !selectedHabit && habits.length === 0 && (
          <p className="text-gray-400">No habits yet.</p>
        )}

        {/* Habit List */}
        {!selectedHabit && (
          <div className="space-y-4">
            {habits.map((habit) => {
              const log = getTodaysLog(habit.id);
              return (
                <div
                  key={habit.id}
                  className="bg-white rounded-xl p-4 shadow flex items-center justify-between cursor-pointer"
                  onClick={() => setSelectedHabit(habit)}
                >
                  <div>
                    <span className="font-semibold">{habit.name}</span>
                    {habit.description && (
                      <div className="text-gray-500 text-sm">
                        {habit.description}
                      </div>
                    )}
                    <div className="text-xs mt-1 text-gray-400">
                      {log
                        ? log.completed
                          ? "Accomplished today"
                          : "Marked not accomplished today"
                        : "Not yet logged today"}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Habit Log View */}
        {selectedHabit && (
          <HabitLogView
            habit={selectedHabit}
            logs={logs.filter((log) => log.habitId === selectedHabit.id)}
            onBack={() => setSelectedHabit(null)}
            onDelete={async () => {
              if (!selectedHabit) return;
              await fetch(`/api/habit/${selectedHabit.id}`, {
                method: "DELETE",
              });
              setSelectedHabit(null);
            }}
          />
        )}
      </main>

      <BottomBar />
    </div>
  );
}
