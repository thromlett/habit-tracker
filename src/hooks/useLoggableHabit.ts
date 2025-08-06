"use client";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { Habit } from "@/lib/habit";
import { useSession } from "next-auth/react";

export async function fetchLoggableHabits(): Promise<Habit[]> {
  const res = await fetch("/api/habit/loggable", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch habits");
  return res.json();
}

export function useLoggableHabit(
  queryKey: unknown[] = ["habitsLoggable"],
  options?: Omit<UseQueryOptions<Habit[], Error>, "queryKey" | "queryFn">
) {
  const { status } = useSession();
  return useQuery<Habit[]>({
    queryKey,
    queryFn: fetchLoggableHabits,
    staleTime: 1000 * 60,
    enabled: status === "authenticated",
    ...options,
  });
}
