"use server";

import { revalidatePath } from "next/cache";
import { success, z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { put } from "@vercel/blob";
import { randomUUID } from "node:crypto";

const profileSchema = z.object({
  name: z.string().trim().min(1, { error: "名前は必須です" }),
  content: z.string().trim().min(1, { error: "本文は必須です" }),
});

async function saveImage(file: File) {
  const ext = file.name.split(".").pop() ?? "png";
  const fileName = `${randomUUID()}.${ext}`;

  const blob = await put(`profile/${fileName}`, file, {
    access: "public",
  });

  return blob.url;
}

export async function createAction(formData: FormData) {
  const validatedFields = profileSchema.safeParse({
    image: formData.get("image"),
    name: formData.get("name"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      error: validatedFields.error.flatten().fieldErrors,
      message: "入力内容を確認してください",
    };
  }

  const { name, content } = validatedFields.data;

  const image = formData.get("image");
  let imageUrl: string | undefined;

  if (image instanceof File && image.size > 0) {
    if (!image.type.startsWith("image/")) {
      return {
        success: false,
        errors: {
          image: ["画像ファイルを選択してください"],
        },
        message: "入力内容を確認してください",
      }
    }
    imageUrl = await saveImage(image);
  }

  try {
    await prisma.profile.create({
      data: {
        imageUrl,
        name,
        content
      }
    })
  }
}
