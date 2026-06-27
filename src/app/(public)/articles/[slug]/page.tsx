import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";
import { PublicSidebar } from "@/src/components/PublicSidebar";
import { getPostNav, getPublishedPostBySlug } from "@/src/lib/posts";
import { getPublishedPostTags } from "@/src/lib/tags";

type Props = {
  params: Promise<{ slug: string }>;
};

const markdownComponents: Components = {
  h1: ({ ...props }) => (
    <h1 className="mt-10 text-3xl font-bold leading-tight text-slate-950" {...props} />
  ),
  h2: ({ ...props }) => (
    <h2 className="mt-9 text-2xl font-bold leading-tight text-slate-950" {...props} />
  ),
  h3: ({ ...props }) => (
    <h3 className="mt-8 text-xl font-bold leading-tight text-slate-950" {...props} />
  ),
  p: ({ ...props }) => <p className="mt-5 leading-8" {...props} />,
  a: ({ ...props }) => (
    <a className="font-medium text-blue-600 underline-offset-4 hover:underline" {...props} />
  ),
  ul: ({ ...props }) => (
    <ul className="mt-5 list-disc space-y-2 pl-6 leading-8" {...props} />
  ),
  ol: ({ ...props }) => (
    <ol className="mt-5 list-decimal space-y-2 pl-6 leading-8" {...props} />
  ),
  blockquote: ({ ...props }) => (
    <blockquote
      className="mt-6 border-l-4 border-blue-200 bg-blue-50/60 py-3 pl-4 pr-5 text-slate-700"
      {...props}
    />
  ),
  code: ({ className, ...props }) => (
    <code
      className={
        className
          ? `${className} text-sm`
          : "rounded bg-slate-100 px-1.5 py-0.5 text-[0.9em] text-slate-900"
      }
      {...props}
    />
  ),
  pre: ({ ...props }) => (
    <pre
      className="mt-6 overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-7 text-slate-100"
      {...props}
    />
  ),
  table: ({ ...props }) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full border-collapse text-sm" {...props} />
    </div>
  ),
  th: ({ ...props }) => (
    <th className="border border-slate-200 bg-slate-50 px-3 py-2 text-left font-bold" {...props} />
  ),
  td: ({ ...props }) => (
    <td className="border border-slate-200 px-3 py-2 align-top" {...props} />
  ),
};

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const [post, tags] = await Promise.all([
    getPublishedPostBySlug(decodeURIComponent(slug)),
    getPublishedPostTags(),
  ]);

  if (!post) {
    notFound();
  }

  const nav = await getPostNav(post.createdAt);
  const displayDate = post.publishedAt ?? post.createdAt;

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-950">
      <div className="mx-auto grid w-full max-w-268 gap-7 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,744px)_300px] lg:px-0">
        <main>
          <article className="rounded-[18px] border border-slate-200 bg-white px-5 py-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:px-8 sm:py-8">
            <Link
              href="/"
              className="inline-flex text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              新着記事へ戻る
            </Link>

            <header className="mt-5">
              <div className="flex flex-wrap items-center gap-2.5">
                {post.categories.slice(0, 2).map((category) => (
                  <span
                    key={category.id}
                    className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-700"
                  >
                    {category.name}
                  </span>
                ))}
                <time
                  dateTime={displayDate.toISOString()}
                  className="text-xs font-bold text-slate-400"
                >
                  {displayDate.toLocaleDateString("ja-JP")}
                </time>
              </div>

              <h1 className="mt-4 text-[34px] font-bold leading-tight tracking-[-0.03em] text-slate-950">
                {post.title}
              </h1>
            </header>

            {post.thumbnail?.url && (
              <div className="relative mt-6 aspect-video w-full overflow-hidden rounded-2xl bg-slate-100">
                <Image
                  src={post.thumbnail.url}
                  alt={post.thumbnail.altText || post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 744px"
                  className="object-cover"
                  unoptimized
                />
              </div>
            )}

            <div className="mt-7 text-[15px] text-slate-700">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {post.content}
              </ReactMarkdown>
            </div>
          </article>

          {(nav.older || nav.newer) && (
            <nav
              aria-label="記事ナビゲーション"
              className="mt-5 grid gap-3 sm:grid-cols-2"
            >
              {nav.older ? (
                <Link
                  href={`/articles/${nav.older.slug}`}
                  className="rounded-[18px] border border-slate-200 bg-white px-5 py-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-blue-200"
                >
                  <span className="text-xs font-bold text-slate-400">
                    前の記事
                  </span>
                  <span className="mt-1 block text-sm font-bold leading-6 text-slate-950">
                    {nav.older.title}
                  </span>
                </Link>
              ) : (
                <div />
              )}

              {nav.newer && (
                <Link
                  href={`/articles/${nav.newer.slug}`}
                  className="rounded-[18px] border border-slate-200 bg-white px-5 py-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-blue-200 sm:text-right"
                >
                  <span className="text-xs font-bold text-slate-400">
                    次の記事
                  </span>
                  <span className="mt-1 block text-sm font-bold leading-6 text-slate-950">
                    {nav.newer.title}
                  </span>
                </Link>
              )}
            </nav>
          )}
        </main>

        <PublicSidebar tags={tags} />
      </div>
    </div>
  );
}
