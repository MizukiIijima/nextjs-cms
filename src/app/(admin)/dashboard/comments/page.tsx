export default function CommentPage() {
  return (
    <div className="grow p-6">
      <div className="mt-6 text-sm font-medium text-slate-500">
        ダッシュボード / コメント管理
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900">コメント管理</h1>
      </div>

      <div className="mt-6 rounded-lg border border-dashed border-divider bg-white px-6 py-10 text-center">
        <p className="text-sm font-bold text-slate-700">準備中です</p>
        <p className="mt-1 text-sm text-slate-500">
          コメント一覧、承認、拒否、削除などの操作は今後追加します。
        </p>
      </div>
    </div>
  );
}
