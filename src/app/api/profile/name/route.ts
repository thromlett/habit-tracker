import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

async function getUserName(userId: string): Promise<string | null> {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user?.userName ?? null;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    const userName = await getUserName(userId);
    if (!userName) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }
    return NextResponse.json({ userName }, { status: 200 });
  } catch (error) {
    console.error("Error fetching userName:", error);
    return NextResponse.json(
      { error: "Failed to fetch userName" },
      { status: 500 }
    );
  }
}
