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
    <form onSubmit={handleSubmit} className="card max-w-sm mx-auto mt-10">
      <h2 className="text-lg font-bold mb-4">Login</h2>
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
        Login
      </button>
      <p className="mt-2 text-sm text-center">
  <Link to="/forgot-password" className="text-blue-600 hover:underline">
    Forgot your password?
  </Link>
</p>


      {/* Signup link */}
      <p className="mt-4 text-sm text-center">
        Don’t have an account?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">
          Sign up
        </Link>
      </p>
    </form>
  );
}
