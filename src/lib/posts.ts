import "server-only";

import { prisma } from "./prisma";
import { PostStatus, type Prisma } from "@/src/generated/prisma/client";
import { createSlug } from "@/src/lib/utils";

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

export async function getPublishedPostBySlug(
  slug: string,
): Promise<PostWithCategory | null> {
  return await prisma.post.findFirst({
    where: {
      slug,
      status: PostStatus.PUBLISHED,
    },
    include: {
      categories: true,
      tags: true,
      thumbnail: true,
    },
  });
}

export async function getUniquePostSlug(value: string, excludeId?: number) {
  const baseSlug = createSlug(value).slice(0, 120);
  let slug = baseSlug;
  let suffix = 2;

  while (
    await prisma.post.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    })
  ) {
    const suffixText = String(suffix);
    slug = `${baseSlug.slice(0, 120 - suffixText.length)}${suffixText}`;
    suffix += 1;
  }

  return slug;
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

export async function getPublishedPosts(
  page = 1,
  postsPerPage = 10,
): Promise<PostWithCategory[]> {
  return await prisma.post.findMany({
    where: {
      status: PostStatus.PUBLISHED,
    },
    include: {
      categories: true,
      tags: true,
      thumbnail: true,
    },
    orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    skip: (page - 1) * postsPerPage,
    take: postsPerPage,
  });
}

export async function getPublishedPostCount() {
  return await prisma.post.count({
    where: {
      status: PostStatus.PUBLISHED,
    },
  });
}

export async function getPostNav(createdAt: Date) {
  const select = {
    title: true,
    slug: true,
  } as const;

  const [newer, older] = await Promise.all([
    prisma.post.findFirst({
      where: {
        status: PostStatus.PUBLISHED,
        createdAt: {
          gt: createdAt,
        },
      },
      select,
      orderBy: {
        createdAt: "asc",
      },
    }),
    prisma.post.findFirst({
      where: {
        status: PostStatus.PUBLISHED,
        createdAt: {
          lt: createdAt,
        },
      },
      select,
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  return {
    newer,
    older,
  };
}
