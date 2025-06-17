// hooks/useDashboardHabits.ts
import { useState, useEffect } from "react";

export type DashboardHabit = {
  id: string;
  name: string;
  current: number; // Progress this week/session
  goal: number; // Weekly goal, etc.
  unit: string; // "days this week", "pages", etc.
};

export function useDashboardHabits() {
  const [habits, setHabits] = useState<DashboardHabit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch("/api/habits") // Your backend endpoint
      .then((res) => res.json())
      .then((data) => setHabits(data))
      .finally(() => setLoading(false));
  }, []);

  return { habits, loading };
}
