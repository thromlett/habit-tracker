import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { getServerSession } from "next-auth";

export async function GET(req: NextRequest) {
  // Authenticate user
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "No user ID" }, { status: 400 });
  }

  // Fetch all habits for this user
  const habits = await prisma.habit.findMany({ where: { userId } });

  // Build URL for log verification
  const origin = new URL(req.url).origin;
  const logUrlBase = `${origin}/api/habit/log`;

  const loggableHabits = [];

  for (const habit of habits) {
    // Prepare verifyOnly request
    const url = new URL(logUrlBase);
    url.searchParams.set("verifyOnly", "true");
    url.searchParams.set("habitId", habit.id);

    // Call the log endpoint with session cookies
    const res = await fetch(url.toString(), {
      method: "GET",
      headers: { cookie: req.headers.get("cookie") || "" },
    });
    if (!res.ok) continue;

    const { canTrack } = await res.json();
    if (canTrack) {
      loggableHabits.push(habit);
    }
  }

  return NextResponse.json(loggableHabits);
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
