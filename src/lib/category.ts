import "server-only";

import { prisma } from "./prisma";
import { PostStatus } from "@/src/generated/prisma/client";

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

export async function getPublishedPostCategories() {
  return await prisma.category.findMany({
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

export async function getPublishedCategoryBySlug(slug: string) {
  return await prisma.category.findUnique({
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
