import { getPublishedPosts } from "@/src/lib/posts";
import { getProfile } from "@/src/lib/profile";
import { getPublishedPostCategories } from "@/src/lib/category";
import { getPublishedPostTags } from "@/src/lib/tags";
import type { Metadata } from "next";
import Image from "next/image";
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

function toPlainText(value: string) {
  return value
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)]\([^)]*\)/g, "$1")
    .replace(/[#>*_~`-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function getPostSummary(post: { excerpt: string | null; content: string }) {
  const summary = post.excerpt || toPlainText(post.content);

  if (summary.length <= 82) {
    return summary;
  }

  return `${summary.slice(0, 82)}...`;
}

export default async function Home() {
  const [publishedPosts, categories, tags, profile] = await Promise.all([
    getPublishedPosts(),
    getPublishedPostCategories(),
    getPublishedPostTags(),
    getProfile(),
  ]);

  if (!profile) {
    throw new Error("プロフィールが登録されていません。");
  }

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

        <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
          <section
            aria-labelledby="profile-heading"
            className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
          >
            <div className="flex items-center gap-3.5">
              <span className="flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-[15px] bg-gradient-to-br from-slate-900 via-blue-600 to-violet-500 text-lg font-bold text-white">
                {profile.image?.url && (
                  <Image
                    src={profile.image.url}
                    width={112}
                    height={112}
                    alt={
                      profile.image.altText ||
                      `${profile.name}のプロフィール画像`
                    }
                    className="size-full object-cover"
                    unoptimized
                  />
                )}
              </span>
              <div className="min-w-0">
                <h2
                  id="profile-heading"
                  className="truncate text-[18px] font-bold text-slate-950"
                >
                  {profile.name}
                </h2>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  Frontend Developer / Next.js Learner
                </p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-7 text-slate-600">
              {toPlainText(profile.content)}
            </p>
            <Link
              href="#profile-heading"
              className="mt-5 inline-flex text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              プロフィールを見る
            </Link>
          </section>

          <section
            aria-labelledby="category-heading"
            className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
          >
            <div className="flex items-center justify-between gap-4">
              <h2
                id="category-heading"
                className="text-[18px] font-bold leading-tight text-slate-950"
              >
                カテゴリ
              </h2>
              <span className="text-xs font-medium text-blue-600">一覧</span>
            </div>
            {categories.length > 0 ? (
              <ul className="mt-5 divide-y divide-slate-200">
                {categories.slice(0, 5).map((category) => (
                  <li
                    key={category.id}
                    className="flex items-center justify-between gap-4 py-3.5"
                  >
                    <span className="truncate text-sm font-medium text-slate-800">
                      {category.name}
                    </span>
                    <span className="text-sm font-bold text-slate-500">
                      {category.publishedPostCount}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                カテゴリが登録されていません。
              </p>
            )}
          </section>

          <section
            aria-labelledby="tag-heading"
            className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
          >
            <div className="flex items-center justify-between gap-4">
              <h2
                id="tag-heading"
                className="text-[18px] font-bold leading-tight text-slate-950"
              >
                タグ
              </h2>
              <span className="text-xs font-medium text-blue-600">一覧</span>
            </div>
            {tags.length > 0 ? (
              <ul className="mt-5 flex flex-wrap gap-2">
                {tags.slice(0, 10).map((tag) => (
                  <li key={tag.id}>
                    <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600">
                      #{tag.name}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-500">
                タグが登録されていません。
              </p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}
