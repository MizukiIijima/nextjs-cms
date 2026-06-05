"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";

export type CreatePostState = {
  success: boolean;
  message: string;
  errors: {
    title?: string[];
    content?: string[];
  };
};

const postSchema = z.object({
  title: z.string().trim().min(1, { error: "タイトルは必須です" }),
  content: z.string().trim().min(1, { error: "本文は必須です" }),
  categoryIds: z.array(z.coerce.number().int().positive()),
  tagIds: z.array(z.coerce.number().int().positive()),
});

export async function createPostAction(
  _prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const validatedPostFields = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    categoryIds: formData.getAll("categoryIds"),
    tagIds: formData.getAll("tagIds"),
  });

  if (!validatedPostFields.success) {
    return {
      success: false,
      errors: validatedPostFields.error.flatten().fieldErrors,
      message: "入力内容を確認してください",
    };
  }

  const { title, content, categoryIds, tagIds } = validatedPostFields.data;

  try {
    await prisma.post.create({
      data: {
        title,
        content,
        categories: {
          connect: categoryIds.map((id) => ({ id })),
        },
        tags: {
          connect: tagIds.map((id) => ({ id })),
        },
      },
    });

    revalidatePath("/articles");
    revalidatePath("/dashboard/posts");

    return {
      success: true,
      message: "記事を作成しました",
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
  const validatedPostFields = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
    categoryIds: formData.getAll("categoryIds"),
    tagIds: formData.getAll("tagIds"),
  });

  if (!validatedPostFields.success) {
    return {
      success: false,
      errors: validatedPostFields.error.flatten().fieldErrors,
      message: "入力内容を確認してください",
    };
  }

  const { title, content, categoryIds, tagIds } = validatedPostFields.data;

  await prisma.post.update({
    where: { id },
    data: {
      title,
      content,
      categories: {
        set: categoryIds.map((id) => ({ id })),
      },
      tags: {
        set: tagIds.map((id) => ({ id })),
      },
    },
  });

  return {
    success: true,
    message: "記事を編集しました",
    errors: {},
  };
}
