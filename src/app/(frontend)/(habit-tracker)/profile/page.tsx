"use client";
import { useEffect, useState } from "react";
import BottomBar from "../../../components/BottomBar";

export default function ProfilePage() {
  const [userName, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const [nameRes, emailRes] = await Promise.all([
          fetch("/api/profile/name"),
          fetch("/api/profile/email"),
        ]);
        const nameData = await nameRes.json();
        const emailData = await emailRes.json();
        setName(nameData.userName || "");
        setEmail(emailData.email || "");
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setName("Unknown");
        setEmail("Unknown");
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, []);

  return (
    <div className="pb-20 min-h-screen bg-gray-50">
      <main className="max-w-md mx-auto pt-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        <div className="bg-white rounded-xl shadow p-6 space-y-2">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-blue-200 flex items-center justify-center text-2xl font-bold text-blue-700">
              {loading ? "…" : userName?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <div className="font-semibold text-lg">
                {loading ? "Loading..." : userName}
              </div>
              <div className="text-gray-500 text-sm">
                {loading ? "Loading..." : email}
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div>
            <span className="block text-gray-700 font-medium mb-1">Streak</span>
            <span className="text-blue-700 font-bold text-xl">4 days</span>
          </div>
          {/* Add more settings/info here */}
        </div>
      </main>
      <BottomBar />
    </div>
  );
}
