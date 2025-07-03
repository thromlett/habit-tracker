import { cookies } from "next/headers";

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

async function fetchWithSession<T>(path: string): Promise<T> {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();
  const cookieHeader = allCookies.map((c) => `${c.name}=${c.value}`).join("; ");

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${path}`, {
    cache: "no-store",
    headers: { cookie: cookieHeader },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${path}: ${res.status}`);
  return res.json();
}

export function getHabits(): Promise<Habit[]> {
  return fetchWithSession("/api/habit");
}

export function getLogs(): Promise<HabitLog[]> {
  return fetchWithSession("/api/habit/log");
}
