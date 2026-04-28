'use client';

import { createPostAction } from "@/src/app/dashboard/posts/actions";
import MarkdownEditor from "@/src/components/MarkdownEditor";
import { useState } from "react";

export default function CreatePost() {
  const [content, setContent] = useState('');

  return (
    <>
      <div className="p-6 grow">
        <div className="mt-6">管理画面 › 記事作成</div>
        <h1 className="mt-2 font-bold text-3xl">記事作成</h1>
        <form action={createPostAction} className="mt-6 space-y-5 max-w-5xl">
          <div className="flex flex-col gap-2">
            <label htmlFor="title">タイトル</label>
            <input type="text" name="title" id="title" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" />
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="content">本文</label>
            <div className="h-96 rounded-lg border border-gray-300 bg-white overflow-hidden">
              <MarkdownEditor value={content} onChange={setContent}/>
            </div>
          </div>
          <button>作成</button>
        </form>
      </div>
    </>
  )
}
