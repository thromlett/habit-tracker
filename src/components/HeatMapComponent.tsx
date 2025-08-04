import HeatMap from "@uiw/react-heat-map";
import { toHeatMapValues } from "@/utils/parseHabitLog";
import { HabitLog } from "@/lib/habit";

export default function HeatMapComponent({ logs }: { logs: HabitLog[] }) {
  if (!logs || logs.length === 0) {
    return <p className="text-gray-400">No logs available.</p>;
  }
  return (
    <div className="mb-8 overflow-x-auto">
      <div className="min-w-max">
        <HeatMap
          value={toHeatMapValues(logs)}
          startDate={new Date("2025/01/01")}
          endDate={new Date("2025/12/31")}
          width={720}
          className="inline-block"
        />
      </div>
    </div>
  );
}
