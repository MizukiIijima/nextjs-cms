"use client";

import { useActionState } from "react";
import Button from "@/src/components/Button";
import { CategoryFormState } from "../actions";

type CategoryAction = (
  prevState: CategoryFormState,
  formDate: FormData,
) => Promise<CategoryFormState>;

type CategoryFormProps = {
  action: CategoryAction;
  initialState: CategoryFormState;
};

export default function CategoryForm({ action, initialState }: CategoryFormProps) {
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

      <form action={formAction} className="mt-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">カテゴリ名</label>
          <input type="text" name="name" id="name"
            className="rounded-md border border-divider bg-white px-3 py-2 text-sm" required
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="slug">slug</label>
          <input type="text" name="slug" id="slug"
          className="rounded-md border border-divider bg-white px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="description">説明</label>
          <input type="text" name="description" id="description"
          className="rounded-md border border-divider bg-white px-3 py-2 text-sm"
          />
        </div>
        <Button 
          variant="primary"
          type="submit"
          className="py-2.5 mt-8"
        >
          作成
        </Button>
      </form> 
    </>
  )
}
