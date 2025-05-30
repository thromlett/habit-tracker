jest.mock("../../../../lib/prisma", () => ({
  prisma: {
    passwordResetToken: {
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      update: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));

import { POST } from "./route";
import { NextRequest } from "next/server";
import { prisma } from "../../../../../lib/prisma";
import bcrypt from "bcryptjs";

function makeReq(body: Record<string, unknown>) {
  const req = new Request("http://localhost/api/reset-password", {
    method: "POST",
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
  });
  return new NextRequest(req);
}

describe("POST /api/reset-password (unit)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 400 if token or newPassword is missing", async () => {
    const req = makeReq({ token: "", newPassword: "" });
    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Token and new password are required");
  });

  it("returns 400 for invalid or expired token", async () => {
    (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue(null);
    const req = makeReq({ token: "fake", newPassword: "foo" });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid or expired token");
    expect(prisma.passwordResetToken.findUnique).toHaveBeenCalledWith({
      where: { token: "fake" },
    });
  });

  it("returns 400 if token is expired", async () => {
    (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue({
      token: "abc",
      identifier: "user@example.com",
      expires: new Date(Date.now() - 1000),
    });

    const req = makeReq({ token: "abc", newPassword: "bar" });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(400);
    expect(data.error).toBe("Invalid or expired token");
  });

  it("resets the password for valid token", async () => {
    const now = new Date(Date.now() + 60 * 1000);
    (prisma.passwordResetToken.findUnique as jest.Mock).mockResolvedValue({
      token: "token123",
      identifier: "user@example.com",
      expires: now,
    });
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPw!");
    (prisma.user.update as jest.Mock).mockResolvedValue({});
    (prisma.passwordResetToken.delete as jest.Mock).mockResolvedValue({});

    const req = makeReq({ token: "token123", newPassword: "myNewPw" });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data.message).toBe("Password reset successfully");

    expect(bcrypt.hash).toHaveBeenCalledWith("myNewPw", 10);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { email: "user@example.com" },
      data: { password: "hashedPw!" },
    });
    expect(prisma.passwordResetToken.delete).toHaveBeenCalledWith({
      where: { token: "token123" },
    });
  });

  it("returns 500 on unexpected error", async () => {
    (prisma.passwordResetToken.findUnique as jest.Mock).mockRejectedValue(
      new Error("db error")
    );
    const req = makeReq({ token: "abc", newPassword: "bar" });

    const res = await POST(req);
    const data = await res.json();

    expect(res.status).toBe(500);
    expect(data.error).toBe("Failed to reset password");
  });
});
