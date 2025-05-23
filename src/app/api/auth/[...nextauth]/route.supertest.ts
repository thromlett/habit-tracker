/*import request from "supertest";
import app from "../../test/utils/adapter";

import { prisma } from "../../../../../lib/prisma";
import bcrypt from "bcryptjs";

jest.mock("../../../../../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));
jest.mock("bcryptjs");

describe("POST /api/auth/callback/credentials", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("redirects on valid credentials", async () => {
    const user = { id: "user-123", email: "test@email.com", password: "hashed" };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const res = await request(app)
      .post("/api/auth/callback/credentials")
      .send("email=test@email.com&password=password123&csrfToken=test-csrf")
      .set("Content-Type", "application/x-www-form-urlencoded");

    expect(res.status).toBe(302); // NextAuth usually redirects on success
  });

  it("shows sign-in page on invalid password", async () => {
    const user = { id: "user-123", email: "test@email.com", password: "hashed" };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(user);
    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const res = await request(app)
      .post("/api/auth/callback/credentials")
      .send("email=test@email.com&password=wrongpw&csrfToken=test-csrf")
      .set("Content-Type", "application/x-www-form-urlencoded");

    expect(res.status).toBe(200); // Sign-in page with error
    expect(res.text).toContain("Sign In");
  });
});
*/