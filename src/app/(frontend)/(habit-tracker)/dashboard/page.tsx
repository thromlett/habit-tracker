"use client";
import { useEffect, useState } from "react";
import BottomBar from "../../../components/BottomBar";

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
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/habit").then((res) => res.json()),
      fetch("/api/habit/log").then((res) => res.json()),
    ])
      .then(([habitsData, logsData]) => {
        if (Array.isArray(habitsData) && Array.isArray(logsData)) {
          setHabits(habitsData);
          setLogs(logsData);
        } else {
          setHabits([]);
          setLogs([]);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function getTodaysLog(habitId: string) {
    const today = new Date();
    return logs.find(
      (log) => log.habitId === habitId && isSameDay(log.timeStamp, today)
    );
  }

  async function handleLog(habitId: string, completed: boolean) {
    setSubmitting(habitId);
    const res = await fetch("/api/habit/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId, completed }),
    });
    const data = await res.json();
    if (res.ok) {
      setLogs((logs) => [
        ...logs,
        {
          ...data,
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

  // SVG ICONS
  const CheckIcon = (
    <svg viewBox="0 0 20 20" fill="none" width={28} height={28}>
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.05" />
      <path
        d="M6 10.8l2.6 2.6 4.8-5.2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
  const XIcon = (
    <svg viewBox="0 0 20 20" fill="none" width={28} height={28}>
      <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.05" />
      <path
        d="M7 7l6 6m0-6l-6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <main className="max-w-md mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Your Habits</h1>
        {loading && <p>Loading...</p>}
        {!loading && habits.length === 0 && (
          <p className="text-gray-400">No habits yet.</p>
        )}
        <div className="space-y-4">
          {habits.map((habit) => {
            const log = getTodaysLog(habit.id);
            return (
              <div
                key={habit.id}
                className="bg-white rounded-xl p-4 shadow flex items-center justify-between"
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
      </main>
      <BottomBar />
    </div>
  );
}
