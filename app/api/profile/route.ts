import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { validateUsername } from "@/lib/validation";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, email: true, username: true, profileImage: true, createdAt: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PATCH(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { username, profileImage } = body;

  const data: Record<string, string> = {};

  if (username !== undefined) {
    const usernameError = validateUsername(username);
    if (usernameError) {
      return NextResponse.json({ error: usernameError }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { username } });
    if (existing && existing.id !== session.user.id) {
      return NextResponse.json({ error: "Username already taken" }, { status: 409 });
    }
    data.username = username;
  }

  if (profileImage !== undefined) {
    if (profileImage !== null && typeof profileImage !== "string") {
      return NextResponse.json({ error: "Invalid profile image" }, { status: 400 });
    }
    // Validate base64 data URL format and size (max ~2MB encoded)
    if (profileImage !== null) {
      if (!profileImage.startsWith("data:image/")) {
        return NextResponse.json({ error: "Profile image must be an image file" }, { status: 400 });
      }
      if (profileImage.length > 2_800_000) {
        return NextResponse.json({ error: "Profile image must be under 2MB" }, { status: 400 });
      }
    }
    data.profileImage = profileImage;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: session.user.id },
    data,
    select: { id: true, email: true, username: true, profileImage: true, createdAt: true },
  });

  return NextResponse.json(updated);
}
