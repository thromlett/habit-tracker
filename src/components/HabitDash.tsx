"use client";
import React from "react";
import { useLoggableHabit, useLogs } from "@/hooks/";
import { isSameDay } from "@/utils/date";
import { HabitLog } from "@/lib/habit";
import { CheckIcon, XIcon } from "./svgs/icons";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export default function HabitDash() {
  const queryClient = useQueryClient();
  const [submitting, setSubmitting] = useState<string | null>(null);

  const { data: habits = [], isLoading: loadingH } = useLoggableHabit();
  const { data: logs = [], isLoading: loadingL } = useLogs();
  const loading = loadingH || loadingL;

  function getTodaysLog(habitId: string) {
    return logs.find(
      (l) => l.habitId === habitId && isSameDay(l.timeStamp, new Date())
    );
  }

  if (loading) return <p>Loading…</p>;
  if (habits.length === 0)
    return <p className="text-gray-400">No habits yet.</p>;

  // Handle logging a habit
  async function handleLog(habitId: string, completed: boolean) {
    setSubmitting(habitId);
    const res = await fetch("/api/habit/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId, completed }),
    });
    const data = await res.json();
    if (res.ok) {
      // Update React Query cache without refetch
      queryClient.setQueryData<HabitLog[]>(["logs"], (old = []) => [
        ...old,
        {
          id: data.id,
          habitId,
          completed,
          timeStamp: data.timeStamp || new Date().toISOString(),
        },
      ]);
    } else {
      alert(data.error || "Failed to log habit");
    }
    setSubmitting(null);
  }

  return (
    <div className="space-y-4">
      {habits.map((habit) => {
        const log = getTodaysLog(habit.id);
        const isLogged = !!log;
        return (
          <div
            key={habit.id}
            className={
              "bg-white rounded-xl p-4 shadow flex items-center justify-between" +
              (isLogged ? " opacity-60 pointer-events-none grayscale" : "")
            }
          >
            <div>
              <span className="font-semibold">{habit.name}</span>
              {habit.description && (
                <div className="text-gray-500 text-sm">{habit.description}</div>
              )}
              <div className="text-xs mt-1 text-gray-400">
                {log
                  ? log.completed
                    ? "Accomplished today"
                    : "Marked not accomplished today"
                  : "Not yet logged today"}
              </div>
            </div>

            <div className="flex gap-2 ml-4">
              <button
                aria-label="Accomplished"
                className={`rounded-full p-2 text-2xl border ${
                  log
                    ? log.completed
                      ? "bg-green-100 text-green-600 border-green-400"
                      : "bg-gray-100 text-gray-400 border-gray-300"
                    : "hover:bg-green-100 hover:text-green-700 border-green-300"
                }`}
                disabled={!!log || submitting === habit.id}
                onClick={() => handleLog(habit.id, true)}
              >
                {CheckIcon}
              </button>

              <button
                aria-label="Not accomplished"
                className={`rounded-full p-2 text-2xl border ${
                  log
                    ? !log.completed
                      ? "bg-red-100 text-red-600 border-red-400"
                      : "bg-gray-100 text-gray-400 border-gray-300"
                    : "hover:bg-red-100 hover:text-red-700 border-red-300"
                }`}
                disabled={!!log || submitting === habit.id}
                onClick={() => handleLog(habit.id, false)}
              >
                {XIcon}
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
