"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem",
  border: "1px solid var(--border)",
  borderRadius: "var(--radius)",
  fontSize: "1rem",
  background: "var(--input-bg)",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "0.375rem",
  fontWeight: 500,
  fontSize: "0.875rem",
};

function getPasswordStrength(password: string): {
  score: number;
  label: string;
  color: string;
} {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;

  if (score <= 2) return { score, label: "Weak", color: "var(--danger)" };
  if (score <= 3) return { score, label: "Fair", color: "#f59e0b" };
  if (score <= 4) return { score, label: "Good", color: "#2563eb" };
  return { score, label: "Strong", color: "var(--success)" };
}

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const strength = getPasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, username, password }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || "Registration failed");
      return;
    }

    router.push("/login");
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div
          style={{
            padding: "0.75rem",
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "var(--radius)",
            color: "var(--danger)",
            fontSize: "0.875rem",
            marginBottom: "1rem",
          }}
        >
          {error}
        </div>
      )}

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="email" style={labelStyle}>
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={inputStyle}
          placeholder="you@example.com"
        />
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="username" style={labelStyle}>
          Username
        </label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={inputStyle}
          placeholder="Choose a username"
        />
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            marginTop: "0.25rem",
            display: "block",
          }}
        >
          3-30 characters, letters, numbers, and underscores only
        </span>
      </div>

      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="password" style={labelStyle}>
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={inputStyle}
          placeholder="Create a password"
        />
        {password && (
          <div style={{ marginTop: "0.5rem" }}>
            <div
              style={{
                height: 4,
                borderRadius: 2,
                background: "var(--border)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${(strength.score / 5) * 100}%`,
                  background: strength.color,
                  transition: "width 0.3s, background 0.3s",
                }}
              />
            </div>
            <span
              style={{
                fontSize: "0.75rem",
                color: strength.color,
                marginTop: "0.25rem",
                display: "block",
              }}
            >
              {strength.label}
            </span>
          </div>
        )}
        <span
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            marginTop: "0.25rem",
            display: "block",
          }}
        >
          Min 8 characters with uppercase, lowercase, and a number
        </span>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <label htmlFor="confirmPassword" style={labelStyle}>
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          style={inputStyle}
          placeholder="Confirm your password"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          padding: "0.75rem",
          background: loading ? "var(--text-muted)" : "var(--primary)",
          color: "#fff",
          border: "none",
          borderRadius: "var(--radius)",
          fontSize: "1rem",
          fontWeight: 500,
          cursor: loading ? "not-allowed" : "pointer",
        }}
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}
