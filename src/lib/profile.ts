import "server-only";

import { prisma } from "./prisma";
import type { Profile } from "@/src/generated/prisma/client";

export async function getProfile(): Promise<Profile | null> {
  return await prisma.profile.findFirst({
    include: {
      image: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
