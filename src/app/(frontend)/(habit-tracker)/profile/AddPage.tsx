"use client";
import React from "react";
import { useRouter } from "next/navigation";

interface Friend {
  id: string;
  name: string;
  avatarUrl: string;
  followers: number;
}

interface FollowingPageProps {
  onBack: () => void;
}

export default function AddPage({ onBack }: FollowingPageProps) {
  const router = useRouter();

  // Sample data; replace with real data or fetch logic
  const friends: Friend[] = [
    {
      id: "1",
      name: "Will display friend of friends and top followed users",
      avatarUrl: "/avatars/mkmo.jpg",
      followers: 38,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow">
        <button
          onClick={onBack}
          className="text-gray-800 text-base font-medium"
        >
          &larr; Back
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Following</h1>
        <button
          onClick={() => router.push("/add-friend")}
          className="text-gray-800 text-xl font-bold"
        >
          +
        </button>
      </div>

      {/* Friends List */}
      <div className="mt-4 bg-white">
        <ul>
          {friends.map((friend) => (
            <li
              key={friend.id}
              onClick={() => console.log(`Clicked ${friend.name}`)}
              className="flex items-center px-4 py-4 border-t last:border-b cursor-pointer hover:bg-gray-50"
            >
              {/*               <img
                src={friend.avatarUrl}
                alt={friend.name}
                className="w-10 h-10 rounded-full object-cover"
              /> */}
              <div className="ml-4 flex-grow">
                <p className="text-base font-medium text-gray-800">
                  {friend.name}
                </p>
                <p className="text-sm text-gray-600">
                  {friend.followers} followers
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
