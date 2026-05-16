"use server";

import { PrismaPg } from "@prisma/adapter-pg";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { PrismaClient } from "@/src/generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

const categorySchema = z.object({
  name: z.string().trim().min(1, { error: "カテゴリ名は必須です。" }),
  slug: z.string().trim().optional(),
  description: z.string().trim().optional(),
});

const categoryIdSchema = z.coerce.number().int().positive();

export type CategoryFormState = {
  success: boolean;
  errors?: {
    name?: string[];
    slug?: string[];
    description?: string[];
  };
  message: string;
};

export async function createCategory(
  prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const validatedCategoryFields = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
  });

  if (!validatedCategoryFields.success) {
    const { fieldErrors } = z.flattenError(validatedCategoryFields.error);
    return {
      success: false,
      errors: fieldErrors,
      message: "入力内容を確認してください",
    };
  }

  const { name, description } = validatedCategoryFields.data;
  const slug = validatedCategoryFields.data.slug || name;

  await prisma.category.create({
    data: {
      name,
      slug,
      description,
    },
  });

  revalidatePath("/dashboard/categories");

  return {
    success: true,
    message: "カテゴリを作成しました",
  };
}

export async function updateCategory(
  prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  const validatedCategoryId = categoryIdSchema.safeParse(formData.get("id"));
  const validatedCategoryFields = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
  });

  if (!validatedCategoryId.success || !validatedCategoryFields.success) {
    const fieldErrors = validatedCategoryFields.success
      ? {}
      : z.flattenError(validatedCategoryFields.error).fieldErrors;

    return {
      success: false,
      errors: fieldErrors,
      message: "入力内容を確認してください",
    };
  }

  const { name, description } = validatedCategoryFields.data;
  const slug = validatedCategoryFields.data.slug || name;

  await prisma.category.update({
    where: {
      id: validatedCategoryId.data,
    },
    data: {
      name,
      slug,
      description,
    },
  });

  revalidatePath("/dashboard/categories");

  return {
    success: true,
    message: "カテゴリを更新しました",
  };
}
