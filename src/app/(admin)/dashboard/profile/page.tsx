import Button from "@/src/components/Button";

export default function ProfilePage() {
  return (
    <div className="grow p-6">
      <div className="mt-6 text-sm font-medium text-slate-500">
        ダッシュボード / プロフィール編集
      </div>
      <div className="mt-2 flex flex-col gap-1">
        <h1 className="text-3xl font-bold text-slate-900">プロフィール編集</h1>
        <p className="text-sm text-slate-500">
          記事下に表示するプロフィール情報を編集します。
        </p>
      </div>

      <form className="mt-6 w-full space-y-6 rounded-lg border border-divider bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <label
            htmlFor="thumbnail"
            className="text-sm font-bold text-slate-900"
          >
            プロフィール画像
          </label>
          <label
            htmlFor="thumbnail"
            className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-divider bg-gray-50 px-4 py-8 text-center transition-colors hover:bg-gray-100"
          >
            <span className="text-sm font-medium text-slate-900">
              画像を選択
            </span>
            <span className="text-xs text-slate-500">
              JPG, PNG, WebP などの画像ファイル
            </span>
          </label>
          <input
            type="file"
            name="thumbnail"
            id="thumbnail"
            accept="image/*"
            className="sr-only"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-bold text-slate-900">
            表示名
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="w-full rounded-md border border-divider bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="content"
            className="text-sm font-bold text-slate-900"
          >
            プロフィール
          </label>
          <textarea
            name="content"
            id="content"
            rows={8}
            className="w-full resize-y rounded-md border border-divider bg-white px-3 py-2 text-sm leading-7 outline-none transition-colors focus:border-primary"
          />
        </div>

        <div className="flex justify-end">
          <Button type="submit" variant="primary" className="min-w-32">
            保存
          </Button>
        </div>
      </form>
    </div>
  );
}
