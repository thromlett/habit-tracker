//DELETE LATER
"use client";
import { useEffect, useState } from "react";
import BottomBar from "../../components/BottomBar";
import HabitLogView from "../../components/HabitLogView";

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
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/api/habit").then((res) => res.json()),
      fetch("/api/habit/log").then((res) => res.json()),
    ])
      .then(([habitsData, logsData]) => {
        setHabits(habitsData);
        setLogs(logsData);
      })
      .finally(() => setLoading(false));
  }, []);

  function getTodaysLog(habitId: string) {
    const today = new Date();
    return logs.find(
      (log) => log.habitId === habitId && isSameDay(log.timeStamp, today)
    );
  }

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <main className="max-w-md mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold mb-4">
          {selectedHabit ? selectedHabit.name : "Your Habits"}
        </h1>
        {loading && <p>Loading...</p>}
        {!loading && !selectedHabit && habits.length === 0 && (
          <p className="text-gray-400">No habits yet.</p>
        )}
        {/* If no habit is selected, show list */}
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
        {/* If a habit is selected, show its logs */}
        {selectedHabit && (
          <HabitLogView
            habit={selectedHabit}
            logs={logs.filter((log) => log.habitId === selectedHabit.id)}
            onBack={() => setSelectedHabit(null)}
          />
        )}
      </main>
      <BottomBar />
    </div>
  );
}
