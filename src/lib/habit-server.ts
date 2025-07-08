import { cookies } from "next/headers";

async function fetchWithSession<T>(path: string): Promise<T> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore
    .getAll()
    .map((c: { name: string; value: string }) => `${c.name}=${c.value}`)
    .join("; ");
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}${path}`, {
    cache: "no-store",
    headers: { cookie: cookieHeader },
  });
  if (!res.ok) throw new Error(`Fetch error (${res.status}) for ${path}`);
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
