jest.mock("../../../../../lib/prisma", () => ({
  prisma: {
    habit: {
      findUnique: jest.fn(),
    },
    habitLog: {
      findFirst: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
  },
}));

import { POST } from "./route";
import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma";

// Helper for NextRequest with JSON
function makeReq(body: Record<string, unknown>) {
  const req = new Request("http://localhost/api/habitLog", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  return new NextRequest(req);
}

const habitId = "habit-abc";
//const userId = "user-xyz";

describe("POST /api/habitLog (unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 500 if habit not found", async () => {
    (prisma.habit.findUnique as jest.Mock).mockResolvedValue(null);

    const req = makeReq({ habitId, completed: true });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500); // because you throw; you could return 404 instead!
    expect(data.error).toMatch(/failed to log habit/i);
  });

  it("allows log for daysOfWeek type on allowed day", async () => {
    (prisma.habit.findUnique as jest.Mock).mockResolvedValue({
      id: habitId,
      schedule: { type: "daysOfWeek", days: ["MONDAY"] },
    });

    (prisma.habitLog.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.habitLog.create as jest.Mock).mockResolvedValue({ id: "log1" });

    // Set system day to Monday
    const originalDate = Date;
    global.Date = class extends Date {
      constructor() {
        super();
        return new originalDate("2024-06-03T12:00:00Z"); // Monday
      }
      static now() {
        return new originalDate("2024-06-03T12:00:00Z").getTime();
      }
    } as unknown as DateConstructor;

    const req = makeReq({ habitId, completed: true });
    const res = await POST(req);
    //const data = await res.json();

    expect(res.status).toBe(201);
    expect(prisma.habitLog.create).toHaveBeenCalled();

    // Restore Date
    global.Date = originalDate;
  });

  it("denies log for daysOfWeek type on not allowed day", async () => {
    (prisma.habit.findUnique as jest.Mock).mockResolvedValue({
      id: habitId,
      schedule: { type: "daysOfWeek", days: ["TUESDAY"] },
    });

    (prisma.habitLog.findFirst as jest.Mock).mockResolvedValue(null);

    // Set system day to Monday
    const originalDate = Date;
    global.Date = class extends Date {
      constructor() {
        super();
        return new originalDate("2024-06-03T12:00:00Z"); // Monday
      }
      static now() {
        return new originalDate("2024-06-03T12:00:00Z").getTime();
      }
    } as unknown as DateConstructor;

    const req = makeReq({ habitId, completed: true });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/can't track/i);

    global.Date = originalDate;
  });

  it("denies log for timesPerWeek if limit reached", async () => {
    (prisma.habit.findUnique as jest.Mock).mockResolvedValue({
      id: habitId,
      schedule: { type: "timesPerWeek", count: 2 },
    });

    (prisma.habitLog.findFirst as jest.Mock).mockResolvedValue({
      id: "logA",
      timeStamp: new Date(),
    });
    (prisma.habitLog.count as jest.Mock).mockResolvedValue(2);

    const req = makeReq({ habitId, completed: true });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/can't track/i);
  });

  it("allows log for customDates if today is allowed", async () => {
    const today = new Date();
    const todayStr = today.toISOString().split("T")[0];

    (prisma.habit.findUnique as jest.Mock).mockResolvedValue({
      id: habitId,
      schedule: { type: "customDates", dates: [todayStr] },
    });

    (prisma.habitLog.findFirst as jest.Mock).mockResolvedValue(null);
    (prisma.habitLog.create as jest.Mock).mockResolvedValue({ id: "log1" });

    const req = makeReq({ habitId, completed: true });
    const res = await POST(req);
    // const data = await res.json();

    expect(res.status).toBe(201);
    expect(prisma.habitLog.create).toHaveBeenCalled();
  });

  it("denies log for interval if not enough days since last log", async () => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000);

    (prisma.habit.findUnique as jest.Mock).mockResolvedValue({
      id: habitId,
      schedule: { type: "interval", intervalDays: 3 },
    });
    (prisma.habitLog.findFirst as jest.Mock).mockResolvedValue({
      id: "log1",
      timeStamp: oneDayAgo,
    });

    const req = makeReq({ habitId, completed: true });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toMatch(/can't track/i);
  });

  it("allows log for interval if enough days since last log", async () => {
    const now = new Date();
    const fourDaysAgo = new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000);

    (prisma.habit.findUnique as jest.Mock).mockResolvedValue({
      id: habitId,
      schedule: { type: "interval", intervalDays: 3 },
    });
    (prisma.habitLog.findFirst as jest.Mock).mockResolvedValue({
      id: "log1",
      timeStamp: fourDaysAgo,
    });
    (prisma.habitLog.create as jest.Mock).mockResolvedValue({ id: "log2" });

    const req = makeReq({ habitId, completed: true });
    const res = await POST(req);
    // const data = await res.json();

    expect(res.status).toBe(201);
    expect(prisma.habitLog.create).toHaveBeenCalled();
  });

  it("returns 500 on DB error", async () => {
    (prisma.habit.findUnique as jest.Mock).mockRejectedValue(
      new Error("db error")
    );

    const req = makeReq({ habitId, completed: true });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toMatch(/failed/i);
  });
});
