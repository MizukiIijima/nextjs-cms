'use client';

import { useActionState, useState } from "react";
import MarkdownEditor from "./MarkdownEditor";
import {
  createPostAction,
  editPostAction,
  type CreatePostState,
} from "@/src/app/dashboard/posts/actions";

type FormProps =
  | {
      mode: "create";
      postTitle: string;
      postContent: string;
    }
  | {
      id: number;
      mode: "edit";
      postTitle: string;
      postContent: string;
    };

export default function PostForm(props: FormProps) {
  const { mode, postTitle, postContent } = props;
  const initialState: CreatePostState = {
    success: false,
    message: "",
    errors: {},
  };
  const postAction = mode === "create" ? createPostAction : editPostAction.bind(null, props.id);
  const [state, formAction] = useActionState(postAction, initialState);
  const [title, setTitle] = useState(postTitle);
  const [content, setContent] = useState(postContent);

  return (
    <form action={formAction} className="mt-6 space-y-5 max-w-5xl grow">
      {state.message && <p>{state.message}</p>}
      <div className="flex flex-col gap-2">
        <label htmlFor="title">タイトル</label>
        <input type="text" name="title" id="title" className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm" required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label htmlFor="content">本文</label>
        <input type="hidden" name="content" value={content} />
        <div className="rounded-lg border border-gray-300 bg-white">
          <MarkdownEditor value={content} onChange={setContent}/>
        </div>
      </div>
      <button>{mode === "create" ? "作成" : "編集" }</button>
    </form>
  )
}
