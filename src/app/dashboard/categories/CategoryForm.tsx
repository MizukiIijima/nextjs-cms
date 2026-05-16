"use client";

import { useActionState } from "react";
import Button from "@/src/components/Button";
import type { CategoryFormState } from "./actions";
import type { getAllCategories } from "@/src/lib/category";

type CategoryList = Awaited<ReturnType<typeof getAllCategories>>;
type CategoryItem = CategoryList[number];
type CategoryAction = (
  prevState: CategoryFormState,
  formDate: FormData,
) => Promise<CategoryFormState>;
type CategoryFormProps = {
  action: CategoryAction;
  initialState: CategoryFormState;
  editingCategory: CategoryItem | null;
  onCancelEdit: () => void;
};

export default function CategoryForm({
  action,
  initialState,
  editingCategory,
  onCancelEdit,
}: CategoryFormProps) {
  const [state, formAction] = useActionState(action, initialState);
  const isEditing = editingCategory !== null;
  
  return (
    <>
      {state.message && (
        <p className={`absolute left-1/2 top-12.5 -translate-x-1/2 rounded-md border px-4 py-2 text-sm shadow-sm ${
          state.success
            ? "border-success bg-success-bg text-success-text"
            : "border-error bg-error-bg text-error-text"
        }`}>{state.message}</p>
      )}

      <form action={formAction} className="mt-4">
        {isEditing && (
          <input type="hidden" name="id" value={editingCategory.id} />
        )}

        <div className="flex flex-col gap-2">
          <label htmlFor="name">カテゴリ名</label>
          <input type="text" name="name" id="name"
            className="rounded-md border border-divider bg-white px-3 py-2 text-sm" required
            defaultValue={editingCategory?.name ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="slug">スラッグ</label>
          <input type="text" name="slug" id="slug"
          className="rounded-md border border-divider bg-white px-3 py-2 text-sm"
          defaultValue={editingCategory?.slug ?? ""}
          />
        </div>
        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="description">説明</label>
          <input type="text" name="description" id="description"
          className="rounded-md border border-divider bg-white px-3 py-2 text-sm"
          defaultValue={editingCategory?.description ?? ""}
          />
        </div>
        <Button 
          variant="primary"
          type="submit"
          className="py-2.5 mt-8"
        >
          {isEditing ? "更新" : "作成"}
        </Button>
        {isEditing && (
          <Button
            variant="default"
            className="py-2.5 mt-3"
            onClick={onCancelEdit}
          >
            キャンセル
          </Button>
        )}
      </form> 
    </>
  )
}
