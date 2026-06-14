import "server-only";

import { prisma } from "./prisma";

export async function getSingleMedia(id: number) {
  return await prisma.media.findUnique({
    where: {
      id,
    },
  });
}
