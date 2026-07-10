import {
  getPublishedPostCount,
  getPublishedPosts,
} from "@/src/lib/posts";
import { getPublishedPostTags } from "@/src/lib/tags";
import { toPlainText } from "@/src/lib/utils";
import Pagination from "@/src/components/Pagination";
import { PublicSidebar } from "@/src/components/PublicSidebar";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

type PageProps = {
  searchParams: Promise<{ page?: string | string[] }>;
};

const pageDescription = "新着記事、カテゴリ、タグ、プロフィールをまとめて確認できます。";

function getCurrentPage(pageParam?: string | string[]) {
  const pageValue = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const parsedPage = Number(pageValue ?? "1");

  return Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { page } = await searchParams;
  const currentPage = getCurrentPage(page);
  const canonical = currentPage > 1 ? `/?page=${currentPage}` : "/";

  return {
    title: "新着記事",
    description: pageDescription,
    alternates: {
      canonical,
    },
    openGraph: {
      title: "新着記事",
      description: pageDescription,
      url: "/",
      siteName: "zimamemo",
      type: "website",
      locale: "ja_JP",
    },
  };
}

const pillStyles = [
  "bg-blue-50 text-blue-700",
  "bg-indigo-50 text-indigo-700",
  "bg-violet-50 text-violet-700",
  "bg-emerald-50 text-emerald-700",
  "bg-orange-50 text-orange-700",
] as const;

const POSTS_PER_PAGE = 10;

function getPostSummary(post: { excerpt: string | null; content: string }) {
  const summary = post.excerpt || toPlainText(post.content);

  if (summary.length <= 82) {
    return summary;
  }

  return `${summary.slice(0, 82)}...`;
}

export default async function Home({ searchParams }: PageProps) {
  const { page: pageParam } = await searchParams;
  const currentPage = getCurrentPage(pageParam);

  const [publishedPosts, totalPostCount, tags] = await Promise.all([
    getPublishedPosts(currentPage, POSTS_PER_PAGE),
    getPublishedPostCount(),
    getPublishedPostTags(),
  ]);
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto grid w-full max-w-268 gap-7 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,744px)_300px] lg:px-0">
        <main id="latest-posts" className="min-w-0">
          <header className="mb-7 flex items-end justify-between gap-4">
            <h1 className="text-[34px] font-bold leading-tight tracking-[-0.02em] text-slate-950">
              新着記事
            </h1>
          </header>

          {publishedPosts.length > 0 ? (
            <div className="space-y-4">
              {publishedPosts.map((post) => {
                const displayDate = post.publishedAt ?? post.createdAt;
                const labels =
                  post.categories.length > 0 ? post.categories : post.tags;

                return (
                <Link
                  key={post.id}
                  href={`/articles/${post.slug}`}
                  className="group block"
                >
                  <article className="grid gap-6 rounded-[22px] border border-slate-200/90 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.055)] transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_42px_rgba(15,23,42,0.08)] sm:grid-cols-[250px_minmax(0,1fr)]">
                    {post.thumbnail?.url && (
                      <div className="relative aspect-8/5 w-full overflow-hidden rounded-[18px] border border-slate-200 bg-slate-50">
                        <Image
                          src={post.thumbnail.url}
                          alt={post.thumbnail.altText || post.title}
                          fill
                          sizes="(max-width: 640px) 100vw, 250px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    )}

                    <div
                      className={`flex min-w-0 flex-col justify-center ${
                        post.thumbnail?.url ? "" : "sm:col-span-2"
                      }`}
                    >
                      <div>
                        <time
                          dateTime={displayDate.toISOString()}
                          className="text-xs font-bold text-slate-500"
                        >
                          {displayDate.toLocaleDateString("ja-JP")}
                        </time>
                      </div>

                      <h2 className="mt-4 text-[20px] font-bold leading-snug tracking-[-0.01em] text-slate-950 transition-colors group-hover:text-blue-700">
                        {post.title}
                      </h2>
                      <p className="mt-3 line-clamp-3 text-[13px] leading-6 text-slate-600">
                        {getPostSummary(post)}
                      </p>

                      {labels.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {labels.slice(0, 3).map((label, labelIndex) => (
                            <span
                              key={`${label.id}-${label.name}`}
                              className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                                pillStyles[labelIndex % pillStyles.length]
                              }`}
                            >
                              {label.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                </Link>
                );
              })}
            </div>
          ) : (
            <p className="rounded-[18px] border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm font-medium text-slate-500">
              公開中の記事がありません。
            </p>
          )}

          <Pagination
            currentPage={currentPage}
            totalPostCount={totalPostCount}
            basePath="/"
            variant="public"
          />
        </main>

        <PublicSidebar tags={tags} />
      </div>
    </div>
  );
}
