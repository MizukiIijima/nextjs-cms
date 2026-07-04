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

export async function getCategoriesPage(page = 1, categoriesPerPage = 10) {
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
    skip: (page - 1) * categoriesPerPage,
    take: categoriesPerPage,
  });
}

export async function getCategoryCount() {
  return await prisma.category.count();
}

export async function getCategoryMetadataBySlug(slug: string) {
  return await prisma.category.findUnique({
    where: {
      slug,
    },
    select: {
      name: true,
      description: true,
    },
  });
}

export async function getPublishedCategoryBySlug(
  slug: string,
  page = 1,
  postsPerPage = 10,
) {
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
          thumbnail: true,
        },
        orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
        skip: (page - 1) * postsPerPage,
        take: postsPerPage,
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
