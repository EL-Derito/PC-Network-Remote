import React, { useState } from "react";

export default function Login({ onLogin, onSignup, onRecover }: { onLogin: () => void; onSignup: () => void; onRecover: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "Admin") {
      onLogin();
    } else {
      // Try localStorage users
      const user = localStorage.getItem(`user_${username}`);
      if (user && JSON.parse(user).password === password) {
        onLogin();
        return;
      }
      setError("Invalid username or password");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        <input
          className="border p-2 mb-4 w-full"
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />
        <input
          className="border p-2 mb-4 w-full"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">
          Login
        </button>
        <div className="flex justify-between mt-4">
          <button type="button" className="text-blue-600 hover:underline text-sm" onClick={onSignup}>
            Sign Up
          </button>
          <button type="button" className="text-blue-600 hover:underline text-sm" onClick={onRecover}>
            Forgot Password?
          </button>
        </div>
      </form>
    </div>
  );
}
