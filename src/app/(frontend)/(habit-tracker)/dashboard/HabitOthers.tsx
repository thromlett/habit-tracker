"use client";
import React from "react";
import { isSameDay } from "@/utils/date";
import { HabitLog, Habit } from "@/lib/habit";

interface Props {
  habits: Habit[];
  logs: HabitLog[];
}

export default function HabitOthers({ habits, logs }: Props) {
  function getTodaysLog(habitId: string) {
    return logs.find(
      (l) => l.habitId === habitId && isSameDay(l.timeStamp, new Date())
    );
  }

  if (habits.length === 0)
    return <p className="text-gray-400">No habits yet.</p>;

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
          </div>
        );
      })}
    </div>
  );
}
