import type { ReactNode } from "react";

const skeletonClass =
  "animate-pulse bg-slate-200 motion-reduce:animate-none";

function Skeleton({ className }: { className: string }) {
  return <div className={[skeletonClass, className].join(" ")} />;
}

function AdminLoadingFrame({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <main role="status" aria-label={label} className="grow p-6">
      <div aria-hidden="true">{children}</div>
    </main>
  );
}

function PageHeadingSkeleton({ description = false }: { description?: boolean }) {
  return (
    <>
      <Skeleton className="mt-6 h-4 w-44 rounded-full" />
      <Skeleton className="mt-3 h-9 w-48 rounded-lg" />
      {description && (
        <Skeleton className="mt-3 h-4 w-80 max-w-full rounded-full" />
      )}
    </>
  );
}

function FieldSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-20 rounded-full" />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  );
}

export function AdminPostListLoading() {
  return (
    <AdminLoadingFrame label="記事一覧を読み込み中">
      <Skeleton className="mt-6 h-4 w-44 rounded-full" />

      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <Skeleton className="h-9 w-40 rounded-lg" />
          <Skeleton className="mt-3 h-4 w-52 rounded-full" />
        </div>
        <Skeleton className="h-10 w-24 rounded-md" />
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 rounded-lg border border-divider bg-white p-1 shadow-sm">
          <Skeleton className="h-8 w-14 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
          <Skeleton className="h-8 w-14 rounded-md" />
          <Skeleton className="h-8 w-16 rounded-md" />
        </div>
        <Skeleton className="h-10 w-80 max-w-full rounded-md" />
      </div>

      <div className="mt-6 overflow-hidden rounded-lg border border-divider bg-white shadow-sm">
        <div className="grid grid-cols-[34%_12%_18%_18%_9%_9%] bg-slate-50">
          <div className="px-4 py-3">
            <Skeleton className="h-3 w-12 rounded-full" />
          </div>
          <div className="px-4 py-3">
            <Skeleton className="h-3 w-14 rounded-full" />
          </div>
          <div className="px-4 py-3">
            <Skeleton className="h-3 w-20 rounded-full" />
          </div>
          <div className="px-4 py-3">
            <Skeleton className="h-3 w-10 rounded-full" />
          </div>
          <div className="px-4 py-3">
            <Skeleton className="h-3 w-10 rounded-full" />
          </div>
          <div className="px-4 py-3">
            <Skeleton className="h-3 w-10 rounded-full" />
          </div>
        </div>

        {Array.from({ length: 10 }, (_, index) => (
          <div
            key={index}
            className="grid grid-cols-[34%_12%_18%_18%_9%_9%] border-t border-slate-100"
          >
            <div className="px-4 py-5">
              <Skeleton
                className={
                  index % 3 === 0
                    ? "h-4 w-4/5 rounded-full"
                    : "h-4 w-2/3 rounded-full"
                }
              />
            </div>
            <div className="px-4 py-4">
              <Skeleton className="h-6 w-16 rounded-full" />
            </div>
            <div className="px-4 py-5">
              <Skeleton className="h-4 w-3/4 rounded-full" />
            </div>
            <div className="px-4 py-5">
              <Skeleton className="h-4 w-2/3 rounded-full" />
            </div>
            <div className="px-4 py-5">
              <Skeleton className="h-4 w-14 rounded-full" />
            </div>
            <div className="px-4 py-5">
              <Skeleton className="h-4 w-14 rounded-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-2">
        <Skeleton className="size-9 rounded-md" />
        <Skeleton className="size-9 rounded-md" />
        <Skeleton className="size-9 rounded-md" />
      </div>
    </AdminLoadingFrame>
  );
}

export function AdminPostFormLoading() {
  return (
    <AdminLoadingFrame label="記事フォームを読み込み中">
      <PageHeadingSkeleton />

      <div className="mt-6 grid w-full grow gap-6 xl:grid-cols-[minmax(0,1200px)_minmax(480px,560px)]">
        <div className="space-y-5">
          <FieldSkeleton />
          <FieldSkeleton />

          <div className="space-y-2">
            <Skeleton className="h-4 w-12 rounded-full" />
            <div className="overflow-hidden rounded-lg border border-divider bg-white">
              <div className="flex h-12 items-center gap-2 border-b border-divider px-3">
                <Skeleton className="h-7 w-16 rounded-md" />
                <Skeleton className="h-7 w-10 rounded-md" />
                <Skeleton className="h-7 w-10 rounded-md" />
                <Skeleton className="h-7 w-10 rounded-md" />
                <Skeleton className="h-7 w-16 rounded-md" />
              </div>
              <div className="min-h-80 space-y-4 p-4">
                <Skeleton className="h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-11/12 rounded-full" />
                <Skeleton className="h-4 w-4/5 rounded-full" />
                <Skeleton className="mt-7 h-4 w-full rounded-full" />
                <Skeleton className="h-4 w-3/4 rounded-full" />
              </div>
            </div>
          </div>

          <Skeleton className="mx-auto h-10 w-80 max-w-full rounded-md" />
        </div>

        <aside className="space-y-4">
          <div className="rounded-lg border border-divider bg-white p-4 shadow-sm">
            <Skeleton className="h-5 w-20 rounded-full" />
            <div className="mt-4 space-y-4">
              {Array.from({ length: 3 }, (_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-4"
                >
                  <Skeleton className="h-4 w-14 rounded-full" />
                  <Skeleton
                    className={
                      index === 0
                        ? "h-6 w-20 rounded-full"
                        : "h-4 w-16 rounded-full"
                    }
                  />
                </div>
              ))}
            </div>
            <div className="mt-5 flex gap-2">
              <Skeleton className="h-9 w-24 rounded-full" />
              <Skeleton className="h-9 w-24 rounded-full" />
            </div>
          </div>

          <div className="rounded-lg border border-divider bg-white p-4 shadow-sm">
            <Skeleton className="h-5 w-16 rounded-full" />
            <div className="mt-3 space-y-2">
              {Array.from({ length: 4 }, (_, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-md border border-divider px-3 py-2"
                >
                  <Skeleton className="size-4 rounded" />
                  <Skeleton
                    className={
                      index % 2 === 0
                        ? "h-4 w-28 rounded-full"
                        : "h-4 w-20 rounded-full"
                    }
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-divider bg-white p-4 shadow-sm">
            <Skeleton className="h-5 w-10 rounded-full" />
            <div className="mt-3 flex flex-wrap gap-2">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-20 rounded-full" />
            </div>
          </div>

          <div className="rounded-lg border border-divider bg-white p-4 shadow-sm">
            <Skeleton className="h-5 w-28 rounded-full" />
            <Skeleton className="mt-3 aspect-video w-full rounded-md" />
          </div>
        </aside>
      </div>
    </AdminLoadingFrame>
  );
}

export function AdminCategoryLoading() {
  return (
    <AdminLoadingFrame label="カテゴリー管理を読み込み中">
      <PageHeadingSkeleton />

      <div className="mt-8 flex items-start justify-between gap-10">
        <div className="w-80 shrink-0">
          <Skeleton className="h-5 w-36 rounded-full" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-3.5 w-full rounded-full" />
            <Skeleton className="h-3.5 w-4/5 rounded-full" />
          </div>
          <div className="mt-4 space-y-4">
            <FieldSkeleton />
            <FieldSkeleton />
            <FieldSkeleton />
          </div>
          <Skeleton className="mt-8 h-10 w-full rounded-md" />
        </div>

        <div className="min-w-0 grow">
          <Skeleton className="h-5 w-44 rounded-full" />
          <div className="mt-4 overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="grid grid-cols-[15%_15%_42%_10%_18%] bg-slate-50">
              {Array.from({ length: 5 }, (_, index) => (
                <div key={index} className="px-4 py-3">
                  <Skeleton className="h-3 w-14 rounded-full" />
                </div>
              ))}
            </div>
            {Array.from({ length: 7 }, (_, index) => (
              <div
                key={index}
                className="grid grid-cols-[15%_15%_42%_10%_18%] border-t border-slate-200 odd:bg-white even:bg-slate-50"
              >
                <div className="px-4 py-5">
                  <Skeleton className="h-4 w-4/5 rounded-full" />
                </div>
                <div className="px-4 py-5">
                  <Skeleton className="h-4 w-3/4 rounded-full" />
                </div>
                <div className="px-4 py-5">
                  <Skeleton
                    className={
                      index % 2 === 0
                        ? "h-4 w-5/6 rounded-full"
                        : "h-4 w-2/3 rounded-full"
                    }
                  />
                </div>
                <div className="px-4 py-5">
                  <Skeleton className="h-4 w-8 rounded-full" />
                </div>
                <div className="flex gap-2 px-4 py-4">
                  <Skeleton className="h-8 w-16 rounded-md" />
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLoadingFrame>
  );
}

export function AdminTagLoading() {
  return (
    <AdminLoadingFrame label="タグ管理を読み込み中">
      <PageHeadingSkeleton />

      <div className="mt-8 flex items-start justify-between gap-10">
        <div className="w-80 shrink-0">
          <Skeleton className="h-5 w-28 rounded-full" />
          <div className="mt-3 space-y-2">
            <Skeleton className="h-3.5 w-full rounded-full" />
            <Skeleton className="h-3.5 w-4/5 rounded-full" />
          </div>
          <div className="mt-4 space-y-4">
            <FieldSkeleton />
            <FieldSkeleton />
          </div>
          <Skeleton className="mt-8 h-10 w-full rounded-md" />
        </div>

        <div className="min-w-0 grow">
          <Skeleton className="h-5 w-36 rounded-full" />
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => (
              <div
                key={index}
                className="flex min-h-36 flex-col justify-between rounded-lg border border-divider bg-white p-4 shadow-sm"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <Skeleton
                      className={
                        index % 2 === 0
                          ? "h-4 w-32 rounded-full"
                          : "h-4 w-24 rounded-full"
                      }
                    />
                    <Skeleton className="h-6 w-14 rounded-full" />
                  </div>
                  <Skeleton className="mt-3 h-4 w-28 rounded-full" />
                </div>
                <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                  <Skeleton className="h-9 flex-1 rounded-md" />
                  <Skeleton className="h-9 flex-1 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLoadingFrame>
  );
}

export function AdminProfileLoading() {
  return (
    <AdminLoadingFrame label="プロフィールを読み込み中">
      <PageHeadingSkeleton description />

      <div className="mt-6 w-full space-y-6 rounded-lg border border-divider bg-white p-6 shadow-sm">
        <div className="space-y-3">
          <Skeleton className="h-4 w-28 rounded-full" />
          <div className="flex items-center gap-4 rounded-md border border-divider p-4">
            <Skeleton className="size-20 shrink-0 rounded-full" />
            <div className="min-w-0 grow space-y-2">
              <Skeleton className="h-4 w-44 max-w-full rounded-full" />
              <Skeleton className="h-3 w-64 max-w-full rounded-full" />
            </div>
          </div>
        </div>

        <FieldSkeleton />

        <div className="space-y-2">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-32 w-full rounded-md" />
        </div>

        <div className="flex justify-end">
          <Skeleton className="h-10 w-32 rounded-md" />
        </div>
      </div>
    </AdminLoadingFrame>
  );
}
