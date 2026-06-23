import "server-only";

import { PostStatus } from "@/src/generated/prisma/client";
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

export async function getPublishedPostTags() {
  return await prisma.tag.findMany({
    include: {
      _count: {
        select: {
          posts: {
            where: {
              status: PostStatus.PUBLISHED,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function getPublishedTagBySlug(slug: string) {
  return await prisma.tag.findUnique({
    where: {
      slug,
    },
    include: {
      posts: {
        where: {
          status: PostStatus.PUBLISHED,
        },
        include: {
          categories: true,
          tags: true,
          thumbnail: true,
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      },
      _count: {
        select: {
          posts: {
            where: {
              status: PostStatus.PUBLISHED,
            },
          },
        },
      },
    },
  });
}
