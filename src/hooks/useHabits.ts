"use client";
import { useQuery } from "@tanstack/react-query";
import { Habit } from "@/lib/habit";

export async function fetchHabits(): Promise<Habit[]> {
  const res = await fetch("/api/habit");
  if (!res.ok) throw new Error("Failed to fetch habits");
  return res.json();
}

export function useHabits() {
  return useQuery<Habit[]>({
    queryKey: ["habits"],
    queryFn: fetchHabits,
    staleTime: 1000 * 60, // 1 minute
  });
}
