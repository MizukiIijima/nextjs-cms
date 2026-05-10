"use client";

import { useEffect } from "react";
import Button from "@/src/components/Button";

type ErrorProps = {
  error: Error & { digest?: string };
  unstable_retry: () => void
}

export default function Error({ error, unstable_retry } :  ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="p-6 grow">
      <div className="mt-6">管理画面 › エラー</div>
      <h1 className="mt-2 font-bold text-3xl">エラーが発生しました。</h1>
      <div className="mt-8 p-3 rounded-2xl border border-slate-300 bg-white w-full">
        <p className="mt-2 text-center">データを読み込めませんでした。</p>
        <Button
        variant="default"
        className="mt-3 py-2 cursor-pointer"
        onClick={() => unstable_retry()}>もう一度試す</Button>
      </div>
    </div>
  )
}