import RegisterForm from "@/components/RegisterForm";

export default function RegisterPage() {
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
          Create Account
        </h1>
        <p
          style={{
            textAlign: "center",
            color: "var(--text-muted)",
            marginBottom: "1.5rem",
          }}
        >
          Sign up for a new account
        </p>
        <RegisterForm />
        <p
          style={{
            textAlign: "center",
            marginTop: "1.5rem",
            color: "var(--text-muted)",
            fontSize: "0.875rem",
          }}
        >
          Already have an account?{" "}
          <a href="/login">Sign in</a>
        </p>
      </div>
    </div>
  );
}
