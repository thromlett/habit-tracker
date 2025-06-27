import { NextResponse, NextRequest } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

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
  const habit = await prisma.habit.findFirst({ where: { userId, id } });
  return NextResponse.json(habit);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user?.id;
  const habit = await prisma.habit.findFirst({ where: { userId, id } });
  if (!habit) {
    return NextResponse.json({ error: "Habit not found" }, { status: 404 });
  }
  await prisma.habit.delete({ where: { id } });
  return NextResponse.json({ message: "Habit deleted" });
}
