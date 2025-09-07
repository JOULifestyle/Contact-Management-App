import { useState } from "react";
import { signup } from "../api";
import { Link } from "react-router-dom";

export default function SignupPage({ onSignup }: { onSignup: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const data = await signup(email, password);

      // Store token and email
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);

      onSignup();
    } catch (err: any) {
      setError(err.message || "Signup failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="card max-w-sm mx-auto mt-10">
      <h2 className="text-lg font-bold mb-4">Sign Up</h2>
      {error && <p className="text-red-600 mb-2">{error}</p>}
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="input mb-2"
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="input mb-2"
        required
      />
      <button type="submit" className="btn w-full">
        Sign Up
      </button>

      {/* Login link */}
      <p className="mt-4 text-sm text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </form>
  );
}
