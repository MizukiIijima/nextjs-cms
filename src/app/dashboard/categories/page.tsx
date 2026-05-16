import { createCategory, updateCategory, type CategoryFormState } from "./actions";
import { getAllCategories } from "@/src/lib/category";
import CategoryManager from "./CategoryManager";

const initialState: CategoryFormState = {
  success: false,
  message: "",
}

export default async function CategoryPage() {
  const allCategories = await getAllCategories();
  
  return (
    <div className="p-6 grow">
      <div className="mt-6">管理画面 › カテゴリ一覧</div>
      <h1 className="mt-2 font-bold text-3xl">カテゴリ一覧</h1>
      <div className="mt-8 flex justify-between gap-10 items-start">
        <CategoryManager
          allCategories={allCategories}
          initialState={initialState}
          createAction={createCategory}
          updateAction={updateCategory}
        />
      </div>
    </div>
  )
}
