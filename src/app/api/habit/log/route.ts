import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "../../../../lib/prisma";

type HabitSchedule =
  | { type: "daysOfWeek"; days: string[] }
  | { type: "timesPerWeek"; count: number }
  | { type: "customDates"; dates: string[] }
  | { type: "interval"; intervalDays: number }
  | null;

function getStartOfWeek(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

/*
 * Checks whether a habit can be tracked today, based on its schedule.
 */

async function canTrackToday(habitId: string): Promise<boolean> {
  // Fetch habit and its schedule
  const habit = await prisma.habit.findUnique({ where: { id: habitId } });
  if (!habit) throw new Error("Habit not found");

  const schedule = habit.schedule as HabitSchedule;
  const today = new Date();
  const dayEnum = [
    "SUNDAY",
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
  ];
  const todayEnum = dayEnum[today.getDay()];

  //Returns error if habit has already been tracked today
  /*   
  const todayLog = await prisma.habitLog.findFirst({
    where: {
      habitId,
      timeStamp: {
        gte: new Date(today.setHours(0, 0, 0, 0)),
        lt: new Date(today.setHours(23, 59, 59, 999)),
      },
    },
  });
  if (todayLog) {
    throw NextResponse.json(
      { error: "Habit already tracked today" },
      { status: 409 }
    );
  }
 */

  // Count logs since start of the week
  const startOfWeek = getStartOfWeek(today);
  const oldestLogThisWeek = await prisma.habitLog.findFirst({
    where: { habitId, timeStamp: { gte: startOfWeek } },
    orderBy: { timeStamp: "asc" },
  });

  let logsAfter = 0;
  if (oldestLogThisWeek) {
    logsAfter = await prisma.habitLog.count({
      where: {
        habitId,
        timeStamp: { gt: oldestLogThisWeek.timeStamp },
      },
    });
  }

  // Most recent log overall
  const mostRecentLog = await prisma.habitLog.findFirst({
    where: { habitId },
    orderBy: { timeStamp: "desc" },
  });

  // Apply schedule rules
  if (!schedule) return true;
  switch (schedule.type) {
    case "daysOfWeek":
      return schedule.days.includes(todayEnum);
    case "timesPerWeek":
      return logsAfter < schedule.count;
    case "customDates": {
      const todayStr = today.toISOString().split("T")[0];
      return schedule.dates.includes(todayStr);
    }
    case "interval": {
      //also returns true if a habit was logged today to prevent hiding on loggable days after logging
      if (mostRecentLog) {
        const lastLogDate = new Date(mostRecentLog.timeStamp);
        const todayStart = new Date(today);
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(today);
        todayEnd.setHours(23, 59, 59, 999);
        if (lastLogDate >= todayStart && lastLogDate <= todayEnd) {
          return true;
        }
        const lastLogTime = lastLogDate.getTime();
        const now = Date.now();
        const daysSince = Math.floor(
          (now - lastLogTime) / (1000 * 60 * 60 * 24)
        );
        return daysSince > schedule.intervalDays;
      }
      return true;
    }
    case "interval": {
      if (mostRecentLog) {
        const lastLogTime = new Date(mostRecentLog.timeStamp).getTime();
        const now = Date.now();
        const daysSince = Math.floor(
          (now - lastLogTime) / (1000 * 60 * 60 * 24)
        );
        return daysSince > schedule.intervalDays;
      }
      return true;
    }
    default:
      return true;
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "No user ID" }, { status: 400 });
  }

  const { searchParams } = req.nextUrl;
  const verifyOnly = searchParams.get("verifyOnly") === "true";
  const habitId = searchParams.get("habitId");

  if (verifyOnly) {
    if (!habitId) {
      return NextResponse.json({ error: "Missing habitId" }, { status: 400 });
    }
    try {
      const can = await canTrackToday(habitId);
      return NextResponse.json({ canTrack: can });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        { error: (error as Error).message || "Error checking habit" },
        { status: 500 }
      );
    }
  }

  // Existing GET: return full log history
  const logs = await prisma.habitLog.findMany({
    where: { habit: { userId } },
    include: { habit: true },
    orderBy: { timeStamp: "desc" },
  });

  return NextResponse.json(logs);
}

export async function POST(req: NextRequest) {
  try {
    const { habitId, completed } = await req.json();

    // Check if habit can be tracked today using the shared helper
    const can = await canTrackToday(habitId);
    if (!can) {
      return NextResponse.json(
        { error: "You can't track this habit today." },
        { status: 400 }
      );
    }

    const habitLog = await prisma.habitLog.create({
      data: {
        habit: { connect: { id: habitId } },
        completed,
        timeStamp: new Date(),
      },
    });

    return NextResponse.json(habitLog, { status: 201 });
  } catch (error) {
    console.error(error);
    const message = (error as Error).message || "Failed to log habit";
    const status = message === "Habit not found" ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
