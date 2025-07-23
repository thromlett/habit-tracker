"use client";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
// import { SessionProvider } from "next-auth/react";
// import { redirect } from "next/navigation";

import React from "react";

interface MenuItem {
  label: string;
  icon: string;
  badge?: string | null;
  onClick?: () => void;
}

const Logout = () => {
  signOut({
    callbackUrl: "/",
  });
};

export default function ProfilePage() {
  const [userName, setName] = useState<string | null>(null);
  const [streak, setStreak] = useState<string | null>(null);
  const [age, setAge] = useState<string | null>(null);

  //const { data: session } = useSession();

  useEffect(() => {
    async function fetchProfile() {
      try {
        //Change to load in parallel later
        const [nameRes] = await Promise.all([fetch("/api/profile/name")]);
        const [streakRes] = await Promise.all([fetch("/api/habit/streak")]);
        const [ageRes] = await Promise.all([fetch("/api/profile/age")]);
        const nameData = await nameRes.json();
        const streakData = await streakRes.json();
        const ageData = await ageRes.json();
        setName(nameData.userName || "");
        setStreak(streakData.streak);
        setAge(ageData.accountAge || "0");
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setName("Unknown");
      } finally {
      }
    }
    fetchProfile();
  }, []);

  const menuItems: MenuItem[] = [
    { label: "My Profile", icon: "👤", badge: null },
    {
      label: "Log Out",
      icon: "💬",
      badge: null,
      onClick: Logout,
    },
    { label: "Premium", icon: "👤", badge: null },
    { label: "Acheivements", icon: "👤", badge: null },
    { label: "Friends", icon: "👤", badge: null },
    { label: "Support/Feedback", icon: "👤", badge: null },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow">
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-gray-600">Streak</span>
          <span className="text-lg font-bold text-gray-800">{streak}</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center" />
          <span className="mt-2 text-lg font-semibold text-gray-800">
            {userName}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <span className="text-sm font-medium text-gray-600">
            Days Tracking
          </span>
          <span className="text-lg font-bold text-gray-800">{age}</span>
        </div>
      </div>

      {/* Menu List */}
      <div className="mt-4 bg-white">
        <ul>
          {menuItems.map((item, idx) => (
            <li
              key={idx}
              onClick={item.onClick}
              className="flex items-center justify-between px-4 py-4 border-t last:border-b cursor-pointer hover:bg-gray-50"
            >
              <div className="flex items-center space-x-4">
                <span className="text-xl">{item.icon}</span>
                <span className="text-base text-gray-800 font-medium">
                  {item.label}
                </span>
                {item.badge && (
                  <span className="ml-2 px-2 py-0.5 text-xs font-semibold text-white bg-blue-500 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-gray-400">›</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
