"use server";

import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "@/src/lib/prisma";
import { verifyPassword } from "@/src/lib/auth/password";
import { createSession } from "@/src/lib/auth/session";

const LoginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "メールアドレスを入力してください")
    .email("正しいメールアドレスを入力してください")
    .transform((email) => email.toLowerCase()),
  password: z
    .string()
    .min(1, "パスワードを入力してください")
    .max(256, "パスワードが長すぎます"),
});

export type LoginState =
  | {
      errors?: {
        email?: string[];
        password?: string[];
      };
      message?: string;
    }
  | undefined;

export async function login(
  _previousState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: z.flattenError(validatedFields.error).fieldErrors,
    };
  }

  const { email, password } = validatedFields.data;

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
      passwordHash: true,
    },
  });

  if (!user) {
    return {
      message: "メールアドレスまたはパスワードが違います",
    };
  }

  const passwordIsValid = await verifyPassword(password, user.passwordHash);

  if (!passwordIsValid) {
    return {
      message: "メールアドレスまたはパスワードが違います",
    };
  }

  await createSession(user.id);

  redirect("/dashboard");
}
