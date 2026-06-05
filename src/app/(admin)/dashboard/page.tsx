import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="p-6">
      <Link href={"/dashboard/posts/create"}>記事作成</Link>
      <p>管理画面 › ダッシュボード</p>
      <h1>ダッシュボード</h1>
    </div>
  )
}