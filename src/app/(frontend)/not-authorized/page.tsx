"use client";

import { useRouter } from "next/navigation";

export default function NotAuthorized() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-red-100 rounded-full p-4 mb-2">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 5L5 19M5 5L19 19"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            You Are Not Authorized to Access This Page
          </h1>
          <p className="text-gray-600 mb-6">
            Please log in with an account that has the necessary permissions to
            view this content.
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
