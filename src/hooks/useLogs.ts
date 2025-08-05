"use client";

import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { HabitLog } from "@/lib/habit";

export async function fetchLogs(): Promise<HabitLog[]> {
  const res = await fetch("/api/habit/log", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch logs");
  return res.json();
}

export function useLogs(
  queryKey: unknown[] = ["logs"],
  options?: Omit<UseQueryOptions<HabitLog[], Error>, "queryKey" | "queryFn">
) {
  return useQuery<HabitLog[]>({
    queryKey,
    queryFn: fetchLogs,
    staleTime: 1000 * 60,
    ...options,
  });
}
