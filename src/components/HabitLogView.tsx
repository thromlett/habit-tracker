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

const CheckIcon = (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    width={28}
    height={28}
    style={{ color: "green" }}
  >
    <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.05" />
    <path
      d="M6 10.8l2.6 2.6 4.8-5.2"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const XIcon = (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    width={28}
    height={28}
    style={{ color: "red" }}
  >
    <circle cx="10" cy="10" r="10" fill="currentColor" opacity="0.05" />
    <path
      d="M7 7l6 6m0-6l-6 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const DeleteIcon = (
  <svg
    viewBox="0 0 80 28"
    fill="none"
    width={80}
    height={28}
    style={{ color: "red" }}
  >
    <rect
      x="0"
      y="0"
      width="80"
      height="28"
      rx="8"
      fill="currentColor"
      opacity="0.20"
    />
    <text
      x="40"
      y="16"
      textAnchor="middle"
      fontSize="16"
      fontFamily="Arial, sans-serif"
      fontWeight="bold"
      fill="currentColor"
      opacity="0.9"
      dominantBaseline="middle"
    >
      DELETE
    </text>
  </svg>
);

export default function HabitLogsView({
  habit,
  logs,
  onBack,
  onDelete,
}: {
  habit: Habit;
  logs: HabitLog[];
  onBack: () => void;
  onDelete: () => void;
}) {
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime()
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={onBack}
          className="text-blue-600 underline text-sm flex items-center"
        >
          <BackButton className="inline mr-1" />
        </button>
        <button onClick={onDelete} className="text-red-600 underline text-sm">
          {DeleteIcon}
        </button>
      </div>
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
                {log.completed ? CheckIcon : XIcon}{" "}
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
