import axiosInstance from "@/app/routers/axios";
import { routes } from "@/app/routers/routes";
import { EAPI } from "@/models/general";
import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github"; // Import GitHubProvider

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID ?? "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET ?? "",
    }),
  ],
  pages: {
    signIn: routes.login
  }
  
});

export { handler as GET, handler as POST };
