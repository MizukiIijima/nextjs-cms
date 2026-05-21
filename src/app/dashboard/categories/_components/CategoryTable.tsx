"use client";

import { Fragment, useState } from "react";
import Button from "@/src/components/Button";
import EditCategoryForm from "./EditCategoryForm";
import type { getAllCategories } from "@/src/lib/category";

type CategoryList = Awaited<ReturnType<typeof getAllCategories>>;

const thStyle = "py-3 px-4 text-left font-bold text-slate-600";
const tdStyle = "py-3 px-4 text-sm text-slate-700 break-words";

export default function CategoryTable({ allCategories }: { allCategories: CategoryList }) {
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);

  return (
    <table className="w-full table-fixed">
      <colgroup>
        <col className="w-[15%]" />
        <col className="w-[15%]" />
        <col className="w-[42%]" />
        <col className="w-[10%]" />
        <col className="w-[18%]" />
      </colgroup>
      <thead className="bg-slate-50">
        <tr>
          <th className={thStyle}>カテゴリ名</th>
          <th className={thStyle}>slug</th>
          <th className={thStyle}>説明</th>
          <th className={thStyle}>記事数</th>
          <th className={thStyle}>操作</th>
        </tr>
      </thead>
      <tbody>
        {allCategories.map((category) => {
          const isEditing = editingCategoryId === category.id;

          return (
            <Fragment key={category.id}>
              <tr className="border-t border-slate-200 odd:bg-white even:bg-slate-50">
                <td className={tdStyle}>{category.name}</td>
                <td className={tdStyle}>{category.slug}</td>
                <td className={tdStyle}>{category.description || "-"}</td>
                <td className={tdStyle}>{category._count.posts}</td>
                <td className={`flex gap-2 ${tdStyle}`}>
                  <Button
                    variant="default"
                    className="py-1.5 w-8"
                    onClick={() => {
                      setEditingCategoryId(isEditing ? null : category.id);
                    }}
                  >
                    編集
                  </Button>
                  <Button
                    variant="danger"
                    className="py-1.5 w-8"
                  >
                    削除
                  </Button>
                </td>
              </tr>
              {isEditing && (
                <tr>
                  <EditCategoryForm 
                    category={category}
                    onCancel={() => setEditingCategoryId(null)}
                  />
                </tr>
              )}
            </Fragment>
            )
          }
        )}
      </tbody>
    </table>
  );
}
