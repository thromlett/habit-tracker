// __tests__/api/habit/log/[id]/route.test.ts
import { NextRequest } from "next/server";
import { GET } from "@/app/api/habit/log/[id]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));
jest.mock("@/lib/prisma", () => ({
  prisma: {
    habitLog: {
      findFirst: jest.fn(),
    },
  },
}));

describe("GET /api/habit/log/[id]", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  function makeRequest(): NextRequest {
    return new NextRequest("http://localhost/api/habit/log/123", {
      method: "GET",
    });
  }
  const params = Promise.resolve({ id: "123" });

  it("returns 401 when not authenticated", async () => {
    (getServerSession as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeRequest(), { params });
    expect(res.status).toBe(401);
    expect(await res.json()).toEqual({ error: "Not authenticated" });
  });

  it("returns 400 when session has no user ID", async () => {
    // simulate session.user.id empty
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "" } });

    const res = await GET(makeRequest(), { params });
    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({ error: "No user ID" });
  });

  it("returns 404 when no log is found", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "u1" } });
    (prisma.habitLog.findFirst as jest.Mock).mockResolvedValue(null);

    const res = await GET(makeRequest(), { params });
    expect(prisma.habitLog.findFirst).toHaveBeenCalledWith({
      where: { habit: { userId: "u1", id: "123" } },
      include: { habit: true },
    });
    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({ error: "Habit log not found" });
  });

  it("returns the log when found", async () => {
    (getServerSession as jest.Mock).mockResolvedValue({ user: { id: "u1" } });
    const fakeLog = { id: "log1", habit: { id: "123", name: "Test Habit" } };
    (prisma.habitLog.findFirst as jest.Mock).mockResolvedValue(fakeLog);

    const res = await GET(makeRequest(), { params });
    expect(prisma.habitLog.findFirst).toHaveBeenCalledWith({
      where: { habit: { userId: "u1", id: "123" } },
      include: { habit: true },
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(fakeLog);
  });
});
