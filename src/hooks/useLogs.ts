"use client";
import { useQuery } from "@tanstack/react-query";
import { HabitLog } from "@/lib/habit";

export async function fetchLogs(): Promise<HabitLog[]> {
  const res = await fetch("/api/habit/log");
  if (!res.ok) throw new Error("Failed to fetch logs");
  return res.json();
}

export function useLogs() {
  return useQuery<HabitLog[]>({
    queryKey: ["logs"],
    queryFn: fetchLogs,
    staleTime: 1000 * 60,
  });
}
