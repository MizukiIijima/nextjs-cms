'use client';

import {
  createPostAction,
  type CreatePostState,
} from "@/src/app/dashboard/posts/actions";
import MarkdownEditor from "@/src/components/MarkdownEditor";
import { useActionState, useState } from "react";


export default function CreatePost() {
  const [content, setContent] = useState('');
  const initialState: CreatePostState = {
    success: false,
    message: "",
    errors: {},
  };
  const [state, postAction] = useActionState(
    createPostAction, 
    initialState
  );

  const panelClassName = "rounded-lg border border-gray-300 bg-white px-4 py-6";

  return (
    <>
      <div className="p-6 grow">
        {state.message && <p className="absolute left-1/2 w-100 -translate-x-1/2 rounded-[10px] border-2 border-[#afefaf] p-1.25 text-center">{state.message}</p>}
        <div className="mt-6">管理画面 › 記事作成</div>
        <h1 className="mt-2 font-bold text-3xl">記事作成</h1>
        <div className="flex justify-between gap-10 items-start">
          <form action={postAction} className="mt-6 space-y-5 max-w-5xl grow">
            <div className="flex flex-col gap-2">
              <label htmlFor="title">タイトル</label>
              <input type="text" name="title" id="title" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" required />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="content">本文</label>
              <input type="hidden" name="content" value={content} />
              <div className="rounded-lg border border-gray-300 bg-white">
                <MarkdownEditor value={content} onChange={setContent}/>
              </div>
            </div>
            <button>作成</button>
          </form>

          <div className="grow">
            <div className={`${panelClassName} space-y-4`}>
              <h2 className="font-bold text-xl">公開設定</h2>
              <div className="flex gap-3">
                <p>状態</p>
                <p>valuevalue</p>
              </div>
              <div className="flex gap-3">
                <p>公開日</p>
                <p>valuevalue</p>
              </div>
              <div className="flex gap-3">
                <p>更新日</p>
                <p>valuevalue</p>
              </div>
            </div>

            <div className={`${panelClassName} mt-5 space-x-3`}>
              <h2 className="font-bold text-xl">カテゴリ</h2>
              
            </div>

            <div className={`${panelClassName} mt-5 space-x-3`}>
              <h2 className="font-bold text-xl">アイキャッチ画像</h2>
              
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
