"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
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

  return {
    fileName,
    url: blob.url,
    mimeType: file.type,
    size: file.size,
  };
}

export async function createAction(formData: FormData) {
  const validatedFields = profileSchema.safeParse({
    name: formData.get("name"),
    content: formData.get("content"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: validatedFields.error.flatten().fieldErrors,
      message: "入力内容を確認してください",
    };
  }

  const { name, content } = validatedFields.data;

  const image = formData.get("image");

  if (
    image instanceof File &&
    image.size > 0 &&
    !image.type.startsWith("image/")
  ) {
    return {
      success: false,
      errors: {
        image: ["画像ファイルを選択してください"],
      },
      message: "入力内容を確認してください",
    };
  }

  try {
    let imageId: number | undefined;

    if (image instanceof File && image.size > 0) {
      const savedImage = await saveImage(image);

      const media = await prisma.media.create({
        data: {
          fileName: savedImage.fileName,
          url: savedImage.url,
          mimeType: savedImage.mimeType,
          size: savedImage.size,
        },
      });

      imageId = media.id;
    }

    await prisma.profile.create({
      data: {
        name,
        content,
        imageId,
      },
    });

    revalidatePath("/dashboard/profile");

    return {
      success: true,
      errors: {},
      message: "プロフィールを保存しました",
    };
  } catch (error) {
    console.error(error);

    return {
      success: false,
      errors: {},
      message: "プロフィールの保存に失敗しました",
    };
  }
}
