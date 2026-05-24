"use client";

import Button from "@/src/components/Button";
import type { getAllTags } from "@/src/lib/tags";
import { Edit3, Hash, Trash2 } from "lucide-react";

type AllTags = Awaited<ReturnType<typeof getAllTags>>;

type TagTableProps = {
  allTags: AllTags;
};

export default function TagTable({ allTags }: TagTableProps) {
  if (allTags.length === 0) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-divider bg-white px-6 py-10 text-center">
        <Hash className="mx-auto size-8 text-gray" aria-hidden="true" />
        <p className="mt-3 font-bold text-slate-700">登録済みのタグはありません</p>
        <p className="mt-1 text-sm text-gray">左のフォームから最初のタグを作成できます。</p>
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
      {allTags.map((tag) => (
        <div
          key={tag.id}
          className="flex min-h-44 flex-col justify-between rounded-lg border border-divider bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
        >
          <div>
            <div className="flex items-start justify-between gap-3">
              <h3 className="wrap-break-word text-lg font-bold leading-snug text-slate-900">
                <span className="text-gray"># </span>
                {tag.name}
              </h3>
              <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                {tag._count.posts}件
              </span>
            </div>

            <p className="mt-2 break-all text-sm text-gray">tags/{tag.slug}</p>
            <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-600">
              {tag.description || "説明は未設定です。"}
            </p>
          </div>

          <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
            <Button
              variant="default"
              className="flex flex-1 items-center justify-center gap-1.5 px-3"
            >
              <Edit3 className="size-4" aria-hidden="true" />
              編集
            </Button>
            <Button
              variant="danger"
              className="flex flex-1 items-center justify-center gap-1.5 px-3"
            >
              <Trash2 className="size-4" aria-hidden="true" />
              削除
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
