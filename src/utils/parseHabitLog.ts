// src/utils/date.ts

/**
 * Formats any JS-parsable UTC timestamp into YYYY/MM/DD.
 *
 * @param timestamp A number (ms since epoch), ISO string, or Date instance
 * @returns         A date string like "2025/08/04"
 */
export function formatUTCDate(timestamp: number | string | Date): string {
  const date = new Date(timestamp);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");
  return `${year}/${month}/${day}`;
}

/**
 * Log entry shape (you can expand this if you want more fields)
 */
interface LogEntry {
  timeStamp: string;
  completed: boolean;
}

/**
 * One heat-map data point
 */
export interface HeatMapValue {
  date: string;
  count: number;
}

/**
 * Convert an array of timestamped logs into HeatMap-ready data:
 *  - only counts entries where `completed === true`
 *  - groups them by UTC day (YYYY/MM/DD)
 *  - returns a sorted array of { date, count }
 *
 * @param logs Array of objects with at least { timeStamp, completed }
 */
export function toHeatMapValues(logs: LogEntry[]): HeatMapValue[] {
  const counts: Record<string, number> = {};

  for (const { timeStamp /* , completed */ } of logs) {
    // if (!completed) continue;  fills out heatmap if not completed. Make cause a different color in future.
    const day = formatUTCDate(timeStamp);
    counts[day] = (counts[day] || 0) + 1;
  }

  return (
    Object.entries(counts)
      // sort by date string (YYYY/MM/DD lex order works)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, count]) => ({ date, count }))
  );
}
