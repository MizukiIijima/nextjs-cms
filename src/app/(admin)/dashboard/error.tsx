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
      <div className="mt-8 p-3 rounded-2xl border border-divider bg-white w-full">
        <p className="mt-2 text-center">データを読み込めませんでした。</p>
        <Button
        variant="default"
        className="mx-auto mt-3 block w-80 max-w-full cursor-pointer py-2"
        onClick={() => unstable_retry()}>もう一度試す</Button>
      </div>
    </div>
  )
}
