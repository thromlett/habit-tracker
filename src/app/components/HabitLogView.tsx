"use client";
import BottomBar from "./BottomBar";

type Habit = {
  id: string;
  name: string;
  description?: string;
};

type HabitLog = {
  id: string;
  habitId: string;
  completed: boolean;
  timeStamp: string;
};

const BackButton = ({ size = 24, color = "currentColor", ...props }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke={color}
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 18l-6-6 6-6" />
  </svg>
);

export default function HabitLogsView({
  habit,
  logs,
  onBack,
}: {
  habit: Habit;
  logs: HabitLog[];
  onBack: () => void;
}) {
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime()
  );

  return (
    <div>
      <button onClick={onBack} className="mb-4 text-blue-600 underline text-sm">
        {<BackButton className="inline mr-1" />}
      </button>
      <div className="mb-2 font-semibold">
        All Logs for <q>{habit.name}</q>
      </div>
      {sortedLogs.length === 0 ? (
        <div className="text-gray-400">No logs yet.</div>
      ) : (
        <ul className="space-y-1">
          {sortedLogs.map((log) => (
            <li
              key={log.id}
              className="flex justify-between items-center px-2 py-1 border-b last:border-b-0"
            >
              <span>
                {log.completed ? "✅" : "❌"}{" "}
                {new Date(log.timeStamp).toLocaleDateString()}{" "}
                {new Date(log.timeStamp).toLocaleTimeString()}
              </span>
            </li>
          ))}
        </ul>
      )}
      <BottomBar />
    </div>
  );
}
