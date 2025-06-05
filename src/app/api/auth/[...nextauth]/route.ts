import NextAuth from "next-auth";
import { authOptions } from "./authOptions";

const handler = NextAuth(authOptions);

//Mentioned that having a GET in an auth route is not a good practice
// but it is required for the NextAuth API to work properly
// and is used for the sign-in page and other NextAuth features.
// The POST method is used for the actual authentication process.
// The GET method is used for the sign-in page and other NextAuth features.
export { handler as GET, handler as POST };
