import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "../../../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user.id;

  // Get all habits for the user
  const habits = await prisma.habit.findMany({
    where: { userId },
    include: { logs: true },
  });

  let streak = 0;
  let continueStreak = true;

  while (continueStreak) {
    continueStreak = false;
    for (const habit of habits) {
      if (!habit.logs[streak]) {
        continueStreak = false;
        break;
      }
      const logDate = new Date(habit.logs[streak].timeStamp);
      const prevDate =
        streak === 0 ? new Date() : new Date(habit.logs[streak - 1].timeStamp);
      const diff = Math.abs(prevDate.getTime() - logDate.getTime());
      const diffDays = diff / (1000 * 60 * 60 * 24);

      if (diffDays <= 1) {
        continueStreak = true;
      } else {
        continueStreak = false;
        break;
      }
    }
    if (continueStreak) {
      streak++;
    }
  }
}
