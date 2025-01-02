import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { verifyUserCredentials } from "@/lib/auth";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "email@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const { email, password } = credentials;
        const user = await verifyUserCredentials(email, password);
        console.log("Next auth", user);
        if (user) return user;
        return null;
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET, // Add your secret here
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user_id = user.user_id;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.user_id = token.sub;
        session.user.email = token.email;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
