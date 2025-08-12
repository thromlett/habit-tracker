"use client";
import React from "react";
import HabitOther from "../dashboard/HabitOthers";
import { HabitLog, Habit } from "@/lib/habit";
import Image from "next/image";
import HamburgerMenu, { MenuItem } from "@/components/HamburgerMenu";
import HeatMapComponent from "@/components/HeatMapComponent";
import AddFriend from "./AddFriend";

interface Friend {
  id: string;
  userName: string;
  avatarUrl?: string;
  followerCount: number;
}

export default function FollowingPage({ onBack }: { onBack: () => void }) {
  const [friends, setFriends] = React.useState<Friend[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // new state: track which friend was clicked
  const [selectedFriend, setSelectedFriend] = React.useState<Friend | null>(
    null
  );

  // NEW: local UI state to show the inline AddFriend flow
  const [showAddFriend, setShowAddFriend] = React.useState(false);

  React.useEffect(() => {
    fetch("api/profile/follow")
      .then((res) => {
        if (!res.ok) throw new Error(res.statusText);
        return res.json();
      })
      .then((json) => {
        const list = Array.isArray(json.following) ? json.following : [];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const mapped: Friend[] = list.map((u: any) => ({
          id: u.id,
          userName: u.userName,
          followerCount: u.followerCount,
          // Preserve your field name; fallback to `image` if your API uses it
          avatarUrl: u.avatarUrl ?? u.image ?? null,
        }));
        setFriends(mapped);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not load followings");
        setLoading(false);
      });
  }, []);

  // 2) state for friend's habits/logs (must be before any return)
  const [friendHabits, setFriendHabits] = React.useState<Habit[]>([]);
  const [friendLogs, setFriendLogs] = React.useState<HabitLog[]>([]);
  const [friendLoading, setFriendLoading] = React.useState(false);
  const [friendError, setFriendError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (selectedFriend) {
      setFriendLoading(true);
      setFriendError(null);
      Promise.all([
        fetch(`api/habit/${selectedFriend.id}`).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch habits");
          return res.json();
        }),
        fetch(`api/habit/log/${selectedFriend.id}`).then((res) => {
          if (!res.ok) throw new Error("Failed to fetch logs");
          return res.json();
        }),
      ])
        .then(([habits, logs]) => {
          setFriendHabits(habits);
          setFriendLogs(logs);
          setFriendLoading(false);
        })
        .catch((err) => {
          setFriendError("Could not load friend's habits/logs" + err.message);
          setFriendLoading(false);
        });
    }
  }, [selectedFriend]);

  // 🔁 NEW: render the inline AddFriend flow
  if (showAddFriend) {
    return (
      <AddFriend
        // Proper back button behavior: return to this Following list
        onBack={() => setShowAddFriend(false)}
      />
    );
  }

  // 1) while loading / error / empty remain the same
  if (loading) return <div className="p-4 text-center">Loading…</div>;
  if (error) return <div className="p-4 text-red-500">{error}</div>;
  if (friends.length === 0)
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-between px-4 py-3 bg-white shadow">
          <button onClick={onBack} className="text-gray-800 font-medium">
            &larr; Back
          </button>
          <h1 className="text-lg font-semibold text-gray-800">Following</h1>
          <button
            // was: router.push("/add-friend")
            onClick={() => setShowAddFriend(true)}
            className="text-xl font-bold"
          >
            +
          </button>
        </div>
        <div className="p-4 text-center">Youre not following anyone yet</div>
      </div>
    );

  async function onDelete() {
    if (!selectedFriend) return;
    try {
      const res = await fetch("api/profile/follow", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: selectedFriend.userName }),
      });
      if (!res.ok) throw new Error("Failed to unfollow");
      // Remove friend from list and go back to list view
      setFriends((prev) => prev.filter((f) => f.id !== selectedFriend.id));
      setSelectedFriend(null);
    } catch (err) {
      alert(err + "Could not unfollow this user.");
    }
  }

  const menuItems: MenuItem[] = [
    { label: "Unfollow Profile", onClick: () => onDelete() },
  ];

  if (selectedFriend) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center px-4 py-3 bg-white shadow">
          <button
            onClick={() => setSelectedFriend(null)}
            className="text-gray-800 font-medium"
          >
            &larr; Back to list
          </button>

          <h1 className="text-lg font-semibold text-gray-800 ml-4">
            {selectedFriend.userName}
          </h1>
          <div className="ml-auto">
            <HamburgerMenu items={menuItems} widthClass="w-72" />
          </div>
        </div>
        {friendLoading ? (
          <div className="p-4 text-center">Loading friend`s habits…</div>
        ) : friendError ? (
          <div className="p-4 text-red-500">{friendError}</div>
        ) : (
          <div className="pb-20 min-h-screen bg-gray-50">
            <main className="max-w-md mx-auto pt-8 px-4">
              <HeatMapComponent logs={friendLogs} />

              <h1 className="text-2xl font-bold mb-4">Habits</h1>
              <HabitOther habits={friendHabits} logs={friendLogs} />
            </main>
          </div>
        )}
      </div>
    );
  }

  // 3) otherwise, render the list as before, but wire up onClick to setSelectedFriend
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white shadow">
        <button onClick={onBack} className="text-gray-800 font-medium">
          &larr; Back
        </button>
        <h1 className="text-lg font-semibold text-gray-800">Following</h1>
        <button
          // was: router.push("/add-friend")
          onClick={() => setShowAddFriend(true)}
          className="text-xl font-bold"
        >
          +
        </button>
      </div>

      {/* List */}
      <ul className="mt-4 bg-white">
        {friends.map((f) => (
          <li
            key={f.id}
            onClick={() => setSelectedFriend(f)}
            className="flex items-center px-4 py-4 border-t last:border-b cursor-pointer hover:bg-gray-50"
          >
            {f.avatarUrl && (
              <Image
                src={f.avatarUrl}
                alt={f.userName}
                width={5}
                height={5}
                className="w-10 h-10 rounded-full object-cover"
              />
            )}
            <div className="ml-4 flex-grow">
              <p className="text-base font-medium text-gray-800">
                {f.userName}
              </p>
              <p className="text-sm text-gray-600">
                {f.followerCount} follower{f.followerCount === 1 ? "" : "s"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
