// next-auth.d.ts
import { DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null; // <-- Add this!
    }
  }
  interface User extends DefaultUser {
    role?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null;
  }
}
