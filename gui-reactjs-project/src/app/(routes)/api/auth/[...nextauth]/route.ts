import { routes } from "@/app/routers/routes";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    signIn(params) { //{ user, account, profile, email, credentials }
        console.log(params)
        return true;
    }
  },
  pages: {
    signIn: routes.login
  }
  
});

export { handler as GET, handler as POST };
