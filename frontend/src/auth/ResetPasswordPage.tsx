import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ResetPasswordPage() {
  const { token } = useParams<{ token: string }>();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await fetch(`http://localhost:8000/auth/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newPassword: password }),
      });

      if (!res.ok) throw new Error("Reset failed");
      const data = await res.json();
      setMessage(data.message);
      setError("");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(err.message || "Reset failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-sm mx-auto mt-10">
      <h2 className="text-lg font-bold mb-4">Reset Password</h2>
      {message && <p className="text-green-600 mb-2">{message}</p>}
      {error && <p className="text-red-600 mb-2">{error}</p>}

      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input mb-2"
        required
      />
      <input
        type="password"
        placeholder="Confirm password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        className="input mb-2"
        required
      />
      <button type="submit" className="btn w-full">
        Reset Password
      </button>
    </form>
  );
}
