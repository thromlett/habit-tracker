import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "../../../../../lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "No user ID" }, { status: 400 });
  }

  const logs = await prisma.habitLog.findFirst({
    where: {
      habit: { userId, id }, //relation filter
    },
    include: { habit: true }, //include habit details
  });

  if (!logs)
    return NextResponse.json({ error: "Habit log not found" }, { status: 404 });
  return NextResponse.json(logs);
}
