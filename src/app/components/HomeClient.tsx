'use client';

import { useState } from "react";
import { FiPlus, FiCheckCircle } from "react-icons/fi";

interface User {
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role?: string | null;
}

// Define a type for a habit
interface Habit {
  id: number;
  name: string;
  progress: number;
  target: number;
}

interface HomeClientProps {
  user: User;
}

export default function HomeClient({ user }: HomeClientProps) {
  // Dummy data; fetch real habits in production
  const [habits, setHabits] = useState<Habit[]>([
    { id: 1, name: "Drink Water", progress: 5, target: 7 },
    { id: 2, name: "Read 10 Pages", progress: 2, target: 1 },
    { id: 3, name: "Walk 5,000 Steps", progress: 4, target: 7 },
  ]);

  const handleCheckOff = (id: number) => {
    setHabits(habits =>
      habits.map(habit =>
        habit.id === id
          ? { ...habit, progress: Math.min(habit.progress + 1, habit.target) }
          : habit
      )
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-100 via-white to-blue-50">
      <header className="flex items-center justify-between px-6 py-6 bg-white shadow-sm rounded-b-3xl">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hi, {user?.name || "Friend"} 👋</h1>
          <p className="text-gray-500 text-sm">Lets build some good habits today!</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-200 flex items-center justify-center text-xl font-bold text-blue-700">
          {user?.name?.charAt(0) || "U"}
        </div>
      </header>

      <main className="px-6 pt-4 pb-10 max-w-lg mx-auto">
        {/* Motivational Quote */}
        <div className="bg-blue-50 rounded-xl p-4 shadow flex items-center mb-6">
          <span className="text-blue-600 font-medium mr-2">🔥</span>
          <span className="text-gray-700 text-sm">“Success is the sum of small efforts, repeated day in and day out.”</span>
        </div>

        {/* Habits List */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">Your Habits</h2>
          <button className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition text-sm">
            <FiPlus className="text-xl" />
            Add Habit
          </button>
        </div>
        <div className="space-y-4">
          {habits.map(habit => (
            <div key={habit.id} className="bg-white rounded-xl shadow p-4 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{habit.name}</div>
                <div className="w-32 bg-gray-100 rounded-full h-2 mt-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(100, (habit.progress / habit.target) * 100)}%` }}
                  />
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {habit.progress >= habit.target
                    ? "Completed today!"
                    : `${habit.progress}/${habit.target} today`}
                </div>
              </div>
              <button
                className={`ml-4 p-2 rounded-full transition ${
                  habit.progress >= habit.target
                    ? "bg-green-100 text-green-500"
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
                disabled={habit.progress >= habit.target}
                onClick={() => handleCheckOff(habit.id)}
                title="Check off for today"
              >
                <FiCheckCircle className="text-2xl" />
              </button>
            </div>
          ))}
        </div>

        {/* Streak / Summary */}
        <div className="mt-8 text-center text-gray-600 text-sm">
          <span className="inline-flex items-center gap-1">
            <span className="text-xl">🏆</span>
            Current streak: <span className="font-bold text-blue-700 ml-1">4 days</span>
          </span>
        </div>
      </main>
    </div>
  );
}
