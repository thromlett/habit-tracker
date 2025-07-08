"use client";
import { useQuery } from "@tanstack/react-query";
import { Habit } from "@/lib/habit";
import { useSession } from "next-auth/react";

export async function fetchLoggableHabits(): Promise<Habit[]> {
  const res = await fetch("/api/habit/loggable", { credentials: "include" });
  if (!res.ok) throw new Error("Failed to fetch habits");
  return res.json();
}

export function useLoggableHabit() {
  const { status } = useSession();
  return useQuery<Habit[]>({
    queryKey: ["habitsLoggable"],
    queryFn: fetchLoggableHabits,
    staleTime: 1000 * 60,
    enabled: status === "authenticated",
  });
}
