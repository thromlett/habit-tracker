// For fetching the session in a React Query compatible way
export async function fetchSession() {
  const res = await fetch("/api/auth/session", {
    credentials: "same-origin",
  });
  if (!res.ok) {
    // no session → throw so React Query knows it’s “error” or “unauthenticated”
    throw new Error("No session");
  }
  return res.json(); // will be `null` if not signed in, or the session object
}
