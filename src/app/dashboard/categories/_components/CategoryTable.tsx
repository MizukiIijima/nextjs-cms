"use client";

import { Fragment, useState } from "react";
import { deleteCategory } from "../actions";
import type { getAllCategories } from "@/src/lib/category";
import Button from "@/src/components/Button";
import EditCategoryForm from "./EditCategoryForm";
import ConfirmModal from "@/src/components/ConfirmModal";

type CategoryList = Awaited<ReturnType<typeof getAllCategories>>;

const thStyle = "py-3 px-4 text-left font-bold text-slate-600";
const tdStyle = "py-3 px-4 text-sm text-slate-700 break-words";

export default function CategoryTable({ allCategories }: { allCategories: CategoryList }) {
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);

  const deleteTargetCategory = allCategories.find(
    (category) => category.id === deleteCategoryId
  );

  return (
    <>
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
                        setDeleteCategoryId(isDeleteTarget ? null : category.id);
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

      {deleteTargetCategory && (
        <ConfirmModal
          id={deleteTargetCategory.id}
          name={deleteTargetCategory.name}
          count={deleteTargetCategory._count.posts}
          type="category"
          deleteAction={deleteCategory.bind(null, deleteTargetCategory.id)}
          onCancel={() => setDeleteCategoryId(null)}
        />
      ) 
      }
    </>
  );
}
