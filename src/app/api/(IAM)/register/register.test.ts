import { POST } from "./route";
import { prisma } from "../../../../../lib/prisma";
import * as emailModule from "../../../../../lib/email";
import bcrypt from "bcryptjs";
import { NextRequest } from "next/server";

jest.mock("../../../../../lib/email");

describe("POST /api/register", () => {
  beforeEach(async () => {
    await prisma.verificationToken.deleteMany();
    await prisma.user.deleteMany();
    jest.clearAllMocks();
  });

  it("registers a new user and sends a verification email", async () => {
    const email = "integrationtest@example.com";
    const password = "TestPassword123!";
    const userName = "username123";

    (emailModule.sendVerificationEmail as jest.Mock).mockResolvedValue(
      undefined
    );

    const req = new Request("http://localhost/api/register", {
      method: "POST",
      body: JSON.stringify({ email, password, userName }),
      headers: { "Content-Type": "application/json" },
    });
    const nextReq = new NextRequest(req);

    const response = await POST(nextReq);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe("User created. Please verify your email.");

    const dbUser = await prisma.user.findUnique({ where: { email } });
    expect(dbUser).not.toBeNull();
    expect(dbUser?.role).toBe("USER");
    expect(await bcrypt.compare(password, dbUser!.password)).toBe(true);

    const dbToken = await prisma.verificationToken.findFirst({
      where: { identifier: email },
    });
    expect(dbToken).not.toBeNull();
    expect(dbToken?.expires.getTime()).toBeGreaterThan(Date.now());

    expect(emailModule.sendVerificationEmail).toHaveBeenCalledWith({
      to: email,
      verificationUrl: expect.stringContaining("/api/verify?token="),
    });
  });

  /*   it("handles duplicate email", async () => {
    await prisma.user.create({
      data: {
        email: "dupe@example.com",
        password: await bcrypt.hash("abc123!", 10),
        role: "USER",
        emailVerified: null,
      },
    });

     const req = new Request("http://localhost/api/register", {
      method: "POST",
      body: JSON.stringify({
        email: "dupe@example.com",
        password: "newPass123",
        role: "USER",
      }),
      headers: { "Content-Type": "application/json" },
    });
    const nextReq = new NextRequest(req);

    const response = await POST(nextReq);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Failed to create user"); 
  }); */
});
