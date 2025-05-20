import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../../../lib/prisma";

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
        // Add your own password check!
        if (user && credentials?.password === user.password) {
          // Don't include password in returned object!
          return { id: user.id, email: user.email };
        }
        return null;
      },
    }),
    // You can add Google, GitHub, etc. here
  ],
  session: {
    strategy: "jwt", // Or 'database' if you want sessions in MongoDB
  },
  secret: process.env.NEXTAUTH_SECRET, // Set in your .env!
};
