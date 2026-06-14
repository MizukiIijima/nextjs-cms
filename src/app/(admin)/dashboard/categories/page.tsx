import { createCategory, type CategoryFormState } from "./actions";
import { getAllCategories } from "@/src/lib/category";
import CategoryForm from "./_components/CategoryForm";
import CategoryTable from "./_components/CategoryTable";

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
        <div>
          <h2 className="font-bold text-base">カテゴリを追加</h2>
          <p className="text-sm text-gray">記事の大分類を作成します。公開側のカテゴリページにも表示されます。</p>

          <CategoryForm 
            action={createCategory}
            initialState={initialState}/>
        </div>

        <div className="grow">
          <h2 className="font-bold text-base">登録済みカテゴリ</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          <CategoryTable
            allCategories={allCategories}
          />
          </div>
        </div>
      </div>
    </div>
  )
}
