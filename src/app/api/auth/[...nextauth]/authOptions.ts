import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import GoogleProvider from "next-auth/providers/google";

type Credentials = { email?: string; password?: string };

const authorizeEmail = async (credentials: Credentials | undefined) => {
  if (!credentials) return null;

  const user = await prisma.user.findUnique({
    where: { email: credentials.email },
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
    role: user.role,
  };
};

const emailAuthorizationProvider = CredentialsProvider({
  name: "Credentials",
  credentials: {
    email: { label: "Email", type: "email" },
    password: { label: "Password", type: "password" },
  },
  authorize: authorizeEmail,
});

export const authOptions: NextAuthOptions = {
  providers: [
    emailAuthorizationProvider,
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt", // Or 'database' if you want sessions in MongoDB
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role; // Include role in JWT
        token.id = user.id; //include id in JWT
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.role && token?.id) {
        session.user.role = token.role; // Pass role to session.user
        session.user.id = token.id as string;
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};
