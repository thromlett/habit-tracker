"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { signIn, useSession, SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaFacebookF } from "react-icons/fa";

function LoginPageContent() {
  const { status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  // If already signed in, redirect away
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      email: form.email,
      password: form.password,
      redirect: false,
      callbackUrl: "/",
    });

    if (res?.ok && res.url) {
      window.location.href = res.url;
    } else {
      setError("Invalid email or password");
    }
  };

  const handleSocialSignIn = async (
    provider: "google" | "apple" | "facebook"
  ) => {
    const res = await signIn(provider, {
      redirect: false,
      callbackUrl: "/",
    });
    if (res?.url) window.location.href = res.url;
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-blue-500 to-blue-300" />
        </div>
        <h2 className="text-3xl font-bold text-center mb-1">Welcome Back!</h2>
        <p className="text-center text-gray-500 mb-6">
          Please log in to your account.
        </p>

        {error && (
          <div className="bg-red-100 text-red-700 px-3 py-2 rounded mb-4 text-center">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block mb-1 text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={form.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:border-blue-500 pr-16"
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-600 text-sm font-medium"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex justify-end">
            <Link
              href="/forgot-password"
              className="text-blue-600 text-sm hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold text-lg shadow hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <div className="flex items-center my-6">
          <div className="flex-grow border-t border-gray-200" />
          <span className="mx-3 text-gray-400 text-sm">or continue with</span>
          <div className="flex-grow border-t border-gray-200" />
        </div>

        <div className="flex justify-center gap-4 mb-4">
          <button
            type="button"
            onClick={() => handleSocialSignIn("google")}
            className="p-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
          >
            <FcGoogle size={22} />
          </button>
          <button
            type="button"
            onClick={() => handleSocialSignIn("apple")}
            className="p-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
          >
            <FaApple size={22} className="text-gray-700" />
          </button>
          <button
            type="button"
            onClick={() => handleSocialSignIn("facebook")}
            className="p-3 rounded-xl border border-gray-200 hover:bg-gray-100 transition"
          >
            <FaFacebookF size={22} className="text-blue-600" />
          </button>
        </div>

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

export default function LoginPage() {
  return (
    <SessionProvider>
      <LoginPageContent />
    </SessionProvider>
  );
}
