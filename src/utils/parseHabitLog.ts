// utils/parseHabitLogs.ts

export interface HabitLog {
  id: string;
  habitId: string;
  completed: boolean;
  timeStamp: string; // ISO string, e.g. "2025-08-01T18:20:30.108Z"
  // …we don’t actually use the inner `habit` object here
}

/**
 * Given a list of habit‐completion logs, count how many times
 * the user logged in each day of the given year/month.
 *
 * @param logs – array of HabitLog
 * @param year – full year, e.g. 2025
 * @param month – 1–12 for Jan–Dec
 * @returns a map where keys are day numbers (1–31) and values are counts
 */
export function parseHabitLogsToHeatmapData(
  logs: HabitLog[],
  year: number,
  month: number
): Record<number, number> {
  const counts: Record<number, number> = {};

  for (const log of logs) {
    // only count successful completions
    if (!log.completed) continue;

    const d = new Date(log.timeStamp);
    const logYear = d.getUTCFullYear();
    const logMonth = d.getUTCMonth() + 1;
    // if you prefer local‐timezone grouping, replace the two lines above with:
    // const logYear  = d.getFullYear();
    // const logMonth = d.getMonth() + 1;

    if (logYear === year && logMonth === month) {
      const day = d.getUTCDate(); // or d.getDate() for local
      counts[day] = (counts[day] || 0) + 1;
    }
  }

  return counts;
}
