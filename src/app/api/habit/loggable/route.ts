import { NextResponse } from "next/server";
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
    default:
      return true;
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

  const habits = await prisma.habit.findMany({
    where: { userId },
  });
  const maybeLoggable = await Promise.all(
    habits.map(async (habit) => {
      const canLog = await canTrackToday(habit.id);
      return canLog ? habit : null;
    })
  );

  //filters nulls
  const loggableHabits = maybeLoggable.filter(
    (h): h is (typeof habits)[0] & { canLog: true } => h !== null
  );

  return NextResponse.json(loggableHabits);
}
/* Might be a useful refactor in the future. Returns the json of habit with a "canLog" boolean appended to the end.
  const habits = await prisma.habit.findMany({
    where: { userId },
  });
  const loggableHabits = await Promise.all(
    habits.map(async (habit) => {
      const canLog = await canTrackToday(habit.id);
      return { ...habit, canLog };
    })
  );
  return NextResponse.json(loggableHabits);
*/
