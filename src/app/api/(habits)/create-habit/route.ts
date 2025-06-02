import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { disposition, name, userId, schedule } = data;

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
