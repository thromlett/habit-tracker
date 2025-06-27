import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/habit/log/route";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";

jest.mock("next-auth/next", () => ({
  getServerSession: jest.fn(),
}));
jest.mock("@/lib/prisma", () => ({
  prisma: {
    habit: { findUnique: jest.fn() },
    habitLog: {
      findFirst: jest.fn(),
      count: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
    },
  },
}));

describe("GET /api/habit/log", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function makeGetRequest(query = ""): NextRequest {
    const url = new URL(`http://localhost/api/habit/log${query}`);
    return new NextRequest(url.toString(), { method: "GET" });
  }

  it("403s if not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeGetRequest());
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Not authenticated" });
  });

  it("verifyOnly=true returns canTrack", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "u1" } });
    // schedule = null -> always true
    (prisma.habit.findUnique as jest.Mock).mockResolvedValue({
      schedule: null,
    });
    // both findFirst calls return null -> logsAfter = 0, mostRecentLog = null
    (prisma.habitLog.findFirst as jest.Mock)
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    const res = await GET(makeGetRequest("?verifyOnly=true&habitId=hid"));
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({ canTrack: true });
    expect(prisma.habit.findUnique).toHaveBeenCalledWith({
      where: { id: "hid" },
    });
  });
});

describe("POST /api/habit/log", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  interface PostBody {
    habitId: string;
    completed: boolean;
  }

  function makePostRequest(body: PostBody): NextRequest {
    return new NextRequest("http://localhost/api/habit/log", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    });
  }

  it("400s if canTrackToday returns false", async () => {
    // daysOfWeek with no days -> false
    (prisma.habit.findUnique as jest.Mock).mockResolvedValue({
      schedule: { type: "daysOfWeek", days: [] },
    });
    // first findFirst: oldestLogThisWeek -> null, second mostRecentLog -> null
    (prisma.habitLog.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await POST(
      makePostRequest({ habitId: "hid", completed: true })
    );
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      error: "You can't track this habit today.",
    });
  });

  it("creates a log and returns 201 when allowed", async () => {
    // schedule = null => canTrackToday = true
    (prisma.habit.findUnique as jest.Mock).mockResolvedValue({
      schedule: null,
    });
    const fakeLog = {
      id: "log1",
      habitId: "hid",
      completed: false,
      timeStamp: new Date().toISOString(),
    };
    (prisma.habitLog.create as jest.Mock).mockResolvedValue(fakeLog);

    const res = await POST(
      makePostRequest({ habitId: "hid", completed: false })
    );
    expect(prisma.habitLog.create).toHaveBeenCalledWith({
      data: {
        habit: { connect: { id: "hid" } },
        completed: false,
        timeStamp: expect.any(Date),
      },
    });
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual(fakeLog);
  });
});
