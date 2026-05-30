"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { Prisma } from "@/src/generated/prisma/client";
import { prisma } from "@/src/lib/prisma";

const tagSchema = z.object({
  name: z.string().trim().min(1, { error: "タグ名は必須です" }),
  slug: z.string().trim().optional(),
});

const tagIdSchema = z.coerce.number().int().positive();

export type TagFormState = {
  success: boolean;
  errors?: {
    name?: string[];
    slug?: string[];
  };
  message: string;
};

export async function createTag(
  _prevState: TagFormState,
  formData: FormData,
): Promise<TagFormState> {
  const validatedTagFields = tagSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
  });

  if (!validatedTagFields.success) {
    const { fieldErrors } = z.flattenError(validatedTagFields.error);
    return {
      success: false,
      errors: fieldErrors,
      message: "入力内容を確認してください",
    };
  }

  const { name } = validatedTagFields.data;
  const slug = validatedTagFields.data.slug || name;

  try {
    await prisma.tag.create({
      data: {
        name,
        slug,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "同じ名前またはslugのタグが既にあります",
      };
    }

    throw error;
  }

  revalidatePath("/dashboard/tags");

  return {
    success: true,
    message: "タグを作成しました",
  };
}

export async function editTag() {}

export async function deleteTag(
  _prevState: TagFormState,
  formData: FormData,
): Promise<TagFormState> {
  const validatedTagId = tagIdSchema.safeParse(formData.get("id"));

  if (!validatedTagId.success) {
    return {
      success: false,
      message: "削除対象のタグが正しくありません",
    };
  }

  try {
    await prisma.tag.delete({
      where: {
        id: validatedTagId.data,
      },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return {
        success: false,
        message: "タグが見つかりませんでした",
      };
    }

    throw error;
  }

  revalidatePath("/dashboard/tags");

  return {
    success: true,
    message: "タグを削除しました",
  };
}
