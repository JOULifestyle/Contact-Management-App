import { useState } from "react";
import { requestPasswordReset } from "../api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await requestPasswordReset(email);
      setMessage(res.message || "Password reset link sent to your email.");
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to send reset link");
      setMessage("");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-sm mx-auto mt-10">
      <h2 className="text-lg font-bold mb-4">Forgot Password</h2>
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input mb-2"
        required
      />
      <button type="submit" className="btn w-full">
        Send Reset Link
      </button>
    </form>
  );
}
