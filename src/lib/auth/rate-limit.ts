import "server-only";

import { createHmac } from "node:crypto";
import { headers } from "next/headers";

import { prisma } from "@/src/lib/prisma";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000;

function getRateLimitSecret() {
  const secret = process.env.LOGIN_RATE_LIMIT_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("LOGIN_RATE_LIMIT_SECRETを32文字以上で設定してください");
  }

  return secret;
}

async function getClientIp() {
  const headerStore = await headers();

  const forwardedFor = headerStore.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return headerStore.get("x-real-ip") ?? "unknown";
}

function getCurrentWindow(now: Date) {
  const windowStartedAt = Math.floor(now.getTime() / WINDOW_MS) * WINDOW_MS;

  return {
    windowStartedAt,
    expiresAt: new Date(windowStartedAt + WINDOW_MS),
  };
}

async function createRateLimitKey(email: string, windowStartedAt: number) {
  const clientIp = await getClientIp();

  return createHmac("sha256", getRateLimitSecret())
    .update(JSON.stringify([clientIp, email, windowStartedAt]))
    .digest("hex");
}

export async function consumeLoginAttempt(email: string) {
  const now = new Date();
  const { windowStartedAt, expiresAt } = getCurrentWindow(now);

  const key = await createRateLimitKey(email, windowStartedAt);

  const rateLimit = await prisma.loginRateLimit.upsert({
    where: {
      key,
    },
    create: {
      key,
      attempts: 1,
      expiresAt,
    },
    update: {
      attempts: {
        increment: 1,
      },
    },
    select: {
      attempts: true,
      expiresAt: true,
    },
  });

  if (rateLimit.attempts > MAX_ATTEMPTS) {
    return {
      allowed: false as const,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((rateLimit.expiresAt.getTime() - now.getTime()) / 1000),
      ),
    };
  }

  return {
    allowed: true as const,
    key,
  };
}

export async function resetLoginAttempts(key: string) {
  await prisma.loginRateLimit.deleteMany({
    where: {
      OR: [
        {
          key,
        },
        {
          expiresAt: {
            lte: new Date(),
          },
        },
      ],
    },
  });
}
