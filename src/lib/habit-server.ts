// lib/fetchWithSession.ts
import { headers } from "next/headers";

// Make sure your pages/layouts that import this file also export
// `export const dynamic = 'force-dynamic';` at the top level so
// Next.js doesn’t static-optimize them.
export const dynamic = "force-dynamic";

async function fetchWithSession<T>(path: string): Promise<T> {
  // 1. Await the headers() call, then pull the cookie header
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") ?? "";

  // 2. Compute the base URL at runtime
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  // 3. Fetch with no-store so it only runs at request time
  const res = await fetch(`${baseUrl}${path}`, {
    cache: "no-store",
    headers: { cookie: cookieHeader },
  });

  if (!res.ok) {
    throw new Error(`Fetch error (${res.status}) for ${path}`);
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
