"use client";

import { useActionState } from "react";

import Button from "@/src/components/Button";
import { login } from "./actions";

export default function LoginPage() {
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