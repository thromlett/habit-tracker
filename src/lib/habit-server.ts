import { cookies, headers } from "next/headers";

async function fetchWithSession<T>(path: string): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");

  // grab host & protocol from the current request
  const hdrs = await headers();
  const host = hdrs.get("host")!; // e.g. "my-app-abc.vercel.app"
  const proto = hdrs.get("x-forwarded-proto") || "https";
  const origin = `${proto}://${host}`;

  const res = await fetch(`${origin}${path}`, {
    cache: "no-store",
    headers: { cookie: cookieHeader },
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Fetch error (${res.status}) for ${path}: ${text}`);
  }
  return res.json();
}

export function getHabits() {
  return fetchWithSession("/api/habit");
}

export function getLoggableHabits() {
  return fetchWithSession("/api/habit/loggable");
}

export function getLogs() {
  return fetchWithSession("/api/habit/log");
}

export function getFollowingHabits() {
  return fetchWithSession("/api/habit/following");
}

export function getGlobalHabits() {
  return fetchWithSession("/api/habit/global");
}
