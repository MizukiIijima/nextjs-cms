import { getAllCategories } from "@/src/lib/category";
import { getAllTags } from "@/src/lib/tags";
import { verifySession } from "@/src/lib/auth/dal";
import PostForm from "@/src/components/PostForm";

export default async function CreatePost() {
  await verifySession();

  const allCategories = await getAllCategories();
  const allTags = await getAllTags();

  return (
    <>
      <div className="p-6 grow">
        <div className="mt-6">管理画面 › 記事作成</div>
        <h1 className="mt-2 font-bold text-3xl">記事作成</h1>
          
        <PostForm 
          mode="create"
          postTitle=""
          postSlug=""
          postContent=""
          allCategories={allCategories}
          allTags={allTags}
        />
      </div>
    </>
  )
}
