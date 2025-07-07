"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { HabitLog } from "@/lib/habit";

export function useLogHabit() {
  const queryClient = useQueryClient();
  return useMutation(
    async ({ habitId, completed }: { habitId: string; completed: boolean }) => {
      const res = await fetch("/api/habit/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ habitId, completed }),
      });
      if (!res.ok) throw new Error("Failed to log habit");
      return res.json() as Promise<HabitLog>;
    },
    {
      onSuccess: (newLog) => {
        queryClient.setQueryData<HabitLog[]>(["logs"], (old = []) => [
          ...old,
          newLog,
        ]);
      },
    }
  );
}
