"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { prisma } from "@/src/lib/prisma";
import { createMediaFromImage } from "@/src/lib/medias";
import { verifySession } from "@/src/lib/auth/dal";

export type ProfileState = {
  success: boolean;
  message: string;
  errors: {
    image?: string[];
    name?: string[];
    content?: string[];
  };
};

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const imageSchema = z.preprocess(
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

const profileSchema = z.object({
  name: z.string().trim().min(1, { error: "名前は必須です" }),
  content: z.string().trim().min(1, { error: "本文は必須です" }),
  image: imageSchema,
});

export async function createAction(
  _prevState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  await verifySession();

  const validatedFields = profileSchema.safeParse({
    name: formData.get("name"),
    content: formData.get("content"),
    image: formData.get("image"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.flattenError(validatedFields.error).fieldErrors,
      message: "入力内容を確認してください",
    };
  }

  const { name, content, image } = validatedFields.data;

  try {
    let imageId: number | undefined;

    if (image) {
      imageId = await createMediaFromImage(image, "profile");
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

export async function editProfile(
  id: string,
  _prevState: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  await verifySession();

  const validatedFields = profileSchema.safeParse({
    name: formData.get("name"),
    content: formData.get("content"),
    image: formData.get("image"),
  });

  if (!validatedFields.success) {
    return {
      success: false,
      errors: z.flattenError(validatedFields.error).fieldErrors,
      message: "入力内容を確認してください",
    };
  }

  const { name, content, image } = validatedFields.data;

  try {
    let imageId: number | undefined;

    if (image) {
      imageId = await createMediaFromImage(image, "profile");
    }

    await prisma.profile.update({
      where: { id },
      data: {
        name,
        content,
        ...(imageId !== undefined ? { imageId } : {}),
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
