"use client";
import React, { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useCreateHabit } from "@/hooks/useCreateHabit";
import { CreateHabitBody, Schedule } from "@/lib/habit";

export default function CreatePageClient() {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <CreateHabitForm />
      </QueryClientProvider>
    </SessionProvider>
  );
}

function CreateHabitForm() {
  const { mutate, isPending, error, isSuccess } = useCreateHabit();
  const [name, setName] = useState("");
  const [disposition, setDisposition] = useState<"GOOD" | "BAD">("GOOD");
  const [description, setDescription] = useState("");
  const [frequency, setFrequency] = useState<Schedule["type"]>("daysOfWeek");
  const [daysSelected, setDaysSelected] = useState<string[]>([]);
  const [timesPerWeek, setTimesPerWeek] = useState<number | "">("");
  const [customDates, setCustomDates] = useState<string[]>([]);
  const [intervalValue, setIntervalValue] = useState<number | "">("");

  function handleDayToggle(day: string) {
    setDaysSelected((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  }

  function handleCustomDatesChange(e: React.ChangeEvent<HTMLInputElement>) {
    const dates = e.target.value
      .split(",")
      .map((d) => d.trim())
      .filter(Boolean);
    setCustomDates(dates);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body: CreateHabitBody = {
      name,
      disposition,
      description,
      schedule: {
        type: frequency,
        ...(frequency === "daysOfWeek" && { days: daysSelected }),
        ...(frequency === "timePerWeek" && {
          timesPerWeek: timesPerWeek as number,
        }),
        ...(frequency === "customDates" && { customDates }),
        ...(frequency === "interval" && { interval: intervalValue as number }),
      },
    };
    mutate(body);
  }

  const weekdays = [
    "SONDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <main className="max-w-md mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Create Habit</h1>
        <form
          className="bg-white rounded-xl shadow p-6 space-y-4"
          onSubmit={handleSubmit}
        >
          {/* Name */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Habit Name
            </label>
            <input
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="e.g. Meditate"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          {/* Frequency */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Frequency
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={frequency}
              onChange={(e) => setFrequency(e.target.value as Schedule["type"])}
              required
            >
              <option value="daysOfWeek">Specific Days</option>
              <option value="timePerWeek">Times Per Week</option>
              <option value="customDates">Custom Dates</option>
              <option value="interval">Every N Days</option>
            </select>
          </div>

          {/* Conditional Inputs */}
          {frequency === "daysOfWeek" && (
            <div className="space-y-2">
              <label className="block text-sm font-semibold mb-1">
                Select Days
              </label>
              <div className="flex flex-wrap gap-2">
                {weekdays.map((day) => (
                  <button
                    type="button"
                    key={day}
                    onClick={() => handleDayToggle(day)}
                    className={`px-3 py-1 border rounded-full ${
                      daysSelected.includes(day)
                        ? "bg-blue-500 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {frequency === "timePerWeek" && (
            <div>
              <label className="block text-sm font-semibold mb-1">
                Times per Week
              </label>
              <input
                type="number"
                min={1}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={timesPerWeek}
                onChange={(e) => setTimesPerWeek(Number(e.target.value))}
                required
              />
            </div>
          )}

          {frequency === "customDates" && (
            <div>
              <label className="block text-sm font-semibold mb-1">
                Custom Dates
              </label>
              <input
                type="text"
                placeholder="YYYY-MM-DD, YYYY-MM-DD,..."
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                onChange={handleCustomDatesChange}
                required
              />
            </div>
          )}

          {frequency === "interval" && (
            <div>
              <label className="block text-sm font-semibold mb-1">
                Interval (days)
              </label>
              <input
                type="number"
                min={1}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
                value={intervalValue}
                onChange={(e) => setIntervalValue(Number(e.target.value))}
                required
              />
            </div>
          )}

          {/* Disposition */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Habit Type
            </label>
            <select
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              value={disposition}
              onChange={(e) => setDisposition(e.target.value as "GOOD" | "BAD")}
              required
            >
              <option value="GOOD">Good Habit</option>
              <option value="BAD">Bad Habit</option>
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-blue-500"
              placeholder="Describe your habit and its purpose"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition"
          >
            {isPending ? "Adding..." : "Add Habit"}
          </button>

          {error && <p className="text-red-500">{error.message}</p>}
          {isSuccess && <p className="text-green-600">Habit created!</p>}
        </form>
      </main>
    </div>
  );
}
