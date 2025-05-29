import { authOptions } from "./authOptions";
import bcrypt from "bcryptjs";

jest.mock("../../../../../lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));
import { prisma } from "../../../../../lib/prisma";

const authorize = authOptions.providers[0].options.authorize;

describe("NextAuth", () => {
  it("returns user data on successful login", async () => {
    const email = "test@email.com";
    const password = "password123";
    const hashedPassword = await bcrypt.hash(password, 10);

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-id",
      email,
      password: hashedPassword,
    });

    const credentials = { email, password };
    const user = await authorize(credentials);

    expect(user).toEqual({
      id: "user-id",
      email,
    });
  });

  it("returns null on invalid credentials", async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);
    const credentials = { email: "none@email.com", password: "wrongpassword" };
    const user = await authorize(credentials);
    expect(user).toBeNull();
  });

  it("returns null on invalid password", async () => {
    const email = "test@email.com";
    const password = "wrongpassword";
    const hashedPassword = await bcrypt.hash("password123", 10);

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "user-id",
      email,
      password: hashedPassword,
    });

    const credentials = { email, password };
    const user = await authorize(credentials);

    expect(user).toBeNull();
  });
});
