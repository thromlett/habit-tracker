import { HeatmapCalendar } from "@/components/Heatmap";
export default function AnalyticsPage() {
  const julyData = Object.fromEntries(
    Array.from({ length: 31 }, (_, i) => {
      const day = i + 1;
      return [day, Math.floor(Math.random() * 13)];
    })
  );
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <HeatmapCalendar year={2025} month={7} data={julyData} />
      </main>
    </div>
  );
}
