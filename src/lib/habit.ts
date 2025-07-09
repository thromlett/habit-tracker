export type Habit = {
  id: string;
  name: string;
  description?: string;
};

export type HabitLog = {
  id: string;
  habitId: string;
  completed: boolean;
  timeStamp: string;
};

export interface Schedule {
  type: "daysOfWeek" | "timePerWeek" | "customDates" | "interval";
  days?: string[];
  timesPerWeek?: number;
  customDates?: string[];
  interval?: number;
}

export interface CreateHabitBody {
  name: string;
  disposition: "GOOD" | "BAD";
  description: string;
  schedule: Schedule;
}

export async function createHabit(body: CreateHabitBody): Promise<Habit> {
  const res = await fetch("/api/habit", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || "Failed to create habit");
  }
  return res.json();
}
