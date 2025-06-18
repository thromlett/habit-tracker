"use client";

import { useRouter } from "next/navigation";

export default function VerifiedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-green-100 rounded-full p-4 mb-2">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            You Are Verified!
          </h1>
          <p className="text-gray-600 mb-6">
            Your email has been successfully verified. You can now log in to
            your account.
          </p>
        </div>
        <button
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition"
          onClick={() => router.push("/login")}
        >
          Go to Login
        </button>
      </div>
    </div>
  );
}
