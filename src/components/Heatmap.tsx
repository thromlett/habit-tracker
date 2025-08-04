// components/HeatmapCalendar.tsx
import React from "react";

export interface HeatmapCalendarProps {
  year: number;
  month: number; // 1 = January, 12 = December
  data: Record<number, number>;
}

const COLOR_STEPS = [
  "bg-gray-100", // 0
  "bg-green-100", // 1–2
  "bg-green-200", // 3–5
  "bg-green-300", // 6–9
  "bg-green-500", // 10+
];

function getColorClass(count: number): string {
  if (count === 0) return COLOR_STEPS[0];
  if (count < 3) return COLOR_STEPS[1];
  if (count < 6) return COLOR_STEPS[2];
  if (count < 10) return COLOR_STEPS[3];
  return COLOR_STEPS[4];
}

export const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({
  year,
  month,
  data,
}) => {
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const totalSlots = Math.ceil((firstDayOfWeek + daysInMonth) / 7) * 7;
  const slots: (number | null)[] = Array.from({ length: totalSlots }).map(
    (_, idx) => {
      const d = idx - firstDayOfWeek + 1;
      return d >= 1 && d <= daysInMonth ? d : null;
    }
  );

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-2xl shadow">
      <h2 className="text-center text-2xl font-semibold mb-4">
        {new Date(year, month - 1).toLocaleString("default", { month: "long" })}
        , {year}
      </h2>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-0.5 text-xs text-gray-500 mb-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-0.5 text-center">
        {slots.map((day, i) => {
          const count = day ? data[day] || 0 : 0;
          const bg = day ? getColorClass(count) : "bg-transparent";
          return (
            <div
              key={i}
              className={`
                w-8 h-6 flex items-center justify-center
                rounded-md text-xs font-normal
                ${bg} ${day ? "text-gray-700" : ""}
              `}
            >
              {day ?? ""}
            </div>
          );
        })}
      </div>
    </div>
  );
};
