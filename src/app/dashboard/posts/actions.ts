"use server";

import { PrismaPg } from "@prisma/adapter-pg";
import { revalidatePath } from "next/cache";
import { z } from "zod";

import { PrismaClient } from "@/src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

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
});

export async function createPostAction(
  _prevState: CreatePostState,
  formData: FormData,
): Promise<CreatePostState> {
  const validatedPostFields = postSchema.safeParse({
    title: formData.get("title"),
    content: formData.get("content"),
  });

  if (!validatedPostFields.success) {
    return {
      success: false,
      errors: validatedPostFields.error.flatten().fieldErrors,
      message: "入力内容を確認してください",
    };
  }

  const { title, content } = validatedPostFields.data;

  try {
    await prisma.post.create({
      data: {
        title,
        content,
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
  });

  if (!validatedPostFields.success) {
    return {
      success: false,
      errors: validatedPostFields.error.flatten().fieldErrors,
      message: "入力内容を確認してください",
    };
  }

  const { title, content } = validatedPostFields.data;

  await prisma.post.update({
    where: { id },
    data: {
      title,
      content,
    },
  });

  return {
    success: true,
    message: "記事を編集しました",
    errors: {},
  };
}
