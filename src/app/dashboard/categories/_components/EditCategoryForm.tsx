"use client";

import type { Category } from "@/src/generated/prisma/client";
import { useState } from "react";
import Button from "@/src/components/Button";

type EditCategoryFormProps = {
  category: Category;
  onCancel: () => void;
};

export default function EditCategoryForm({ category, onCancel }: EditCategoryFormProps) {
  const [formValue, setFormValue] = useState({
    name: category.name,
    slug: category.slug,
    description: category.description ?? "",
  });
  const nameId = `category-name-${category.id}`;
  const slugId = `category-slug-${category.id}`;
  const descriptionId = `category-description-${category.id}`;

  return (
    <td colSpan={5} className="bg-slate-50 px-4 py-5">
      <form action="hgoe" className="mx-auto max-w-4xl space-y-5 rounded-lg border border-slate-200 bg-white p-5">

        <div className="grid gap-4 md:grid-cols-[1fr_1.1fr]">
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <label htmlFor={nameId} className="text-sm font-medium text-slate-800">
                カテゴリ名
              </label>
              <input
                type="text" name="name" id={slugId} required
                value={formValue.name}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                onChange={(e) => setFormValue({
                  ...formValue,
                  name: e.target.value,
                })}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor={descriptionId} className="text-sm font-medium text-slate-800">
                slug
              </label>
              <input
                type="text" name="slug" id={`category-slug-${category.id}`} required
                value={formValue.slug}
                className="rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
                onChange={(e) => setFormValue({
                  ...formValue,
                  slug: e.target.value,
                })}
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor={`category-description-${category.id}`} className="text-sm font-medium text-slate-800">
              説明文
            </label>
            <textarea
              name="description"
              id={`category-description-${category.id}`}
              value={formValue.description}
              rows={5}
              className="min-h-28 resize-y rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm outline-none transition focus:border-blue-300 focus:ring-4 focus:ring-blue-50"
              onChange={(e) => setFormValue({
                ...formValue,
                description: e.target.value,
              })}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          <Button
            variant="primary"
            className="m-0! w-auto! px-5 py-2.5 text-sm font-bold"
          >
            更新
          </Button>
          <Button
            variant="default"
            className="m-0! w-auto! border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold"
            onClick={onCancel}
          >
            キャンセル
          </Button>
        </div>
      </form>
    </td>
  );
}
