"use client";

import { signIn } from "next-auth/react";
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

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
      router.refresh();
    }
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

      <div style={{ marginBottom: "1.5rem" }}>
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
          placeholder="Enter your password"
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
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}
