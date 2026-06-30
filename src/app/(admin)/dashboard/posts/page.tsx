import { getAllPosts } from "@/src/lib/posts";
import { verifySession } from "@/src/lib/auth/dal";
import Pagination from "@/src/components/Pagination";
import Link from "next/link";

export default async function PostList({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  await verifySession();

  const allPosts = await getAllPosts();
  const { page: pageParam = "1" } = (await searchParams) ?? {};
  const currentPage = Math.max(1, Number(pageParam) || 1);

  const totalPostCount = allPosts.length;
  const POSTS_PER_PAGE = 10;
  const startPost = (currentPage - 1) * POSTS_PER_PAGE;
  const endPost = startPost + POSTS_PER_PAGE;
  const currentPosts = allPosts.slice(startPost, endPost);

  const thClass =
    "px-4 py-3 text-left text-xs font-bold uppercase text-slate-500";
  const tdClass = "px-4 py-4 text-left text-sm text-slate-700";

  const statusLabel = {
    DRAFT: "下書き",
    PUBLISHED: "公開中",
    UNPUBLISHED: "非公開",
    ARCHIVED: "アーカイブ",
  } as const;

  const statusClass = {
    DRAFT: "bg-slate-100 text-slate-700",
    PUBLISHED: "bg-blue-50 text-blue-700",
    UNPUBLISHED: "bg-amber-50 text-amber-700",
    ARCHIVED: "bg-zinc-100 text-zinc-600",
  } as const;

  return (
    <div className="grow p-6">
      <div className="mt-6 text-sm text-gray">ダッシュボード / 記事一覧</div>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">記事一覧</h1>
          <p className="mt-2 text-sm text-gray">
            全{totalPostCount}件中 {totalPostCount === 0 ? 0 : startPost + 1}-
            {Math.min(endPost, totalPostCount)}件を表示
          </p>
        </div>

        <Link
          href="/dashboard/posts/create"
          className="rounded-md bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primary-dark"
        >
          新規作成
        </Link>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <ul className="flex rounded-lg border border-divider bg-white p-1 text-sm font-bold text-slate-600 shadow-sm">
          <li className="rounded-md bg-sidebar px-3 py-2 text-white">すべて</li>
          <li className="px-3 py-2">公開中</li>
          <li className="px-3 py-2">下書き</li>
          <li className="px-3 py-2">非公開</li>
        </ul>

        <input
          type="text"
          name="keyword"
          className="w-80 rounded-md border border-divider bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
          placeholder="タイトルを検索"
        />
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-divider bg-white shadow-sm">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-[34%]" />
            <col className="w-[12%]" />
            <col className="w-[18%]" />
            <col className="w-[18%]" />
            <col className="w-[9%]" />
            <col className="w-[9%]" />
          </colgroup>
          <thead className="bg-slate-50">
            <tr>
              <th className={thClass}>記事</th>
              <th className={thClass}>ステータス</th>
              <th className={thClass}>カテゴリー</th>
              <th className={thClass}>タグ</th>
              <th className={thClass}>作成日</th>
              <th className={thClass}>更新日</th>
            </tr>
          </thead>
          <tbody>
            {totalPostCount > 0 ? (
              currentPosts.map((post) => (
                <tr
                  key={post.id}
                  className="border-t border-slate-100 transition-colors hover:bg-slate-50"
                >
                  <td className={tdClass}>
                    <Link
                      href={`/dashboard/posts/${post.id}`}
                      className="block truncate font-bold text-slate-900 hover:text-primary"
                    >
                      {post.title}
                    </Link>
                  </td>
                  <td className={tdClass}>
                    <Link href={`/dashboard/posts/${post.id}`} className="block">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusClass[post.status]}`}
                      >
                        {statusLabel[post.status]}
                      </span>
                    </Link>
                  </td>
                  <td className={tdClass}>
                    <Link
                      href={`/dashboard/posts/${post.id}`}
                      className="block truncate"
                    >
                      {post.categories.length > 0
                        ? post.categories
                            .map((category) => category.name)
                            .join(", ")
                        : "-"}
                    </Link>
                  </td>
                  <td className={tdClass}>
                    <Link
                      href={`/dashboard/posts/${post.id}`}
                      className="block truncate"
                    >
                      {post.tags.length > 0
                        ? post.tags.map((tag) => `#${tag.name}`).join(" ")
                        : "-"}
                    </Link>
                  </td>
                  <td className={tdClass}>
                    <Link
                      href={`/dashboard/posts/${post.id}`}
                      className="block whitespace-nowrap text-slate-600"
                    >
                      {post.createdAt.toLocaleDateString()}
                    </Link>
                  </td>
                  <td className={tdClass}>
                    <Link
                      href={`/dashboard/posts/${post.id}`}
                      className="block whitespace-nowrap text-slate-600"
                    >
                      {post.updatedAt.toLocaleDateString()}
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="px-4 py-12 text-center text-sm text-gray" colSpan={6}>
                  投稿がありません。
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalPostCount={totalPostCount}
        basePath="/dashboard/posts"
      />
    </div>
  );
}
