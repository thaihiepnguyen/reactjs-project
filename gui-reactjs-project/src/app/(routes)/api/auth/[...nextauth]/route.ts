import axiosInstance from "@/app/routers/axios";
import { routes } from "@/app/routers/routes";
import { EAPI } from "@/models/general";

import NextAuth from "next-auth/next";
import GoogleProvider from "next-auth/providers/google";
import { cookies } from 'next/headers'

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) { //{ user, account, profile, email, credentials }
        await axiosInstance.post('/auth/login-social', {
          provider: account?.provider,
          user: user,
          account: account,
          profile: profile,
          credentials: credentials
        })
        .then((res)=>{
          cookies().set(EAPI.token, JSON.stringify( res.data.token))
        })
        .catch(err => {
          console.log(err)
        })
        return true;
    }
  },
  pages: {
    signIn: routes.login
  }
  
});

export { handler as GET, handler as POST };
