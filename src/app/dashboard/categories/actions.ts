"use server";

import { PrismaPg } from "@prisma/adapter-pg";
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

export async function createCategory(formData: FormData) {
  const validatedCategoryFields = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
  });

  if (!validatedCategoryFields.success) {
    return {
      success: false,
      errors: validatedCategoryFields.error.flatten().fieldErrors,
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
}
