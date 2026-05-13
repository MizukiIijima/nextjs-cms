"use client";

import { useActionState } from "react";
import Button from "@/src/components/Button";
import { CategoryFormState } from "./actions";

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
      {state && <p className="absolute left-1/2">{state.message}</p>}

      <form action={formAction} className="mt-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="name">カテゴリ名</label>
          <input type="text" name="name" id="name"
            className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" required
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="slug">スラッグ</label>
          <input type="text" name="slug" id="slug"
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="description">説明</label>
          <input type="text" name="description" id="description"
          className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
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