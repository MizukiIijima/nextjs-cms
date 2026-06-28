import { getAllCategories } from "@/src/lib/category";
import { getAllTags } from "@/src/lib/tags";
import { getSinglePost } from "@/src/lib/posts";
import PostForm from "@/src/components/PostForm";

export default async function PostEditPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;
  const post = await getSinglePost(Number(id));
  const allCategories = await getAllCategories();
  const allTags = await getAllTags();

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
          postSlug={post.slug}
          postContent={post.content}
          allCategories={allCategories}
          allTags={allTags}
          thumbnail={post.thumbnail?.url ?? null}
          selectedCategoryIds={post.categories.map((category) => category.id)}
          selectedTagIds={post.tags.map((tag) => tag.id)}
        />

      </div>
    </div>
  )
}
