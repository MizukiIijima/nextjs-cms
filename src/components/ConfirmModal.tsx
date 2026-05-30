import type { ComponentProps } from "react";
import Button from "./Button";

type ConfirmModalProps = {
  id: number;
  name: string;
  count: number;
  type: "category" | "tag";
  deleteAction: ComponentProps<"form">["action"];
  onCancel: () => void;
}

export default function ConfirmModal({ id, name, count, type, deleteAction, onCancel }: ConfirmModalProps) {

  return (
    <div className="fixed inset-0 z-50 flex min-h-screen items-center justify-center bg-slate-950/55 px-4 py-6 backdrop-blur-sm">
      <form
        action={deleteAction}
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 text-slate-900 shadow-2xl [&>h2]:text-lg [&>h2]:font-bold [&>p]:mt-2 [&>p]:text-sm [&>p]:leading-6 [&>p]:text-slate-600"
      >
        <input type="hidden" name="id" value={id} />

        <h2>「{name}」を削除しますか？</h2>
        <p>この操作は取り消せません。</p>
        <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 [&>p:first-child]:text-xs [&>p:first-child]:font-bold [&>p:first-child]:text-slate-500 [&>p:last-child]:mt-1 [&>p:last-child]:break-words [&>p:last-child]:text-sm [&>p:last-child]:font-semibold">
          <p>{type === "category"? "カテゴリ名" : "タグ名"}</p>
          <p>{name}</p>
        </div>
        <div className="mt-3 flex items-center justify-between rounded-lg border border-slate-200 bg-white px-4 py-3 [&>p:first-child]:text-sm [&>p:first-child]:text-slate-600 [&>p:last-child]:text-sm [&>p:last-child]:font-bold">
          <p>紐づく記事数</p>
          <p>{count} 件</p>
        </div>
        
        <Button
          variant="danger"
          className="mt-6 flex w-full items-center justify-center rounded-lg py-2.5"
          type="submit"
        >
          削除する
        </Button>
        <Button
          variant="default"
          className="mt-3 flex w-full items-center justify-center rounded-lg border border-slate-200 bg-white py-2.5 text-slate-700"
          onClick={onCancel}
        >
          キャンセル
        </Button>
      </form>
    </div>
  )
}
