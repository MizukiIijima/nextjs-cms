import "server-only";

import { betterAuth } from "better-auth";
import { prismaAdapter } from "@better-auth/prisma-adapter";
import { nextCookies } from "better-auth/next-js";

import { prisma } from "@/src/lib/prisma";
import { hashPassword, verifyPassword } from "@/src/lib/auth/password";

export const auth = betterAuth({
  appName: "zimamemo",
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
    transaction: true,
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: true,
    minPasswordLength: 12,
    maxPasswordLength: 256,
    password: {
      hash: hashPassword,
      verify: ({ hash, password }) => verifyPassword(password, hash),
    },
  },
  session: {
    expiresIn: 7 * 24 * 60 * 60,
    cookieCache: { enabled: false },
  },
  advanced: {
    database: { generateId: "serial" },
  },
  rateLimit: {
    enabled: true,
    storage: "database",
    customRules: {
      "/sign-in/email": { window: 15 * 60, max: 5 },
    },
  },
  plugins: [nextCookies()],
});
