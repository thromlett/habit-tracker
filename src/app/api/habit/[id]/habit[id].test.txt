import { NextRequest } from "next/server";
import { GET, DELETE } from "@/app/api/habit/[id]/route";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));
jest.mock("@/lib/prisma", () => ({
  prisma: {
    habit: {
      findFirst: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe("api/habit/[id]/route", () => {
  const makeReq = () => new NextRequest("http://localhost/api/habit/1");

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("GET", () => {
    it("returns 401 if not authenticated", async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const res = await GET(makeReq(), {
        params: Promise.resolve({ id: "1" }),
      });
      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({ error: "Not authenticated" });
      expect(prisma.habit.findFirst).not.toHaveBeenCalled();
    });

    it("returns the habit when authenticated", async () => {
      const fakeSession = { user: { id: "user-123" } };
      const fakeHabit = { id: "1", name: "Drink water", userId: "user-123" };
      (getServerSession as jest.Mock).mockResolvedValue(fakeSession);
      (prisma.habit.findFirst as jest.Mock).mockResolvedValue(fakeHabit);

      const res = await GET(makeReq(), {
        params: Promise.resolve({ id: "1" }),
      });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual(fakeHabit);
      expect(prisma.habit.findFirst).toHaveBeenCalledWith({
        where: { userId: "user-123", id: "1" },
      });
    });
  });

  describe("DELETE", () => {
    it("returns 401 if not authenticated", async () => {
      (getServerSession as jest.Mock).mockResolvedValue(null);

      const res = await DELETE(makeReq(), {
        params: Promise.resolve({ id: "1" }),
      });
      expect(res.status).toBe(401);
      expect(await res.json()).toEqual({ error: "Not authenticated" });
      expect(prisma.habit.findFirst).not.toHaveBeenCalled();
      expect(prisma.habit.delete).not.toHaveBeenCalled();
    });

    it("deletes and returns success when authenticated", async () => {
      const fakeSession = { user: { id: "user-123" } };
      const fakeHabit = { id: "1", name: "Drink water", userId: "user-123" };
      (getServerSession as jest.Mock).mockResolvedValue(fakeSession);
      (prisma.habit.findFirst as jest.Mock).mockResolvedValue(fakeHabit);
      (prisma.habit.delete as jest.Mock).mockResolvedValue({});

      const res = await DELETE(makeReq(), {
        params: Promise.resolve({ id: "1" }),
      });
      expect(prisma.habit.findFirst).toHaveBeenCalledWith({
        where: { userId: "user-123", id: "1" },
      });
      expect(prisma.habit.delete).toHaveBeenCalledWith({ where: { id: "1" } });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ message: "Habit deleted" });
    });
  });
});
