import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import api from "./api";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Fièrté",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await api.post("/auth/login", {
            username: credentials.email,
            password: credentials.password,
          }, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
          });

          if (res.data && res.data.access_token) {
            return {
              id: res.data.user.id,
              name: res.data.user.username,
              email: res.data.user.email,
              accessToken: res.data.access_token,
            };
          }
        } catch (error) {
          return null;
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
