import type { MetadataRoute } from "next";
import { PostStatus } from "@/src/generated/prisma/client";
import { prisma } from "@/src/lib/prisma";

const baseUrl = (process.env.SITE_URL ?? "http://localhost:3000").replace(
  /\/$/,
  "",
);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, tags] = await Promise.all([
    prisma.post.findMany({
      where: {
        status: PostStatus.PUBLISHED,
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
    prisma.category.findMany({
      where: {
        posts: {
          some: {
            status: PostStatus.PUBLISHED,
          },
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
    prisma.tag.findMany({
      where: {
        posts: {
          some: {
            status: PostStatus.PUBLISHED,
          },
        },
      },
      select: {
        slug: true,
        updatedAt: true,
      },
    }),
  ]);

  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/categories`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tags`,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...posts.map((post) => ({
      url: `${baseUrl}/articles/${encodeURIComponent(post.slug)}`,
      lastModified: post.updatedAt,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...categories.map((category) => ({
      url: `${baseUrl}/categories/${encodeURIComponent(category.slug)}`,
      lastModified: category.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...tags.map((tag) => ({
      url: `${baseUrl}/tags/${encodeURIComponent(tag.slug)}`,
      lastModified: tag.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
