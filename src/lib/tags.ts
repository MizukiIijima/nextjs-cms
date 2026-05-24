import { prisma } from "./prisma";

export async function getAllTags() {
  return await prisma.tag.findMany({
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
