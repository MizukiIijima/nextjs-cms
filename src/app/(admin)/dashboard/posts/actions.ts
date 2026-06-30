"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { PostStatus } from "@/src/generated/prisma/client";
import { createMediaFromImage } from "@/src/lib/medias";
import { normalizeEscapedCodeBlocks } from "@/src/lib/markdown";
import { getUniquePostSlug } from "@/src/lib/posts";
import { verifySession } from "@/src/lib/auth/dal";

export type CreatePostState = {
  success: boolean;
  message: string;
  errors: {
    title?: string[];
    slug?: string[];
    content?: string[];
    status?: string[];
    thumbnail?: string[];
  };
};

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const thumbnailSchema = z.preprocess(
  (value) => {
    if (value === null) {
      return null;
    }

    if (value instanceof File && value.size === 0) {
      return null;
    }

    return value;
  },
  z
    .file({ error: "画像ファイルを選択してください" })
    .mime(ACCEPTED_IMAGE_TYPES, {
      error: "画像はJPEG、PNG、WebPのいずれかを選択してください",
    })
    .nullable(),
);

const postSchema = z.object({
  title: z.string().trim().min(1, { error: "タイトルは必須です" }),
  slug: z
    .string()
    .trim()
    .max(80, { error: "スラッグは80文字以内で入力してください" })
    .optional(),
  content: z.string().trim().min(1, { error: "本文は必須です" }),
  status: z.enum(PostStatus),
  categoryIds: z.array(z.coerce.number().int().positive()),
  tagIds: z.array(z.coerce.number().int().positive()),
  thumbnail: thumbnailSchema,
});

export async function createPostAction(
  _prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  await verifySession();

  const validatedPostFields = postSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    status: formData.get("status") ?? PostStatus.DRAFT,
    categoryIds: formData.getAll("categoryIds"),
    tagIds: formData.getAll("tagIds"),
    thumbnail: formData.get("thumbnail"),
  });

  if (!validatedPostFields.success) {
    return {
      success: false,
      errors: z.flattenError(validatedPostFields.error).fieldErrors,
      message: "入力内容を確認してください",
    };
  }

  const {
    title,
    slug: slugInput,
    content,
    status,
    categoryIds,
    tagIds,
    thumbnail,
  } = validatedPostFields.data;

  try {
    let thumbnailId: number | undefined;

    if (thumbnail) {
      thumbnailId = await createMediaFromImage(thumbnail, "posts");
    }

    const slug = await getUniquePostSlug(slugInput || title);

    await prisma.post.create({
      data: {
        title,
        slug,
        content: normalizeEscapedCodeBlocks(content),
        status,
        thumbnailId,
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/articles");
    revalidatePath(`/articles/${slug}`);
    revalidatePath("/dashboard/posts");

    return {
      success: true,
      message:
        status === PostStatus.PUBLISHED
          ? "記事を作成しました"
          : "下書き保存しました",
      errors: {},
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "記事の追加に失敗しました",
      errors: {},
    };
  }
}

export async function editPostAction(
  id: number,
  _prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  await verifySession();

  const validatedPostFields = postSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
    status: formData.get("status") ?? PostStatus.DRAFT,
    categoryIds: formData.getAll("categoryIds"),
    tagIds: formData.getAll("tagIds"),
    thumbnail: formData.get("thumbnail"),
  });

  if (!validatedPostFields.success) {
    return {
      success: false,
      errors: z.flattenError(validatedPostFields.error).fieldErrors,
      message: "入力内容を確認してください",
    };
  }

  const {
    title,
    slug: slugInput,
    content,
    status,
    categoryIds,
    tagIds,
    thumbnail,
  } = validatedPostFields.data;

  try {
    let thumbnailId: number | undefined;

    if (thumbnail) {
      thumbnailId = await createMediaFromImage(thumbnail, "posts");
    }

    const slug = await getUniquePostSlug(slugInput || title, id);

    await prisma.post.update({
      where: { id },
      data: {
        title,
        slug,
        content: normalizeEscapedCodeBlocks(content),
        status,
        ...(thumbnailId !== undefined ? { thumbnailId } : {}),
        categories: {
          set: categoryIds.map((id) => ({ id })),
        },
        tags: {
          set: tagIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/articles");
    revalidatePath(`/articles/${slug}`);
    revalidatePath("/dashboard/posts");

    return {
      success: true,
      message:
        status === PostStatus.PUBLISHED
          ? "記事を更新しました"
          : "下書きを更新しました",
      errors: {},
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      message: "記事の更新に失敗しました",
      errors: {},
    };
  }
}
