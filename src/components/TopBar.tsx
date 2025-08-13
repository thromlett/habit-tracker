"use client";
import React from "react";

interface TopBarProps {
  tabs: string[];
  selectedTab: string;
  onSelectTab: (tab: string) => void;
  notificationCount?: number;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
}

export default function TopBar({
  tabs,
  selectedTab,
  onSelectTab,
  notificationCount = 0,
}: TopBarProps) {
  return (
    <div className="bg-white shadow">
      {/* First row: Profile icon, title, notification */}
      <div className="flex items-center justify-center px-4 py-3">
        <h1 className="text-lg font-semibold text-gray-800">Feed</h1>
        <div className="relative">
          {notificationCount > 0 && (
            <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
              {notificationCount}
            </span>
          )}
        </div>
      </div>

      {/* Second row: Tabs */}
      <div className="flex justify-center space-x-8 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onSelectTab(tab)}
            className={`py-2 text-sm font-medium ${
              selectedTab === tab
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
