import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Header from "@/components/Header";
import ProfileForm from "@/components/ProfileForm";

export default async function ProfilePage() {
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
      <main style={{ maxWidth: 600, margin: "0 auto", padding: "2rem 1rem" }}>
        <h1 style={{ marginBottom: "2rem" }}>Your Profile</h1>
        <ProfileForm />
      </main>
    </div>
  );
}
