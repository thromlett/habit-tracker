import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../lib/prisma";

type HabitSchedule =
  | { type: "daysOfWeek"; days: string[] }
  | { type: "timesPerWeek"; count: number }
  | { type: "customDates"; dates: string[] }
  | { type: "interval"; intervalDays: number; startDate: string }
  | null;

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

    const canTrackToday = (() => {
      if (!schedule) return true;
      switch (schedule.type) {
        case "daysOfWeek":
          return schedule.days.includes(todayEnum);
        case "timesPerWeek":
          return true;
        case "customDates":
          return true;
        case "interval":
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
