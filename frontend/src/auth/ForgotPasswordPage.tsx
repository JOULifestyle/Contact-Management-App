import { useState } from "react";
import { requestPasswordReset } from "../api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await requestPasswordReset(email);
      setMessage(res.message || "Password reset link sent to your email.");
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to send reset link");
      setMessage("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4">
      <h1 className="text-3xl font-extrabold text-teal-600 dark:text-teal-400 mb-8">
        Contact Manager
      </h1>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8"
      >
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6 text-center">
          Forgot Password 🔑
        </h2>

        {message && (
          <p className="text-green-600 dark:text-green-400 text-sm mb-4 text-center">
            {message}
          </p>
        )}
        {error && (
          <p className="text-red-600 dark:text-red-400 text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-teal-500 mb-6"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg shadow-md transition"
        >
          {loading ? "Sending…" : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}
