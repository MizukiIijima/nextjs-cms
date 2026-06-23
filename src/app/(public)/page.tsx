import { getPublishedPosts } from "@/src/lib/posts";
import { getPublishedPostTags } from "@/src/lib/tags";
import { toPlainText } from "@/src/lib/utils";
import { PublicSidebar } from "@/src/components/PublicSidebar";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "新着記事",
  description:
    "Next.js CMSで公開された最新記事、カテゴリ、タグ、プロフィールをまとめて確認できます。",
  openGraph: {
    title: "新着記事",
    description:
      "Next.js CMSで公開された最新記事、カテゴリ、タグ、プロフィールをまとめて確認できます。",
    type: "website",
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "新着記事",
    description:
      "Next.js CMSで公開された最新記事、カテゴリ、タグ、プロフィールをまとめて確認できます。",
  },
};

const pillStyles = [
  "bg-blue-50 text-blue-700",
  "bg-indigo-50 text-indigo-700",
  "bg-violet-50 text-violet-700",
  "bg-emerald-50 text-emerald-700",
  "bg-orange-50 text-orange-700",
] as const;

function getPostSummary(post: { excerpt: string | null; content: string }) {
  const summary = post.excerpt || toPlainText(post.content);

  if (summary.length <= 82) {
    return summary;
  }

  return `${summary.slice(0, 82)}...`;
}

export default async function Home() {
  const [publishedPosts, tags] = await Promise.all([
    getPublishedPosts(),
    getPublishedPostTags(),
  ]);

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-950">
      <div className="mx-auto grid w-full max-w-268 gap-7 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,744px)_300px] lg:px-0">
        <main id="latest-posts">
          <header className="mb-5 flex items-end justify-between gap-4">
            <div>
              <h1 className="text-[28px] font-bold leading-tight tracking-[-0.02em] text-slate-950">
                新着記事
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                最近書いた実装メモ
              </p>
            </div>
            <Link
              href="#latest-posts"
              className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              すべて見る
            </Link>
          </header>

          {publishedPosts.length > 0 ? (
            <div className="space-y-3.5">
              {publishedPosts.map((post, index) => {
                const displayDate = post.publishedAt ?? post.createdAt;
                const labels =
                  post.categories.length > 0 ? post.categories : post.tags;

                return (
                  <article
                    key={post.id}
                    className="rounded-[18px] border border-slate-200 bg-white px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-blue-200 sm:px-6 sm:py-5"
                  >
                    <div className="flex flex-wrap items-center gap-2.5">
                      {labels.slice(0, 2).map((label, labelIndex) => (
                        <span
                          key={`${label.id}-${label.name}`}
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            pillStyles[(index + labelIndex) % pillStyles.length]
                          }`}
                        >
                          {label.name}
                        </span>
                      ))}
                      <time
                        dateTime={displayDate.toISOString()}
                        className="text-xs font-bold text-slate-400"
                      >
                        {displayDate.toLocaleDateString("ja-JP")}
                      </time>
                    </div>
                    <h2 className="mt-4 text-[18px] font-bold leading-snug tracking-[-0.01em] text-slate-950">
                      {post.title}
                    </h2>
                    <p className="mt-3 line-clamp-2 text-[13px] leading-6 text-slate-600">
                      {getPostSummary(post)}
                    </p>
                  </article>
                );
              })}
            </div>
          ) : (
            <p className="rounded-[18px] border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm font-medium text-slate-500">
              公開中の記事がありません。
            </p>
          )}
        </main>

        <PublicSidebar tags={tags} />
      </div>
    </div>
  );
}
