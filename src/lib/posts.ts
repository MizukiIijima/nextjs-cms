import "server-only";

import { prisma } from "./prisma";
import type { Prisma } from "@/src/generated/prisma/client";

export type PostWithCategory = Prisma.PostGetPayload<{
  include: {
    categories: true;
    tags: true;
  };
}>;

export async function getPosts(): Promise<PostWithCategory[]> {
  return await prisma.post.findMany({
    include: {
      categories: true,
      tags: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
