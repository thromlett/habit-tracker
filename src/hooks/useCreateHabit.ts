"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHabit, CreateHabitBody, Habit } from "@/lib/habit";

export function useCreateHabit() {
  const queryClient = useQueryClient();
  return useMutation<Habit, Error, CreateHabitBody, unknown>({
    mutationFn: (body: CreateHabitBody) => createHabit(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
      queryClient.invalidateQueries({ queryKey: ["logs"] });
    },
  });
}
