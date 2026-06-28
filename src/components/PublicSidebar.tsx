import { getProfile } from "../lib/profile";
import { getPublishedPostCategories } from "../lib/category";
import { toPlainText } from "../lib/utils";
import Image from "next/image";
import Link from "next/link";
import type { Tag } from "../generated/prisma/client";

type SidebarProps = {
  tags: Tag[];
};

export async function PublicSidebar({ tags }: SidebarProps) {
  const profile = await getProfile();
  const categories = await getPublishedPostCategories();
  const sectionClass =
    "rounded-[22px] border border-slate-200/90 bg-white p-[22px] shadow-[0_14px_35px_rgba(15,23,42,0.05)]";

  return (
    <aside className="space-y-4 lg:sticky lg:top-6 lg:self-start">
      <section
        aria-labelledby="profile-heading"
        className={sectionClass}
      >
        <div className="flex items-center gap-4">
          {profile?.image?.url && (
            <Image
              src={profile.image.url}
              width={112}
              height={112}
              alt={
                profile.image.altText || `${profile.name}のプロフィール画像`
              }
              className="size-14 shrink-0 rounded-[18px] border border-blue-100 bg-blue-50 object-cover"
              unoptimized
            />
          )}
          <div className="min-w-0">
            <h2
              id="profile-heading"
              className="truncate text-[18px] font-bold text-slate-950"
            >
              {profile?.name}
            </h2>
          </div>
        </div>
        <p className="mt-5 text-sm leading-7 text-slate-600">
          {toPlainText(profile?.content)}
        </p>
      </section>

      <section
        aria-labelledby="category-heading"
        className={sectionClass}
      >
        <div className="flex items-center justify-between gap-4">
          <h2
            id="category-heading"
            className="text-[18px] font-bold leading-tight text-slate-950"
          >
            カテゴリ
          </h2>
          <Link
            href="/categories"
            className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            一覧
          </Link>
        </div>
        {categories.length > 0 ? (
          <ul className="mt-5 divide-y divide-slate-200">
            {categories.slice(0, 5).map((category) => (
              <li
                key={category.id}
                className="flex items-center justify-between gap-4 py-3.5"
              >
                <Link
                  href={`/categories/${category.slug}`}
                  className="truncate text-sm font-medium text-slate-800 transition-colors hover:text-blue-600"
                >
                  {category.name}
                </Link>
                <span className="min-w-7 rounded-full bg-slate-50 px-2 py-1 text-center text-xs font-bold text-slate-500">
                  {category._count.posts}
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
        className={sectionClass}
      >
        <div className="flex items-center justify-between gap-4">
          <h2
            id="tag-heading"
            className="text-[18px] font-bold leading-tight text-slate-950"
          >
            タグ
          </h2>
          <Link
            href="/tags"
            className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-800"
          >
            一覧
          </Link>
        </div>
        {tags.length > 0 ? (
          <ul className="mt-5 flex flex-wrap gap-2">
            {tags.slice(0, 10).map((tag) => (
              <li key={tag.id}>
                <Link
                  href={`/tags/${tag.slug}`}
                  className="inline-flex rounded-full border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-xs font-bold text-slate-600 transition-colors hover:border-blue-100 hover:bg-blue-50 hover:text-blue-700"
                >
                  #{tag.name}
                </Link>
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
  );
}
