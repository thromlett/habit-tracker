"use client";
import { useEffect, useState } from "react";
import BottomBar from "../../../components/BottomBar";
import { signOut } from "next-auth/react";
import { SessionProvider } from "next-auth/react";
import { redirect } from "next/navigation";

export default function ProfilePage() {
  return (
    <SessionProvider>
      <ProfileContent />
    </SessionProvider>
  );
}

function ProfileContent() {
  const [userName, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  //const { data: session } = useSession();

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
          {/*sign out button*/}
          <button
            onClick={() =>
              signOut({
                // Optional: where to redirect after sign-out
                callbackUrl: "/",
              })
            }
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Sign Out
          </button>
          {/* Add more settings/info here */}
          <button
            onClick={() => redirect("/mobile-testing")}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            TEST
          </button>
        </div>
      </main>
      <BottomBar />
    </div>
  );
}
