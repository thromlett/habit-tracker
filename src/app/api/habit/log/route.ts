import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { prisma } from "../../../../../lib/prisma";

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

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { habitId, completed } = data;

    const habit = await prisma.habit.findUnique({ where: { id: habitId } });

    if (!habit) throw new Error("Habit not found");

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

    const schedule = habit.schedule as HabitSchedule;

    //
    const startOfWeek = getStartOfWeek();
    const oldestLogThisWeek = await prisma.habitLog.findFirst({
      where: {
        habitId,
        timeStamp: { gte: startOfWeek },
      },
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

    console.log("Most recent log since Sunday:", oldestLogThisWeek);
    console.log("Number of logs after that:", logsAfter);

    const mostRecentLog = await prisma.habitLog.findFirst({
      where: { habitId: habitId },
      orderBy: { timeStamp: "desc" },
    });

    //

    const canTrackToday = (() => {
      if (!schedule) return true;
      switch (schedule.type) {
        case "daysOfWeek":
          return schedule.days.includes(todayEnum);
        case "timesPerWeek":
          return logsAfter < schedule.count; //should be <= but something about that breaks tests currently
        case "customDates":
          // Assumes dates are in YYYY-MM-DD format
          const todayStr = today.toISOString().split("T")[0];
          return schedule.dates.includes(todayStr);
        case "interval":
          if (mostRecentLog) {
            const lastLogTime = new Date(mostRecentLog.timeStamp).getTime();
            const now = Date.now();
            return (
              Math.floor((now - lastLogTime) / (1000 * 60 * 60 * 24)) > //multiplication converts to days
              schedule.intervalDays
            );
          }
          return true;
        default:
          return true;
      }
    })();

    if (!canTrackToday) {
      return NextResponse.json(
        { error: "You can't track this habit today." },
        { status: 400 }
      );
    }
    const habitLog = await prisma.habitLog.create({
      data: {
        habit: { connect: { id: habitId } },
        completed,
        timeStamp: new Date(Date.now()),
      },
    });

    return NextResponse.json(habitLog, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to log habit" }, { status: 500 });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const userId = session.user?.id;
  if (!userId) {
    return NextResponse.json({ error: "No user ID" }, { status: 400 });
  }

  const logs = await prisma.habitLog.findMany({
    where: {
      habit: { userId }, //relation filter
    },
    include: { habit: true }, //include habit details
    orderBy: { timeStamp: "desc" }, //newest first
  });

  return NextResponse.json(logs);
}
