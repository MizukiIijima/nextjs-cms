"use client";

import { Fragment, useState } from "react";
import { FolderTree } from "lucide-react";
import { deleteCategory } from "../actions";
import type { getAllCategories } from "@/src/lib/category";
import Button from "@/src/components/Button";
import EditCategoryForm from "./EditCategoryForm";
import ConfirmModal from "@/src/components/ConfirmModal";

type CategoryList = Awaited<ReturnType<typeof getAllCategories>>;

const thStyle = "py-3 px-4 text-left text-xs font-bold text-slate-600";
const tdStyle = "py-3 px-4 text-sm text-slate-700 break-words";

export default function CategoryTable({ allCategories }: { allCategories: CategoryList }) {
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);

  const deleteTargetCategory = allCategories.find(
    (category) => category.id === deleteCategoryId
  );

  if (allCategories.length === 0) {
    return (
      <div className="mt-4 rounded-lg border border-dashed border-divider bg-white px-6 py-10 text-center">
        <FolderTree className="mx-auto size-8 text-gray" aria-hidden="true" />
        <p className="mt-3 text-sm font-bold text-slate-700">
          登録済みのカテゴリはありません
        </p>
        <p className="mt-1 text-sm text-gray">
          左のフォームから最初のカテゴリを作成できます。
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
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
              const isDeleteTarget = deleteCategoryId === category.id;

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
                        className="w-16 px-2 py-1.5"
                        onClick={() => {
                          setEditingCategoryId(isEditing ? null : category.id);
                        }}
                      >
                        編集
                      </Button>
                      <Button
                        variant="danger"
                        className="w-16 px-2 py-1.5"
                        onClick={() => {
                          setDeleteCategoryId(
                            isDeleteTarget ? null : category.id,
                          );
                        }}
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
      </div>

      {deleteTargetCategory && (
        <ConfirmModal
          target={deleteTargetCategory}
          type="category"
          deleteAction={deleteCategory.bind(null, deleteTargetCategory.id)}
          onCancel={() => setDeleteCategoryId(null)}
        />
      ) 
      }
    </>
  );
}
