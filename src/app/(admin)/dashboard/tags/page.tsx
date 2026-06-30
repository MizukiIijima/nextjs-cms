import { createTag, type TagFormState } from "./actions";
import { getAllTags } from "@/src/lib/tags";
import { verifySession } from "@/src/lib/auth/dal";
import TagForm from "./_components/TagForm";
import TagTable from "./_components/TagTable";

const initialState: TagFormState = {
  success: false,
  message: "",
};

export default async function TagPage() {
  await verifySession();

  const allTags = await getAllTags();

  return (
    <div className="p-6 grow">
      <div className="mt-6">管理画面 › タグ一覧</div>
      <h1 className="mt-2 font-bold text-3xl">タグ一覧</h1>
      <div className="mt-8 flex justify-between gap-10 items-start">
        <div className="w-80 shrink-0">
          <h2 className="font-bold text-base">タグを追加</h2>
          <p className="text-sm text-gray">記事の大分類を作成します。公開側のタグページにも表示されます。</p>

          <TagForm
            action={createTag}
            initialState={initialState}
          />
        </div>

        <div className="grow">
          <h2 className="font-bold text-base">登録済みタグ</h2>
          
          <TagTable
            allTags={allTags}
          />
        </div>
      </div>
    </div>
  )
}
