"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebookF } from "react-icons/fa";

export default function SignUpPage() {
  const [form, setForm] = useState({ email: "", password: "", confirm: "", role: "USER" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, password: form.password, role: form.role }),
    });
    const data = await res.json();

    if (res.ok) {
      setSuccess("Registration successful! Please check your email to verify your account.");
      setForm({ email: "", password: "", confirm: "", role: "USER" });
      // Optionally auto-login after sign up:
      // await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      // router.push("/");
    } else {
      setError(data.error || "An error occurred.");
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
        <h2 className="text-3xl font-bold text-center mb-1">Create Account</h2>
        <p className="text-center text-gray-500 mb-6">Sign up to get started.</p>
        {/* Error or Success message */}
        {error && <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-center">{error}</div>}
        {success && <div className="bg-green-100 text-green-700 px-3 py-2 rounded mb-4 text-center">{success}</div>}
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
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                {/* SVG icon can go here */}
              </span>
            </div>
          </div>
          {/* Password */}
          <div>
            <label className="block mb-1 text-gray-700" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 pr-16"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 text-sm font-medium"
                onClick={() => setShowPassword(s => !s)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-gray-700" htmlFor="confirm">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirm"
                name="confirm"
                type={showConfirm ? "text" : "password"}
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 pr-16"
                placeholder="Confirm Password"
                value={form.confirm}
                onChange={handleChange}
              />
              <button
                type="button"
                tabIndex={-1}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 text-sm font-medium"
                onClick={() => setShowConfirm(s => !s)}
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {/* Role Dropdown (optional, remove if you don't want users to choose role) */}
          <div>
            <label className="block mb-1 text-gray-700" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              name="role"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500"
              value={form.role}
              onChange={handleChange}
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
              <option value="PAID_USER">Paid User</option>
            </select>
          </div>
          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </form>
        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200" />
          <span className="mx-3 text-gray-400 text-sm">or sign up with</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>
        {/* Social Buttons */}
        <div className="flex justify-center gap-4 mb-4">
          <button
            className="p-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
            type="button"
            onClick={() => signIn("google", { callbackUrl: "/" })}
          >
            <FcGoogle size={22} />
          </button>
          <button
            className="p-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
            type="button"
            onClick={() => signIn("apple", { callbackUrl: "/" })}
          >
            <FaApple size={22} className="text-gray-700" />
          </button>
          <button
            className="p-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
            type="button"
            onClick={() => signIn("facebook", { callbackUrl: "/" })}
          >
            <FaFacebookF size={22} className="text-blue-600" />
          </button>
        </div>
        {/* Already have account */}
        <p className="text-center text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
