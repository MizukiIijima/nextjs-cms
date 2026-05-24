"use client";

import { useActionState } from "react";
import type { TagFormState } from "../actions";
import Button from "@/src/components/Button";

type CreateTagAction = (
  prevState: TagFormState,
  formData: FormData,
) => Promise<TagFormState>;

type TagFormProps = {
  action: CreateTagAction;
  initialState: TagFormState;
};

export default function TagForm({ action, initialState }: TagFormProps) {
  const [state, formAction] = useActionState(action, initialState);

  return (
    <>
      {state.message && (
        <p
          className={`fixed top-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg border px-4 py-3 text-center text-sm font-bold shadow-lg ${
            state.success
              ? "border-blue-200 bg-blue-50 text-blue-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          aria-live="polite"
        >
          {state.message}
        </p>
      )}

      <form action={formAction} className="mt-4 w-full">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">タグ名</label>
          <input type="text" name="name" id="name"
            className="w-full rounded-md border border-divider bg-white px-3 py-2 text-sm" required
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="slug">スラッグ</label>
          <input type="text" name="slug" id="slug"
          className="w-full rounded-md border border-divider bg-white px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="description">説明</label>
          <input type="text" name="description" id="description"
          className="w-full rounded-md border border-divider bg-white px-3 py-2 text-sm"
          />
        </div>
        <Button 
          variant="primary"
          type="submit"
          className="mt-8 w-full py-2.5"
        >
          作成
        </Button>
      </form>
    </>
  )
}
