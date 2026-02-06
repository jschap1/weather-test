import LoginForm from "@/components/LoginForm";

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 400,
          background: "var(--card-bg)",
          borderRadius: "var(--radius)",
          boxShadow: "var(--shadow)",
          padding: "2rem",
        }}
      >
        <h1 style={{ textAlign: "center", marginBottom: "0.5rem" }}>
          Welcome Back
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
          }}
        >
          Sign in to your account
        </p>
        <LoginForm />
        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: "var(--text-muted)",
            fontSize: "0.875rem",
          }}
        >
          Don&apos;t have an account?{" "}
          <a href="/register">Create one</a>
        </p>
      </div>
    </div>
  );
}
