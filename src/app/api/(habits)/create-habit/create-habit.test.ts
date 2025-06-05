// Place mocks *before* imports!
jest.mock("../../../../../lib/prisma", () => ({
  prisma: {
    habit: {
      create: jest.fn(),
    },
  },
}));

import { POST } from "./route";
import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma";

// Helper to make a NextRequest with JSON body
function makeReq(body: Record<string, unknown>) {
  const req = new Request("http://localhost/api/habits", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  return new NextRequest(req);
}

describe("POST /api/habits (unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if disposition is invalid", async () => {
    const req = makeReq({
      disposition: "OK",
      name: "Exercise",
      userId: "user1",
      schedule: { type: "daysOfWeek", days: ["MONDAY"] },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid disposition");
    expect(prisma.habit.create).not.toHaveBeenCalled();
  });

  it("creates habit with valid data", async () => {
    // Set up mock return value
    (prisma.habit.create as jest.Mock).mockResolvedValue({
      id: "habit123",
      disposition: "GOOD",
      name: "Exercise",
      userId: "user1",
      createdAt: expect.any(Date),
      schedule: { type: "daysOfWeek", days: ["MONDAY"] },
    });

    const req = makeReq({
      disposition: "GOOD",
      name: "Exercise",
      userId: "user1",
      schedule: { type: "daysOfWeek", days: ["MONDAY"] },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(201);
    expect(prisma.habit.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        disposition: "GOOD",
        name: "Exercise",
        user: { connect: { id: "user1" } },
        schedule: { type: "daysOfWeek", days: ["MONDAY"] },
      }),
    });
    expect(data.id).toBe("habit123");
    expect(data.disposition).toBe("GOOD");
  });

  it("returns 500 on error", async () => {
    (prisma.habit.create as jest.Mock).mockRejectedValue(new Error("db error"));
    const req = makeReq({
      disposition: "GOOD",
      name: "Exercise",
      userId: "user1",
      schedule: { type: "daysOfWeek", days: ["MONDAY"] },
    });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Failed to create habit");
  });
});
