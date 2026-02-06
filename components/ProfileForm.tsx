"use client";

import { useState, useEffect, useRef } from "react";

interface UserProfile {
  id: string;
  email: string;
  username: string;
  profileImage: string | null;
  createdAt: string;
}

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

export default function ProfileForm() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [username, setUsername] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else {
          setProfile(data);
          setUsername(data.username);
          setPreview(data.profileImage);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load profile");
        setLoading(false);
      });
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      setError("");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);

    const body: Record<string, string | null> = {};

    if (username !== profile?.username) {
      body.username = username;
    }
    if (preview !== profile?.profileImage) {
      body.profileImage = preview;
    }

    if (Object.keys(body).length === 0) {
      setMessage("No changes to save");
      setSaving(false);
      return;
    }

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Failed to update profile");
      return;
    }

    setProfile(data);
    setMessage("Profile updated successfully");
  };

  if (loading) {
    return (
      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: "var(--radius)",
          padding: "2rem",
          boxShadow: "var(--shadow)",
          textAlign: "center",
          color: "var(--text-muted)",
        }}
      >
        Loading profile...
      </div>
    );
  }

  if (!profile) {
    return (
      <div
        style={{
          background: "#fef2f2",
          borderRadius: "var(--radius)",
          padding: "1.5rem",
          border: "1px solid #fecaca",
          color: "var(--danger)",
        }}
      >
        {error || "Failed to load profile"}
      </div>
    );
  }

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
      {message && (
        <div
          style={{
            padding: "0.75rem",
            background: "#f0fdf4",
            border: "1px solid #bbf7d0",
            borderRadius: "var(--radius)",
            color: "var(--success)",
            fontSize: "0.875rem",
            marginBottom: "1rem",
          }}
        >
          {message}
        </div>
      )}

      {/* Profile picture */}
      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: "var(--radius)",
          padding: "1.5rem",
          boxShadow: "var(--shadow)",
          marginBottom: "1.5rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "1rem",
        }}
      >
        <div
          style={{
            width: 100,
            height: 100,
            borderRadius: "50%",
            overflow: "hidden",
            background: "var(--border)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            color: "var(--text-muted)",
            fontWeight: 600,
          }}
        >
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : (
            username.charAt(0).toUpperCase()
          )}
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            style={{
              padding: "0.5rem 1rem",
              background: "var(--primary)",
              color: "#fff",
              border: "none",
              borderRadius: "var(--radius)",
              cursor: "pointer",
              fontSize: "0.85rem",
            }}
          >
            Upload Photo
          </button>
          {preview && (
            <button
              type="button"
              onClick={handleRemoveImage}
              style={{
                padding: "0.5rem 1rem",
                background: "none",
                color: "var(--danger)",
                border: "1px solid var(--danger)",
                borderRadius: "var(--radius)",
                cursor: "pointer",
                fontSize: "0.85rem",
              }}
            >
              Remove
            </button>
          )}
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
          Max 2MB, JPG/PNG/GIF
        </span>
      </div>

      {/* Account info */}
      <div
        style={{
          background: "var(--card-bg)",
          borderRadius: "var(--radius)",
          padding: "1.5rem",
          boxShadow: "var(--shadow)",
          marginBottom: "1.5rem",
        }}
      >
        <div style={{ marginBottom: "1rem" }}>
          <label style={labelStyle}>Email</label>
          <input
            type="email"
            value={profile.email}
            disabled
            style={{
              ...inputStyle,
              background: "var(--bg)",
              color: "var(--text-muted)",
              cursor: "not-allowed",
            }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              marginTop: "0.25rem",
              display: "block",
            }}
          >
            Email cannot be changed
          </span>
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
            style={inputStyle}
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

        <div>
          <label style={labelStyle}>Member Since</label>
          <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>
            {new Date(profile.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        style={{
          width: "100%",
          padding: "0.75rem",
          background: saving ? "var(--text-muted)" : "var(--primary)",
          color: "#fff",
          border: "none",
          borderRadius: "var(--radius)",
          fontSize: "1rem",
          fontWeight: 500,
          cursor: saving ? "not-allowed" : "pointer",
        }}
      >
        {saving ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}
