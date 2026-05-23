"use client";

import { useActionState, useState } from "react";
import { updateCategory, type CategoryFormState } from "../actions";
import type { Category } from "@/src/generated/prisma/client";
import Button from "@/src/components/Button";

type EditCategoryFormProps = {
  category: Category;
  onCancel: () => void;
};

const initialState: CategoryFormState = {
  success: false,
  message: "",
};

export default function EditCategoryForm({ category, onCancel }: EditCategoryFormProps) {
  const [formValue, setFormValue] = useState({
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
  });
  const [state, formAction] = useActionState(updateCategory, initialState);

  return (
    <td colSpan={5} className="bg-slate-50 px-4 py-5">
      <form action={formAction} className="mx-auto max-w-4xl space-y-5 rounded-lg border border-slate-200 bg-white p-5">
        <input type="hidden" name="id" value={category.id} />

        <div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="edit-name" className="text-sm font-medium text-slate-800">
                カテゴリ名
              </label>
              <input
                type="text"
                name="name"
                id="edit-name"
                required
                value={formValue.name}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                onChange={(e) => setFormValue({
                  ...formValue,
                  name: e.target.value,
                })}
              />
              {state.errors?.name && (
                <p className="text-xs text-red-600">{state.errors.name[0]}</p>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="edit-slug" className="text-sm font-medium text-slate-800">
                slug
              </label>
              <input
                type="text"
                name="slug"
                id="edit-slug"
                required
                value={formValue.slug}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                onChange={(e) => setFormValue({
                  ...formValue,
                  slug: e.target.value,
                })}
              />
              {state.errors?.slug && (
                <p className="text-xs text-red-600">{state.errors.slug[0]}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="edit-description" className="text-sm font-medium text-slate-800">
              説明文
            </label>
            <textarea
              name="description"
              id="edit-description"
              value={formValue.description}
              rows={5}
              className="min-h-28 resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              onChange={(e) => setFormValue({
                ...formValue,
                description: e.target.value,
              })}
            />
            {state.errors?.description && (
              <p className="text-xs text-red-600">{state.errors.description[0]}</p>
            )}
          </div>
        </div>

        {state.message && (
          <p className={state.success ? "text-sm text-blue-700" : "text-sm text-red-600"} aria-live="polite">
            {state.message}
          </p>
        )}

        <div className="flex flex-wrap gap-3 pt-1">
          <Button
            variant="primary"
            type="submit"
            className="m-0! w-auto! px-5 py-2.5 text-sm font-bold"
          >
            更新
          </Button>
          <Button
            variant="default"
            className="m-0! w-auto! border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold"
            onClick={onCancel}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </td>
  );
}
