const skeletonClass = "animate-pulse bg-slate-200 motion-reduce:animate-none";

export function ArticleLoading() {
  return (
    <main
      role="status"
      aria-label="記事を読み込んでいます"
      className="min-w-0"
    >
      <article
        aria-hidden="true"
        className="min-w-0 rounded-[18px] border border-slate-200 bg-white px-5 py-6 shadow-[0_1px_2px_rgba(15,23,42,0.03)] sm:px-8 sm:py-8"
      >
        <div className={`h-4 w-24 rounded-full ${skeletonClass}`} />

        <header className="mt-5">
          <div className="flex items-center gap-2.5">
            <div className={`h-6 w-20 rounded-full ${skeletonClass}`} />
            <div className={`h-3 w-24 rounded-full ${skeletonClass}`} />
          </div>

          <div className="mt-4 space-y-3">
            <div className={`h-9 w-11/12 rounded-lg ${skeletonClass}`} />
            <div className={`h-9 w-3/5 rounded-lg ${skeletonClass}`} />
          </div>
        </header>

        <div className={`mt-6 aspect-video w-full rounded-2xl ${skeletonClass}`} />

        <div className="mt-7 space-y-7">
          <div className="space-y-3">
            <div className={`h-3.5 w-full rounded-full ${skeletonClass}`} />
            <div className={`h-3.5 w-full rounded-full ${skeletonClass}`} />
            <div className={`h-3.5 w-5/6 rounded-full ${skeletonClass}`} />
          </div>

          <div>
            <div className="border-b border-slate-200 pb-3">
              <div className={`h-7 w-2/5 rounded-lg ${skeletonClass}`} />
            </div>
            <div className="mt-5 space-y-3">
              <div className={`h-3.5 w-full rounded-full ${skeletonClass}`} />
              <div className={`h-3.5 w-11/12 rounded-full ${skeletonClass}`} />
              <div className={`h-3.5 w-3/4 rounded-full ${skeletonClass}`} />
            </div>
          </div>

          <div className={`h-44 w-full rounded-xl ${skeletonClass}`} />

          <div className="space-y-3">
            <div className={`h-3.5 w-full rounded-full ${skeletonClass}`} />
            <div className={`h-3.5 w-4/5 rounded-full ${skeletonClass}`} />
          </div>
        </div>
      </article>

      <div aria-hidden="true" className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-[18px] border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className={`h-3 w-14 rounded-full ${skeletonClass}`} />
          <div className={`mt-2 h-4 w-4/5 rounded-full ${skeletonClass}`} />
        </div>
        <div className="rounded-[18px] border border-slate-200 bg-white px-5 py-4 shadow-[0_1px_2px_rgba(15,23,42,0.03)]">
          <div className={`ml-auto h-3 w-14 rounded-full ${skeletonClass}`} />
          <div className={`mt-2 ml-auto h-4 w-4/5 rounded-full ${skeletonClass}`} />
        </div>
      </div>
    </main>
  );
}
