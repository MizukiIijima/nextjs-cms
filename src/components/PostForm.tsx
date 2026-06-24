'use client';

import { useActionState, useEffect, useRef, useState } from "react";
import MarkdownEditor from "./MarkdownEditor";
import Button from "./Button";
import {
  createPostAction,
  editPostAction,
  type CreatePostState,
} from "@/src/app/(admin)/dashboard/posts/actions";
import type { Category, Tag } from "../generated/prisma/client";

type FormProps =
  | {
      mode: "create";
      postTitle: string;
      postSlug: string;
      postContent: string;
      allCategories: Category[];
      allTags: Tag[];
    }
  | {
      id: number;
      mode: "edit";
      postTitle: string;
      postSlug: string;
      postContent: string;
      allCategories: Category[];
      allTags: Tag[];
      thumbnail: string | null;
    };

export default function PostForm(props: FormProps) {
  const { mode, postTitle, postContent, allCategories, allTags } = props;
  const thumbnailUrl = mode === "edit" ? props.thumbnail : null;
  const initialState: CreatePostState = {
    success: false,
    message: "",
    errors: {},
  };
  const postAction =
    mode === "create" ? createPostAction : editPostAction.bind(null, props.id);
  const [state, formAction] = useActionState(postAction, initialState);
  const [title, setTitle] = useState(postTitle);
  const [slug, setSlug] = useState(props.postSlug);
  const [content, setContent] = useState(postContent);
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const currentThumbnailUrl = previewUrl || thumbnailUrl;
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <form
      action={formAction}
      className="mt-6 grid w-full grow gap-6 xl:grid-cols-[minmax(0,1200px)_minmax(480px,560px)]"
    >
      {state.message && (
        <div
          className={`fixed top-6 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 rounded-lg border px-4 py-3 text-center text-sm font-bold shadow-lg ${
            state.success
              ? "border-blue-200 bg-blue-50 text-blue-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          aria-live="polite"
        >
          {state.message}
        </div>
      )}
      <div className="space-y-5">
        <div className="flex flex-col gap-2">
          <label htmlFor="title">タイトル</label>
          <input
            type="text"
            name="title"
            id="title"
            className="rounded-md border border-divider bg-white px-3 py-2 text-sm"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          {state.errors?.title && (
            <p className="text-xs text-red-600">{state.errors.title[0]}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="slug">スラッグ</label>
          <input
            type="text"
            name="slug"
            id="slug"
            className="rounded-md border border-divider bg-white px-3 py-2 text-sm"
            placeholder="未入力ならタイトルから自動生成"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
          {state.errors?.slug && (
            <p className="text-xs text-red-600">{state.errors.slug[0]}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="content">本文</label>
          <input type="hidden" name="content" value={content} />
          <div className="rounded-lg border border-divider bg-white">
            <MarkdownEditor value={content} onChange={setContent} />
          </div>
        </div>
        <Button
          variant="primary"
          type="submit"
          name="status"
          value="PUBLISHED"
          className="mx-auto block w-80 max-w-full py-2.5"
        >
          {mode === "create" ? "作成" : "編集"}
        </Button>
      </div>

      <aside className="space-y-4">
        <div className="rounded-lg border border-divider bg-white p-4 shadow-sm">
          <h2 className="text-base font-bold">公開設定</h2>
          <div className="mt-3 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-medium text-gray-500">状態</h3>
              <p className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                -
              </p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-medium text-gray-500">公開日</h3>
              <p className="text-sm font-bold text-gray-900">-</p>
            </div>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-medium text-gray-500">更新日</h3>
              <p className="text-sm font-bold text-gray-900">-</p>
            </div>
          </div>
          <div className="mt-5 flex gap-2">
            <button
              type="button"
              className="rounded-full border border-divider bg-white px-5 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
            >
              プレビュー
            </button>
            <button
              type="submit"
              name="status"
              value="DRAFT"
              className="rounded-full border border-divider bg-white px-5 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
            >
              下書き保存
            </button>
          </div>
        </div>

        <div className="rounded-lg border border-divider bg-white p-4 shadow-sm">
          <h2 className="text-base font-bold">カテゴリ</h2>
          <div className="mt-3 space-y-2">
            {allCategories.length > 0 ? (
              allCategories.map((category) => {
                const categoryInputId = `category-${category.id}`;

                return (
                  <label
                    key={category.id}
                    htmlFor={categoryInputId}
                    className="flex cursor-pointer items-center gap-3 rounded-md border border-divider px-3 py-2 text-sm transition-colors hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      id={categoryInputId}
                      name="categoryIds"
                      value={String(category.id)}
                      className="size-4 rounded border-divider"
                    />
                    <span>{category.name}</span>
                  </label>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">カテゴリが登録されていません</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-divider bg-white p-4 shadow-sm">
          <h2 className="text-base font-bold">タグ</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            {allTags.length > 0 ? (
              allTags.map((tag) => {
                const tagInputId = `tag-${tag.id}`;

                return (
                  <label
                    key={tag.id}
                    htmlFor={tagInputId}
                    className="flex cursor-pointer items-center gap-2 rounded-full border border-divider px-3 py-1.5 text-sm transition-colors hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      id={tagInputId}
                      name="tagIds"
                      value={String(tag.id)}
                      className="size-3.5 rounded border-divider"
                    />
                    <span>{tag.name}</span>
                  </label>
                );
              })
            ) : (
              <p className="text-sm text-gray-500">タグが登録されていません</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border border-divider bg-white p-4 shadow-sm">
          <h2 className="text-base font-bold">アイキャッチ画像</h2>
          {currentThumbnailUrl ? (
            <div className="mt-3 space-y-3">
              <div
                className="aspect-video w-full rounded-md bg-gray-100 bg-cover bg-center"
                style={{ backgroundImage: `url(${currentThumbnailUrl})` }}
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                {fileName && (
                  <p className="min-w-0 flex-1 truncate text-sm font-medium text-gray-900">
                    {fileName}
                  </p>
                )}
                <div className="flex shrink-0 gap-2">
                  <label
                    htmlFor="thumbnail"
                    className="flex cursor-pointer items-center justify-center rounded-full border border-divider bg-white px-5 py-2 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-50"
                  >
                    画像を変更
                  </label>
                  <button
                    type="button"
                    className="rounded-full border border-red-200 bg-white px-5 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50"
                    onClick={() => {
                      setFileName("");
                      setPreviewUrl("");

                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                  >
                    削除
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <label
              htmlFor="thumbnail"
              className="mt-3 flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-divider bg-gray-50 px-4 py-6 text-center transition-colors hover:bg-gray-100"
            >
              <span className="text-sm font-medium">画像を選択</span>
              <span className="text-xs text-gray-500">
                JPG, PNG, WebP などの画像ファイル
              </span>
            </label>
          )}
          <input
            ref={fileInputRef}
            type="file"
            name="thumbnail"
            id="thumbnail"
            accept="image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setFileName(file?.name ?? "");
              setPreviewUrl(file ? URL.createObjectURL(file) : "");
            }}
          />
        </div>
      </aside>
    </form>
  );
}
