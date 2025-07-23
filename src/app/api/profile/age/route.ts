import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    return NextResponse.json({ error: "Not Authenticated" }, { status: 401 });
  }

  const userId = session.user.id;

  const habit = await prisma.habit.findFirst({
    where: { userId },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true },
  });

  if (!habit?.createdAt) {
    return NextResponse.json(
      { error: "Could not find user creation date" },
      { status: 404 }
    );
  }

  const d1 = habit.createdAt;
  const d2 = new Date();

  const diffMs = Math.abs(d2.getTime() - d1.getTime());

  const accountAge = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return NextResponse.json({ accountAge });
}
