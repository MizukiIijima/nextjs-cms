import Link from "next/link";
import { PublicSidebar } from "@/src/components/PublicSidebar";
import { getPublishedPostTags } from "@/src/lib/tags";

export default async function TagPage() {
  const tags = await getPublishedPostTags();

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-950">
      <div className="mx-auto grid w-full max-w-268 gap-7 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,744px)_300px] lg:px-0">
        <main>
          <section>
            <div className="mb-8 border-b border-slate-200 pb-8">
              <h1 className="text-[34px] font-bold leading-tight tracking-[-0.03em] text-slate-950">
                タグから探す
              </h1>
            </div>

            {tags.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2">
                {tags.map((tag) => (
                  <Link
                    key={tag.id}
                    href={`/tags/${tag.slug}`}
                    className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-blue-200"
                  >
                    <h2 className="text-[22px] font-bold leading-tight tracking-[-0.02em] text-slate-950">
                      <span className="text-slate-400"># </span>
                      {tag.name}
                    </h2>
                    <p className="mt-3 text-sm font-bold text-blue-600">
                      {tag._count.posts}件の記事
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="rounded-[18px] border border-dashed border-slate-300 bg-white px-5 py-10 text-center text-sm font-medium text-slate-500">
                タグが登録されていません。
              </p>
            )}
          </section>
        </main>

        <PublicSidebar tags={tags} />
      </div>
    </div>
  );
}
