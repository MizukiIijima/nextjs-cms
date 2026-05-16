"use client";

import { useState } from "react";
import CategoryForm from "./CategoryForm";
import CategoryTable from "./CategoryTable";
import type { getAllCategories } from "@/src/lib/category";
import type { CategoryFormState } from "./actions";

type CategoryList = Awaited<ReturnType<typeof getAllCategories>>;
type CategoryItem = CategoryList[number];
type CategoryAction = (
  prevState: CategoryFormState,
  formData: FormData,
) => Promise<CategoryFormState>;
type Props = {
  allCategories: CategoryList;
  initialState: CategoryFormState;
  createAction: CategoryAction;
  updateAction: CategoryAction;
};


export default function CategoryManager({
  allCategories,
  initialState,
  createAction,
  updateAction,
}: Props) {
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  return (
    <>
      <div>
        <h2 className="font-bold text-xl">
          {editingCategory ? "カテゴリを編集" : "カテゴリを追加"}
        </h2>
        <p className="text-sm text-gray">記事の大分類を作成します。公開中のカテゴリページにも表示されます。</p>

        <CategoryForm
          key={editingCategory?.id ?? "new"}
          action={editingCategory ? updateAction : createAction}
          initialState={initialState}
          editingCategory={editingCategory}
          onCancelEdit={() => setEditingCategory(null)}
        />
      </div>

      <div className="grow">
        <h2 className="font-bold text-xl">登録済みカテゴリ</h2>
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <CategoryTable
            allCategories={allCategories}
            onEdit={setEditingCategory}
          />
        </div>
      </div>
    </>
  );
}
