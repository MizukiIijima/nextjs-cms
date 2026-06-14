import "server-only";

import { prisma } from "./prisma";
import type { Prisma } from "@/src/generated/prisma/client";

export type ProfileWithImage = Prisma.ProfileGetPayload<{
  include: {
    image: true;
  };
}>;

export async function getProfile(): Promise<ProfileWithImage | null> {
  return await prisma.profile.findFirst({
    include: {
      image: true,
    },
    orderBy: {
      createdAt: "asc",
    },
  });
}
