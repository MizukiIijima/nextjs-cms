"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

import Button from "@/src/components/Button";
import { authClient } from "@/src/lib/auth-client";

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

type LoginState = {
  errors?: { email?: string[]; password?: string[] };
  message?: string;
} | undefined;

export default function LoginPage() {
  const router = useRouter();

  async function login(
    _previousState: LoginState,
    formData: FormData,
  ): Promise<LoginState> {
    const validatedFields = LoginSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!validatedFields.success) {
      return { errors: z.flattenError(validatedFields.error).fieldErrors };
    }

    try {
      // HTTP 経由で呼び出し、Better Auth のレート制限を適用する。
      const { error } = await authClient.signIn.email(validatedFields.data);

      if (error) {
        if (error.status === 429) {
          return { message: "ログイン試行回数が上限に達しました。15分ほど待ってから再試行してください" };
        }

        if (error.code === "INVALID_EMAIL_OR_PASSWORD") {
          return { message: "メールアドレスまたはパスワードが違います" };
        }

        return { message: "ログインに失敗しました。時間をおいて再試行してください" };
      }
    } catch {
      return { message: "通信に失敗しました。接続を確認して再試行してください" };
    }

    router.replace("/dashboard");
    router.refresh();
  }

  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <main className="flex min-h-screen items-center justify-center bg-background-main px-4">
      <section className="w-full max-w-md rounded-xl bg-white p-8 shadow-sm">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold">
            管理画面ログイン
          </h1>
          <p className="mt-2 text-sm text-gray">
            メールアドレスとパスワードを入力してください
          </p>
        </header>

        <form
          action={formAction}
          className="space-y-5"
          noValidate
        >
          <div>
            <label
              className="mb-2 block text-sm font-bold"
              htmlFor="email"
            >
              メールアドレス
            </label>

            <input
              aria-describedby="email-error"
              aria-invalid={
                Boolean(state?.errors?.email)
              }
              autoComplete="email"
              className="w-full rounded-md border border-divider px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              id="email"
              name="email"
              type="email"
            />

            {state?.errors?.email && (
              <p
                className="mt-2 text-sm text-error-text"
                id="email-error"
              >
                {state.errors.email.join("、")}
              </p>
            )}
          </div>

          <div>
            <label
              className="mb-2 block text-sm font-bold"
              htmlFor="password"
            >
              パスワード
            </label>

            <input
              aria-describedby="password-error"
              aria-invalid={
                Boolean(state?.errors?.password)
              }
              autoComplete="current-password"
              className="w-full rounded-md border border-divider px-3 py-2 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
              id="password"
              name="password"
              type="password"
            />

            {state?.errors?.password && (
              <p
                className="mt-2 text-sm text-error-text"
                id="password-error"
              >
                {state.errors.password.join("、")}
              </p>
            )}
          </div>

          {state?.message && (
            <p
              aria-live="polite"
              className="rounded-md bg-error-bg p-3 text-sm text-error-text"
              role="alert"
            >
              {state.message}
            </p>
          )}

          <Button
            className="w-full disabled:cursor-not-allowed disabled:opacity-60"
            disabled={pending}
            type="submit"
            variant="primary"
          >
            {pending
              ? "ログイン中..."
              : "ログイン"}
          </Button>
        </form>
      </section>
    </main>
  );
}
