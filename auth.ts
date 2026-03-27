import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
// If you want standard PrismaAdapter, uncomment later:
// import { PrismaAdapter } from "@auth/prisma-adapter"
// import { prisma } from "./lib/prisma"
import bcrypt from "bcryptjs"

export const { handlers, signIn, signOut, auth } = NextAuth({
  // adapter: PrismaAdapter(prisma), // Wait until DB is up to enable this
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Here you would find a user, verify hash, and return them
        // For demonstration, let's accept any valid email structure just to show auth is wired up
        const user = { id: "1", name: "Dev User", email: credentials.email as string }
        return user
      },
    }),
  ],
})
