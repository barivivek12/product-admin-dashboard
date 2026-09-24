"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    // Prevent repeated login clicks
    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await api.post(
        "/auth/login",
        {
          username,
          password,
        }
      );

      console.log(
        "Login response:",
        response.data
      );

      // Save token
      localStorage.setItem(
        "token",
        response.data.accessToken
      );

      // Go to dashboard
      router.replace("/products");
    } catch (error) {
      console.error(
        "Login failed:",
        error
      );

      setError(
        "Invalid username or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        {/* TITLE */}

        <h1 className="text-center text-3xl font-bold text-gray-800">
          Product Admin
        </h1>

        <p className="mt-2 mb-8 text-center text-gray-500">
          Login to manage your products
        </p>

        {/* FORM */}

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* USERNAME */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Username
            </label>

            <input
              type="text"
              value={username}
              onChange={(e) =>
                setUsername(
                  e.target.value
                )
              }
              placeholder="Enter username"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>

          {/* PASSWORD */}

          <div>

            <label className="mb-2 block text-sm font-medium text-gray-700">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              placeholder="Enter password"
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>

          {/* ERROR */}

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-center text-sm text-red-600">
              {error}
            </div>
          )}

          {/* LOGIN */}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {/* DEMO LOGIN */}

        <div className="mt-6 rounded-lg bg-gray-50 p-4 text-center">

          <p className="text-xs text-gray-500">
            Demo credentials
          </p>

          <p className="mt-1 text-sm font-medium text-gray-700">
            Username: emilys
          </p>

          <p className="text-sm font-medium text-gray-700">
            Password: emilyspass
          </p>

        </div>

      </div>

    </main>
  );
}