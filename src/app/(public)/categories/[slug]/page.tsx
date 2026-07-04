import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import Pagination from "@/src/components/Pagination";
import { PublicSidebar } from "@/src/components/PublicSidebar";
import {
  getCategoryMetadataBySlug,
  getPublishedCategoryBySlug,
} from "@/src/lib/category";
import { getPublishedPostTags } from "@/src/lib/tags";
import { toPlainText } from "@/src/lib/utils";
import type { Metadata } from "next";

type Props = {
  params: Promise<{ slug: string }>;
};

type PageProps = Props & {
  searchParams: Promise<{ page?: string | string[] }>;
};

const POSTS_PER_PAGE = 10;

const pillStyles = [
  "bg-blue-50 text-blue-700",
  "bg-indigo-50 text-indigo-700",
  "bg-violet-50 text-violet-700",
  "bg-emerald-50 text-emerald-700",
  "bg-orange-50 text-orange-700",
] as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryMetadataBySlug(slug);

  if (!category) {
    return {
      title: 'カテゴリが存在しません。',
      description: 'カテゴリが存在しません。',
    }
  }

  return {
    title: category.name,
    description: category
    .description || `${category.name}の一覧ページです。`,
  }
}

function getPostSummary(post: { excerpt: string | null; content: string }) {
  const summary = post.excerpt || toPlainText(post.content);

  if (summary.length <= 96) {
    return summary;
  }

  return `${summary.slice(0, 96)}...`;
}

export default async function CategoryDetailPage({
  params,
  searchParams,
}: PageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const pageValue = Array.isArray(pageParam) ? pageParam[0] : pageParam;
  const parsedPage = Number(pageValue ?? "1");
  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const [category, tags] = await Promise.all([
    getPublishedCategoryBySlug(slug, currentPage, POSTS_PER_PAGE),
    getPublishedPostTags(),
  ]);

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto grid w-full max-w-268 gap-7 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,744px)_300px] lg:px-0">
        <main>
          <section>
            <div className="mb-8 border-b border-slate-200 pb-8">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="mb-2 text-sm font-bold text-blue-600">
                    {category._count.posts}件の記事
                  </p>
                  <h1 className="text-[34px] font-bold leading-tight tracking-[-0.03em] text-slate-950">
                    {category.name}
                  </h1>
                </div>

                <Link
                  href="/categories"
                  className="inline-flex rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-blue-200 hover:text-blue-600"
                >
                  一覧へ戻る
                </Link>
              </div>

              <p className="mt-5 max-w-3xl text-sm leading-7 text-slate-600">
                {category.description || "カテゴリの説明はありません。"}
              </p>
            </div>

            {category.posts.length > 0 ? (
              <div className="space-y-3.5">
                {category.posts.map((post, index) => {
                  const displayDate = post.publishedAt ?? post.createdAt;
                  const labels = post.categories;

                  return (
                    <Link
                      key={post.id}
                      href={`/articles/${post.slug}`}
                      className="block rounded-[18px] border border-slate-200 bg-white px-5 py-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-blue-200 sm:px-6 sm:py-5"
                    >
                      <div className="flex flex-wrap items-center gap-2.5">
                        {labels.slice(0, 2).map((label, labelIndex) => (
                          <span
                            key={`${label.id}-${label.name}`}
                            className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                              pillStyles[
                                (index + labelIndex) % pillStyles.length
                              ]
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

                      {post.thumbnail?.url && (
                        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
                          <div className="relative aspect-video w-full shrink-0 overflow-hidden rounded-[14px] bg-slate-100 sm:w-60">
                            <Image
                              src={post.thumbnail.url}
                              alt={post.thumbnail.altText || post.title}
                              fill
                              sizes="(max-width: 640px) 100vw, 240px"
                              className="object-cover"
                              unoptimized
                            />
                          </div>
                          <p className="line-clamp-3 text-[13px] leading-6 text-slate-600">
                            {getPostSummary(post)}
                          </p>
                        </div>
                      )}

                      {!post.thumbnail?.url && (
                        <p className="mt-3 line-clamp-2 text-[13px] leading-6 text-slate-600">
                          {getPostSummary(post)}
                        </p>
                      )}
                    </Link>
                  );
                })}
              </div>
            ) : (
              <p className="rounded-[18px] border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm font-medium text-slate-500">
                このカテゴリの公開記事はまだありません。
              </p>
            )}

            <Pagination
              currentPage={currentPage}
              totalPostCount={category._count.posts}
              basePath={`/categories/${category.slug}`}
              variant="public"
            />
          </section>
        </main>
        <PublicSidebar tags={tags} />
      </div>
    </div>
  );
}
