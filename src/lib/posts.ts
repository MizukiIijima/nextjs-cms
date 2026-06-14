import "server-only";

import { prisma } from "./prisma";
import type { Prisma } from "@/src/generated/prisma/client";

export type PostWithCategory = Prisma.PostGetPayload<{
  include: {
    categories: true;
    tags: true;
    thumbnail: true;
  };
}>;

export async function getSinglePost(
  id: number,
): Promise<PostWithCategory | null> {
  return await prisma.post.findUnique({
    where: { id },
    include: {
      categories: true,
      tags: true,
      thumbnail: true,
    },
  });
}

export async function getAllPosts(): Promise<PostWithCategory[]> {
  return await prisma.post.findMany({
    include: {
      categories: true,
      tags: true,
      thumbnail: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
