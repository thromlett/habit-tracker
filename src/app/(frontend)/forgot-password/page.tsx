"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebookF } from "react-icons/fa";

export default function ForgotPasswordPage() {
  const [form, setForm] = useState({ email: "" });
  const [error, setError] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });

      const data = await res.json();
      if (res.ok) {
        setEmailSent(true);
      } else {
        setError(data.error || "Error sending reset email.");
      }
    } catch (err) {
      console.error(err);
      setError("Unexpected error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-blue-300" />
        </div>
        {/* Welcome Message */}
        <h2 className="text-3xl font-bold text-center mb-1">
          Forgot Password?
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Please enter the email associated with your account.
        </p>
        {/* Error message */}
        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}
        {/* Success message */}
        {emailSent && (
          <div className="bg-green-100 text-green-700 px-3 py-2 rounded mb-4 text-center">
            An email with a link to reset your password was sent to the email
            address associated with your account
          </div>
        )}
        {/* Form */}
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email */}
          <div>
            <label className="block mb-1 text-gray-700" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <input
                id="email"
                name="email"
                type="email"
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                disabled={emailSent || loading}
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {/* SVG Icon */}
              </span>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition"
            disabled={emailSent || loading}
          >
            {loading ? "Sending..." : "Send Verification"}
          </button>
        </form>
        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200" />
          <span className="mx-3 text-gray-400 text-sm">or continue with</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>
        {/* Social Buttons */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            className="p-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
            onClick={() => signIn("google", { callbackUrl: "/" })}
            type="button"
          >
            <FcGoogle size={22} />
          </button>
          <button
            className="p-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
            onClick={() => signIn("apple", { callbackUrl: "/" })}
            type="button"
          >
            <FaApple size={22} className="text-gray-700" />
          </button>
          <button
            className="p-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
            onClick={() => signIn("facebook", { callbackUrl: "/" })}
            type="button"
          >
            <FaFacebookF size={22} className="text-blue-600" />
          </button>
        </div>
        {/* Sign Up */}
        <p className="text-center text-gray-500">
          Don’t have an account?{" "}
          <Link
            href="/signup"
            className="text-blue-600 font-medium hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
