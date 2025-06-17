import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user?.id;
  const habits = await prisma.habit.findMany({ where: { userId } });
  return NextResponse.json(habits);
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    const userId = session.user.id;

    const data = await req.json();
    const { disposition, name, schedule } = data;

    const allowedDispositions = ["GOOD", "BAD"];

    if (!allowedDispositions.includes(disposition)) {
      return NextResponse.json(
        { error: "Invalid disposition" },
        { status: 400 }
      );
    }

    const habit = await prisma.habit.create({
      data: {
        disposition,
        name,
        user: { connect: { id: userId } },
        createdAt: new Date(Date.now()),
        schedule,
        description: data.description ?? null,
      },
    });

    return NextResponse.json(habit, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create habit" },
      { status: 500 }
    );
  }
}
