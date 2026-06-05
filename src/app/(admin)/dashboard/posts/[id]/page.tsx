import { getAllCategories } from "@/src/lib/category";
import { getAllTags } from "@/src/lib/tags";
import { getSinglePost } from "@/src/lib/posts";
import PostForm from "@/src/components/PostForm";

export default async function PostEditPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;
  const post = await getSinglePost(Number(id));
  const allCategories = await getAllCategories();
  const allTags = await getAllTags();
  const panelClassName = "rounded-lg border border-divider bg-white px-4 py-6";

  if (!post) {
    return (
      <p>投稿が見つかりませんでした。</p>
    )
  }

  return (
    <div className="p-6 grow">
      <div className="mt-6">管理画面 › 記事編集</div>
      <h1 className="mt-2 font-bold text-3xl">記事編集</h1>
      <div className="flex justify-between gap-10 items-start">

        <PostForm
          id={post.id}
          mode="edit"
          postTitle={post.title}
          postContent={post.content}
          allCategories={allCategories}
          allTags={allTags}
        />

        <div className="grow">
          <div className={`${panelClassName} space-y-4`}>
            <h2 className="font-bold text-xl">公開設定</h2>
            <div className="flex gap-3">
              <p>状態</p>
              <p>valuevalue</p>
            </div>
            <div className="flex gap-3">
              <p>公開日</p>
              <p>valuevalue</p>
            </div>
            <div className="flex gap-3">
              <p>更新日</p>
              <p>valuevalue</p>
            </div>
          </div>

          <div className={`${panelClassName} mt-5 space-x-3`}>
            <h2 className="font-bold text-xl">カテゴリ</h2>
            
          </div>

          <div className={`${panelClassName} mt-5 space-x-3`}>
            <h2 className="font-bold text-xl">アイキャッチ画像</h2>
            
          </div>
        </div>
      </div>
    </div>
  )
}
