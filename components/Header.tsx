"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";

export default function Header({
  username,
  profileImage,
}: {
  username: string;
  profileImage: string | null;
}) {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        background: "var(--card-bg)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "var(--shadow)",
      }}
    >
      <Link
        href="/"
        style={{
          fontWeight: 600,
          fontSize: "1.1rem",
          color: "var(--text)",
          textDecoration: "none",
        }}
      >
        Weather Dashboard
      </Link>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Link
          href="/profile"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--text-muted)",
            fontSize: "0.9rem",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              overflow: "hidden",
              background: "var(--border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              flexShrink: 0,
            }}
          >
            {profileImage ? (
              <img
                src={profileImage}
                alt=""
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            ) : (
              username.charAt(0).toUpperCase()
            )}
          </div>
          {username}
        </Link>
        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          style={{
            padding: "0.5rem 1rem",
            background: "none",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            cursor: "pointer",
            fontSize: "0.875rem",
            color: "var(--text)",
          }}
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}
