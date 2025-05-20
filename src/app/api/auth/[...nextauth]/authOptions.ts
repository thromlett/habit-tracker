import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../../../lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // TODO: Add your user lookup logic here!
        const user = await prisma.user.findUnique({
          where: { email: credentials?.email },
        });
        if (!user) return null;
        const isValidPassword = await bcrypt.compare(
          credentials?.password || "",
          user.password
        );
        if (!isValidPassword) return null;
        return {
          id: user.id,
          email: user.email,
        };
      },
    }),
    // You can add Google, GitHub, etc. here
  ],
  session: {
    strategy: "jwt", // Or 'database' if you want sessions in MongoDB
  },
  secret: process.env.NEXTAUTH_SECRET,
};