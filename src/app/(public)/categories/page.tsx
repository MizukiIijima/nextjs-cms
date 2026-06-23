import Link from "next/link";
import { PublicSidebar } from "@/src/components/PublicSidebar";
import { getAllCategories } from "@/src/lib/category";
import { getPublishedPostTags } from "@/src/lib/tags";

export default async function CategoryPage() {
  const [allCategories, tags] = await Promise.all([
    getAllCategories(),
    getPublishedPostTags(),
  ]);

  return (
    <div className="min-h-screen bg-[#f4f6f8] text-slate-950">
      <div className="mx-auto grid w-full max-w-268 gap-7 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,744px)_300px] lg:px-0">
        <main>
          <section>
            <div className="mb-8 border-b border-slate-200 pb-8">
              <h1 className="text-[34px] font-bold leading-tight tracking-[-0.03em] text-slate-950">
                カテゴリから探す
              </h1>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {allCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)] transition-colors hover:border-blue-200"
                >
                  <h2 className="text-[22px] font-bold leading-tight tracking-[-0.02em] text-slate-950">
                    {category.name}
                  </h2>
                  <p className="mt-3 min-h-12 text-sm leading-7 text-slate-600">
                    {category.description
                      ? category.description
                      : "カテゴリの説明はありません"}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        </main>

        <PublicSidebar tags={tags} />
      </div>
    </div>
  )
}
