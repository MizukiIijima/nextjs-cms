
"use client";

import { Edit3, Hash, Trash2 } from "lucide-react";
import type { getAllTags } from "@/src/lib/tags";
import Button from "@/src/components/Button";
import ConfirmModal from "@/src/components/ConfirmModal";
import { useActionState, useState } from "react";
import { deleteTag, type TagFormState } from "../actions";
import TagEditModal from "./TagEditModal";

type AllTags = Awaited<ReturnType<typeof getAllTags>>;

type TagTableProps = {
  allTags: AllTags;
};

const initialState: TagFormState = {
  success: false,
  message: "",
};

export default function TagTable({ allTags }: TagTableProps) {
  const [deleteTagId, setDeleteTagId] = useState<number | null>(null);
  const [editTagId, setEditTagId] = useState<number | null>(null);
  const [state, deleteTagAction] = useActionState(deleteTag, initialState);
  const deleteTargetTag = allTags.find((tag) => tag.id === deleteTagId);
  const editTargetTag = allTags.find((tag) => tag.id === editTagId);

  if (allTags.length === 0) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-divider bg-white px-6 py-10 text-center">
        <Hash className="mx-auto size-8 text-gray" aria-hidden="true" />
        <p className="mt-3 text-sm font-bold text-slate-700">
          登録済みのタグはありません
        </p>
        <p className="mt-1 text-sm text-gray">
          左のフォームから最初のタグを作成できます。
        </p>
      </div>
    );
  }

  return (
    <>
      {state.message && (
        <p
          className="fixed left-1/2 top-6 z-60 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-bold text-red-700 shadow-lg"
          aria-live="polite"
        >
          {state.message}
        </p>
      )}

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {allTags.map((tag) => (
          <div
            key={tag.id}
            className="flex min-h-36 flex-col justify-between rounded-lg border border-divider bg-white p-4 shadow-sm"
          >
            <div>
              <div className="flex items-start justify-between gap-3">
                <h3 className="wrap-break-word text-sm font-bold leading-snug text-slate-900">
                  <span className="text-gray"># </span>
                  {tag.name}
                </h3>
                <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                  {tag._count.posts}件
                </span>
              </div>

              <p className="mt-2 break-all text-sm text-gray">tags/{tag.slug}</p>
            </div>

            <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
              <Button
                variant="default"
                className="flex flex-1 items-center justify-center gap-1.5 px-3"
                onClick={() => setEditTagId(tag.id)}
              >
                <Edit3 className="size-4" aria-hidden="true" />
                編集
              </Button>
              <Button
                variant="danger"
                className="flex flex-1 items-center justify-center gap-1.5 px-3"
                onClick={() => setDeleteTagId(tag.id)}
              >
                <Trash2 className="size-4" aria-hidden="true" />
                削除
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editTargetTag  && (
        <TagEditModal
          editTargetTag={editTargetTag}
          onCancel={() => setEditTagId(null)}
        />
      )}

      {deleteTargetTag && (
        <ConfirmModal
          target={deleteTargetTag}
          type="tag"
          deleteAction={deleteTagAction}
          onCancel={() => setDeleteTagId(null)}
        />
      )}
    </>
  );
}
