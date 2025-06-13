import React, { useState } from "react";

export default function RecoverPassword({ onRecover, onBack }: { onRecover: () => void; onBack: () => void }) {
  const [username, setUsername] = useState("");
  const [secret, setSecret] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = localStorage.getItem(`user_${username}`);
    if (!user) {
      setError("User not found");
      return;
    }
    const { secret: storedSecret } = JSON.parse(user);
    if (secret !== storedSecret) {
      setError("Incorrect secret code");
      return;
    }
    if (!newPassword) {
      setError("Enter a new password");
      return;
    }
    localStorage.setItem(`user_${username}`, JSON.stringify({ ...JSON.parse(user), password: newPassword }));
    setSuccess("Password updated! You can now log in.");
    setError("");
    setTimeout(onRecover, 1500);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4">Recover Password</h2>
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}
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
          type="text"
          placeholder="4-digit Secret Code"
          value={secret}
          onChange={e => setSecret(e.target.value.replace(/[^0-9]/g, "").slice(0, 4))}
          required
        />
        <input
          className="border p-2 mb-4 w-full"
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={e => setNewPassword(e.target.value)}
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded w-full" type="submit">
          Recover
        </button>
        <button type="button" className="text-blue-600 hover:underline text-sm mt-4 w-full" onClick={onBack}>
          Back
        </button>
      </form>
    </div>
  );
}
