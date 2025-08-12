"use client";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/** 🔧 If your search route is different, update this */
const SEARCH_ENDPOINT = "/api/profile/users/search";

type RawUser = {
  id: string;
  userName: string;
  image?: string | null;
  followerCount?: number;
};

type Friend = {
  id: string;
  userName: string;
  avatarUrl?: string | null;
  followerCount: number;
  isFollowing: boolean;
};

interface FollowingPageProps {
  onBack: () => void;
}

export default function AddFriend({ onBack }: FollowingPageProps) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const debounced = useDebouncedValue(searchTerm, 300);

  const [following, setFollowing] = useState<Record<string, boolean>>({});
  const [results, setResults] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  // 1) Load current following so we can toggle button states
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/profile/follow", { method: "GET" });
        if (!res.ok) return; // non-fatal for the page
        const json = await res.json();
        // Your GET returns: { following: [{ id, userName, image, followerCount }] }
        const map: Record<string, boolean> = {};
        (json?.following ?? []).forEach((u: RawUser) => {
          if (u?.userName) map[u.userName] = true;
        });
        setFollowing(map);
      } catch {
        /* ignore */
      }
    })();
  }, []);

  // 2) Search users (debounced). This should NOT hit /api/profile/follow
  useEffect(() => {
    if (!debounced.trim()) {
      setResults([]);
      setLoading(false);
      setError(null);
      abortRef.current?.abort();
      return;
    }

    const ctrl = new AbortController();
    abortRef.current?.abort();
    abortRef.current = ctrl;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await fetch(SEARCH_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: debounced }),
          signal: ctrl.signal,
        });

        if (!res.ok) {
          // Prefer showing API-provided message if present
          let message = `Search failed with ${res.status}`;
          try {
            const text = await res.text();
            if (text) message = text;
          } catch {}
          throw new Error(message);
        }

        const json = await res.json();
        // Accept several shapes to be forgiving:
        const list: RawUser[] = Array.isArray(json)
          ? json
          : Array.isArray(json.users)
          ? json.users
          : Array.isArray(json.results)
          ? json.results
          : Array.isArray(json.following)
          ? json.following
          : [];

        const normalized: Friend[] = list.filter(Boolean).map((u) => ({
          id: String(u.id),
          userName: String(u.userName),
          avatarUrl: u.image ?? null,
          followerCount: Number(u.followerCount ?? 0) || 0,
          isFollowing: !!following[u.userName],
        }));

        setResults(normalized);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e?.name === "AbortError") return;
        setError(e?.message || "Something went wrong searching.");
        setResults([]);
      } finally {
        setLoading(false);
      }
    })();

    return () => ctrl.abort();
  }, [debounced, following]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchTerm((s) => s.trim());
  };

  const showEmpty = !loading && !error && debounced && results.length === 0;

  async function follow(userName: string) {
    try {
      const res = await fetch("/api/profile/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName }), // <-- per your POST
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Follow failed with ${res.status}`);
      }
      setFollowing((m) => ({ ...m, [userName]: true }));
      // reflect in search results
      setResults((arr) =>
        arr.map((u) =>
          u.userName === userName ? { ...u, isFollowing: true } : u
        )
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      alert(e?.message || "Failed to follow user.");
    }
  }

  async function unfollow(userName: string) {
    try {
      const res = await fetch("/api/profile/follow", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: userName }), // <-- per your DELETE
      });
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Unfollow failed with ${res.status}`);
      }
      setFollowing((m) => {
        const copy = { ...m };
        delete copy[userName];
        return copy;
      });
      setResults((arr) =>
        arr.map((u) =>
          u.userName === userName ? { ...u, isFollowing: false } : u
        )
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      alert(e?.message || "Failed to unfollow user.");
    }
  }

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
        <h1 className="text-lg font-semibold text-gray-800">Find friends</h1>
        <button
          onClick={() => router.push("/add-friend")}
          className="text-gray-800 text-xl font-bold"
          aria-label="Add friend"
        >
          +
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2 bg-white shadow">
        <form onSubmit={onSubmit} className="flex gap-2">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by username…"
            className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            autoFocus
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                setResults([]);
                setError(null);
              }}
              className="px-3 border border-gray-300 rounded hover:bg-gray-50"
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
        </form>
        {loading && <p className="text-sm text-gray-600 mt-2">Searching…</p>}
        {error && <p className="text-sm text-red-600 mt-2">Error: {error}</p>}
      </div>

      {/* Results */}
      <div className="mt-4 bg-white">
        {showEmpty && (
          <p className="px-4 py-4 text-sm text-gray-600">
            No users found for “{debounced}”.
          </p>
        )}
        <ul>
          {results.map((u) => (
            <li
              key={u.id}
              className="flex items-center px-4 py-4 border-t last:border-b"
            >
              {u.avatarUrl ? (
                <img
                  src={u.avatarUrl}
                  alt={u.userName}
                  className="w-10 h-10 rounded-full object-cover"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gray-200 grid place-items-center text-sm text-gray-600">
                  {initials(u.userName)}
                </div>
              )}
              <div className="ml-4 flex-grow">
                <p className="text-base font-medium text-gray-800">
                  <Highlight text={u.userName} query={debounced} />
                </p>
                <p className="text-sm text-gray-600">
                  {u.followerCount} follower{u.followerCount === 1 ? "" : "s"}
                </p>
              </div>

              {u.isFollowing ? (
                <button
                  className="text-gray-700 text-sm font-medium hover:underline"
                  onClick={() => unfollow(u.userName)}
                >
                  Unfollow
                </button>
              ) : (
                <button
                  className="text-indigo-600 text-sm font-medium hover:underline"
                  onClick={() => follow(u.userName)}
                >
                  Follow
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/);
  return (
    (parts[0]?.[0] || "").toUpperCase() + (parts[1]?.[0] || "").toUpperCase()
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  const parts = useMemo(() => {
    if (!query) return [text];
    const i = text.toLowerCase().indexOf(query.toLowerCase());
    if (i === -1) return [text];
    return [
      text.slice(0, i),
      text.slice(i, i + query.length),
      text.slice(i + query.length),
    ];
  }, [text, query]);

  if (parts.length === 1) return <>{text}</>;
  return (
    <>
      {parts[0]}
      <mark className="bg-yellow-200">{parts[1]}</mark>
      {parts[2]}
    </>
  );
}
