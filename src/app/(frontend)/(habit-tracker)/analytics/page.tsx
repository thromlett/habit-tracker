"use client";
import { redirect } from "next/navigation";
export default function AnalyticsPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <main className="min-h-screen bg-gray-50 flex items-center justify-center">
        <button
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          onClick={() => redirect("/mobile-testing")}
        >
          poop fart
        </button>
      </main>
    </div>
  );
}
