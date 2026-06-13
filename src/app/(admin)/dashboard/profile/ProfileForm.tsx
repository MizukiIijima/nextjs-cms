"use client";

import { useEffect, useState, useActionState } from "react";
import { createAction, type ProfileState } from "./actions";
import type { Profile } from "@/src/generated/prisma/client";
import Image from "next/image";
import Button from "@/src/components/Button";

const initialState: ProfileState = {
  success: false,
  message: "",
  errors: {},
};

export default function ProfileForm({ profile }: { profile: Profile | null }) {
  const [fileName, setFileName] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [formValue, setFormValue] = useState({
    name: profile?.name ?? "",
    content: profile?.content ?? "",
  });
  const [state, formAction] = useActionState(createAction, initialState);

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
      className="mt-6 w-full space-y-6 rounded-lg border border-divider bg-white p-6 shadow-sm"
    >
      {state.message && (
        <p
          className={`rounded-md border px-4 py-3 text-sm font-bold ${
            state.success
              ? "border-blue-200 bg-blue-50 text-blue-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
          aria-live="polite"
        >
          {state.message}
        </p>
      )}
      <div className="space-y-3">
        <label htmlFor="image" className="text-sm font-bold text-slate-900">
          プロフィール画像
        </label>

        <label
          htmlFor="image"
          className="flex cursor-pointer items-center gap-4 rounded-md border border-divider bg-white p-4 transition-colors hover:bg-gray-50"
        >
          <span className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100">
            {previewUrl ? (
              <Image
                src={previewUrl}
                alt=""
                width={80}
                height={80}
                className="size-full object-cover"
                unoptimized
              />
            ) : (
              <span className="text-xs text-slate-400">No image</span>
            )}
          </span>
          <span className="min-w-0 space-y-1">
            <span className="block truncate text-sm font-medium text-slate-900">
              {fileName || "画像を選択"}
            </span>
            <span className="block text-xs text-slate-500">
              JPG, PNG, WebP などの画像ファイル
            </span>
          </span>
        </label>

        <input
          type="file"
          name="image"
          id="image"
          accept="image/*"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            setFileName(file?.name ?? "");
            setPreviewUrl(file ? URL.createObjectURL(file) : "");
          }}
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
          value={formValue?.name}
          className="w-full rounded-md border border-divider bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-primary"
          onChange={(e) => {
            setFormValue({
              ...formValue,
              name: e.target.value,
            })
          }}
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
          value={formValue?.content}
          className="w-full resize-y rounded-md border border-divider bg-white px-3 py-2 text-sm leading-7 outline-none transition-colors focus:border-primary"
          onChange={(e) => {
            setFormValue({
              ...formValue,
              content: e.target.value,
            })
          }}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" variant="primary" className="min-w-32">
          保存
        </Button>
      </div>
    </form>
  )
}