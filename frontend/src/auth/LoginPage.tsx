import { useState } from "react";
import { login } from "../api";
import { Link } from "react-router-dom";

export default function LoginPage({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await login(email, password);

      // Store token and email
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);

      onLogin();
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      {/* App name at top */}
      <h1 className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 mb-8">
        Contact Manager
      </h1>

      {/* Login card */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Welcome back 👋
        </h2>

        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
        >
          Login
        </button>

        {/* Forgot password link */}
        <p className="mt-3 text-sm text-center">
          <Link
            to="/forgot-password"
            className="text-teal-600 dark:text-teal-400 hover:underline"
          >
            Forgot your password?
          </Link>
        </p>

        {/* Signup link */}
        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-300">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-teal-600 dark:text-teal-400 font-medium hover:underline"
          >
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
