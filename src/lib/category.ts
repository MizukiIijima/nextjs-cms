import "server-only";

import { prisma } from "./prisma";

export async function getAllCategories() {
  return await prisma.category.findMany({
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getSingleCategory(id: number) {
  return await prisma.category.findUnique({
    where: {
      id,
    },
  });
}
