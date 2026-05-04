import { getPosts } from "@/src/lib/posts";
import Pagination from "@/src/components/Pagination";

export default async function PostList({ searchParams } : { searchParams: Promise<{ page?: string; }> }) {
  const allPosts = await getPosts();
  const { page: pageParam = "1" } = (await searchParams) ?? {};
  const currentPage = Number(pageParam);

  const totalPostCount = allPosts.length;
  const POSTS_PER_PAGE = 1;
  const startPost = (currentPage - 1) * POSTS_PER_PAGE;
  const endPost = startPost + POSTS_PER_PAGE;
  const currentPosts = allPosts.slice(startPost, endPost);

  return (
    <div className="p-6 grow">
      <div className="mt-6">ダッシュボード › 記事一覧</div>
      <h1 className="mt-2 font-bold text-3xl">記事一覧</h1>

      <div className="mt-8 flex justify-between items-center">
        <ul className="p-3 flex gap-3.5 rounded-3xl border border-slate-300">
          <li>すべて</li>
          <li>公開中</li>
          <li>下書き</li>
          <li>非公開</li>
        </ul>

        <div>
          <input
            type="text" 
            name="keyword"
            className="w-80 border border-slate-300 rounded-md px-3 py-2 text-sm" 
            placeholder="タイトル・本文を検索" 
          />
        </div>
      </div>


      <div className="mt-6 overflow-hidden rounded-3xl">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-4 px-6 font-light text-left">記事</th>
              <th className="py-4 px-6 font-light text-left">ステータス</th>
              <th className="py-4 px-6 font-light text-left">カテゴリー</th>
              <th className="py-4 px-6 font-light text-left">タグ</th>
              <th className="py-4 px-6 font-light text-left">公開日</th>
              <th className="py-4 px-6 font-light text-left">更新日</th>
            </tr>
          </thead>
          <tbody>
            {totalPostCount > 0 ? (
              currentPosts.map(post => (
                <tr key={post.id} className="border-b border-gray-200">
                  <td className="p-6 text-left text-sm">{post.title}</td>
                  <td className="p-6 text-left text-sm">{post.status}</td>
                  {post.categories.map((category) => (
                    <td key={category.id} className="p-6 text-left text-sm">{category.name}</td>
                  ))}
                  {post.tags.map((tag) => (
                    <td key={tag.id} className="p-6 text-left text-sm">{tag.name}</td>
                  ))}
                  <td className="p-6 text-left text-sm">{post.status}</td>
                  <td className="p-6 text-left text-sm">{post.createdAt.toLocaleDateString()}</td>
                  <td className="p-6 text-left text-sm">{post.updatedAt.toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <p>投稿がありません。</p>
            )}
          </tbody>
        </table>
      </div>

      <Pagination currentPage={currentPage} totalPostCount ={totalPostCount} />
      
    </div>
  );
}
