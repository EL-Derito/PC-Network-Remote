import React, { useState } from "react";

export default function Signup({ onSignup, onBack }: { onSignup: () => void; onBack: () => void }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [secret, setSecret] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || secret.length !== 4 || !/^\d{4}$/.test(secret)) {
      setError("All fields required. Secret must be 4 digits.");
      return;
    }
    if (localStorage.getItem(`user_${username}`)) {
      setError("Username already exists. Please choose another.");
      return;
    }
    localStorage.setItem(`user_${username}`, JSON.stringify({ password, secret }));
    onSignup();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Sign Up</h2>
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
        <input
          className="border p-2 mb-4 w-full"
          type="text"
          placeholder="4-digit Secret Code"
          value={secret}
          onChange={e => setSecret(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
          required
        />
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full" type="submit">
          Sign Up
        </button>
        <button type="button" className="text-blue-600 hover:underline text-sm mt-4 w-full" onClick={onBack}>
          Back
        </button>
      </form>
    </div>
  );
}
