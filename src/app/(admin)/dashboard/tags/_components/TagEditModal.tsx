"use client";

import { useActionState, useEffect, useState } from "react";
import { editTag } from "../actions";
import type { TagFormState } from "../actions";
import type { Tag } from "@/src/generated/prisma/client";
import Button from "@/src/components/Button";

type EditModalProps = {
  editTargetTag: Tag;
  onCancel: () => void;
};

const initialState: TagFormState = {
  success: false,
  message: "",
};

export default function TagEditModal({ editTargetTag, onCancel }: EditModalProps) {
  const [formValue, setFormValue] = useState({
    name: editTargetTag.name,
    slug: editTargetTag.slug,
  });
  const [state, formAction] = useActionState(editTag, initialState);

  useEffect(() => {
    if (state.success) {
      onCancel();
    }
  }, [state.success, onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
      <form
        action={formAction}
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl"
      >
        <input type="hidden" name="id" value={editTargetTag.id} />

        <div>
          <h2 className="text-lg font-bold">タグを編集</h2>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            タグ名とスラッグを変更できます。
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="edit-tag-name" className="text-sm font-bold text-slate-700">
              タグ名
            </label>
            <input
              type="text" name="name" id="edit-tag-name"
              className="w-full rounded-md border border-divider bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              required
              value={formValue.name}
              onChange={(e) => setFormValue({
                ...formValue,
                name: e.target.value,
              })}
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="edit-tag-slug" className="text-sm font-bold text-slate-700">
              スラッグ
            </label>
            <input
              type="text" name="slug" id="edit-tag-slug"
              className="w-full rounded-md border border-divider bg-white px-3 py-2 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              value={formValue.slug}
              onChange={(e) => setFormValue({
                ...formValue,
                slug: e.target.value,
              })}
            />
          </div>
        </div>

        {state.message && (
          <p
            className={state.success ? "mt-5 text-sm text-blue-700" : "mt-5 text-sm text-red-600"}
            aria-live="polite"
          >
            {state.message}
          </p>
        )}

        <div className="mt-6 flex gap-3">
          <Button
            variant="primary"
            type="submit"
            className="flex flex-1 items-center justify-center py-2.5"
          >
            更新
          </Button>
          <Button
            variant="outline"
            className="flex flex-1 items-center justify-center py-2.5"
            onClick={onCancel}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </div>
  );
}
