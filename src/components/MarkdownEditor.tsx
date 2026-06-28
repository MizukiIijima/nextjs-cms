"use client";

import dynamic from "next/dynamic";
import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  linkPlugin,
  linkDialogPlugin,
  imagePlugin,
  tablePlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  toolbarPlugin,
  UndoRedo,
  BoldItalicUnderlineToggles,
  BlockTypeSelect,
  ListsToggle,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertCodeBlock,
  InsertThematicBreak,
} from "@mdxeditor/editor";

import "@mdxeditor/editor/style.css";

const MDXEditor = dynamic(
  () => import("@mdxeditor/editor").then((mod) => mod.MDXEditor),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-80 p-4 text-sm text-gray-500">
        エディタを読み込み中...
      </div>
    ),
  },
);

type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function MarkdownEditor({ value, onChange }: Props) {
  return (
    <MDXEditor
      contentEditableClassName="min-h-80 p-4 outline-none"
      markdown={value}
      onChange={onChange}
      plugins={[
        headingsPlugin(),
        listsPlugin(),
        quotePlugin(),
        thematicBreakPlugin(),

        linkPlugin(),
        linkDialogPlugin(),

        tablePlugin(),

        codeBlockPlugin({ defaultCodeBlockLanguage: "tsx" }),
        codeMirrorPlugin({
          codeBlockLanguages: {
            js: "JavaScript",
            jsx: "JavaScript JSX",
            ts: "TypeScript",
            tsx: "TypeScript JSX",
            css: "CSS",
            html: "HTML",
            json: "JSON",
            bash: "Bash",
            ruby: "Ruby",
          },
        }),

        imagePlugin({
          imageUploadHandler: async (image) => {
            const formData = new FormData();
            formData.append("image", image);

            const response = await fetch("/api/uploads", {
              method: "POST",
              body: formData,
            });

            const json = (await response.json()) as { url: string };
            return json.url;
          },
        }),

        // Active plugins are detected when this initializes, so keep it after them.
        markdownShortcutPlugin(),

        toolbarPlugin({
          toolbarContents: () => (
            <>
              <UndoRedo />
              <BlockTypeSelect />
              <BoldItalicUnderlineToggles />
              <ListsToggle />
              <CreateLink />
              <InsertImage />
              <InsertTable />
              <InsertCodeBlock />
              <InsertThematicBreak />
            </>
          ),
        }),
      ]}
    />
  );
}
