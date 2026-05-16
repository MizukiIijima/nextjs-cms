import { createCategory, type CategoryFormState } from "./actions";
import { getAllCategories } from "@/src/lib/category";
import CategoryForm from "./CategoryForm";
import Button from "@/src/components/Button";

const initialState: CategoryFormState = {
  success: false,
  message: "",
}

export default async function CategoryPage() {

  const allCategories = await getAllCategories();
  const thStyle = "py-3 px-4 text-left font-bold text-slate-600";
  const tdStyle = "py-3 px-4 text-sm text-slate-700 break-words";
  
  return (
    <div className="p-6 grow">
      <div className="mt-6">管理画面 › カテゴリ一覧</div>
      <h1 className="mt-2 font-bold text-3xl">カテゴリ一覧</h1>
      <div className="mt-8 flex justify-between gap-10 items-start">
        <div>
          <h2 className="font-bold text-xl">カテゴリを追加</h2>
          <p className="text-sm text-gray">記事の大分類を作成します。公開側のカテゴリページにも表示されます。</p>

          <CategoryForm 
            action={createCategory}
            initialState={initialState}/>
        </div>

        <div className="grow">
          <h2 className="font-bold text-xl">登録済みカテゴリ</h2>
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
            <table className="w-full table-fixed">
              <colgroup>
                <col className="w-[15%]" />
                <col className="w-[15%]" />
                <col className="w-[42%]" />
                <col className="w-[10%]" />
                <col className="w-[18%]" />
              </colgroup>
              <thead className="bg-slate-50">
                <tr>
                <th className={thStyle}>カテゴリ名</th>
                <th className={thStyle}>slug</th>
                <th className={thStyle}>説明</th>
                <th className={thStyle}>記事数</th>
                <th className={thStyle}>操作</th>
                </tr>
              </thead>
              <tbody>
                {allCategories.map((category) => (
                  <tr key={category.id} className="border-t border-slate-200 odd:bg-white even:bg-slate-50">
                    <td className={tdStyle}>{category.name}</td>
                    <td className={tdStyle}>{category.slug}</td>
                    <td className={tdStyle}>{category.description || "-"}</td>
                    <td className={tdStyle}>{category._count.posts}</td>
                    <td className={`flex gap-2 ${tdStyle}`}>
                      <Button variant="default" className="py-1.5 w-8">編集</Button>
                      <Button variant="danger" className="py-1.5 w-8">削除</Button>
                    </td>
                  </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
