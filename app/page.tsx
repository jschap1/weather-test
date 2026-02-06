import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import WeatherDashboard from "@/components/WeatherDashboard";

export default async function Home() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { profileImage: true },
  });

  return (
    <div>
      <Header username={session.user.name ?? "User"} profileImage={user?.profileImage ?? null} />
      <main style={{ maxWidth: 800, margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ marginBottom: "0.5rem" }}>
          Hello, {session.user.name}!
        </h1>
        <p style={{ color: "var(--text-muted)", marginBottom: "2rem" }}>
          Here&apos;s your local weather
        </p>
        <WeatherDashboard />
      </main>
    </div>
  );
}
