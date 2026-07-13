const skeletonClass = "animate-pulse bg-slate-200 motion-reduce:animate-none";

export function HomeLoading() {
  return (
    <div
      role="status"
      aria-label="記事を読み込んでいます"
      className="space-y-4"
    >
      {[0, 1, 2].map((item) => (
        <div
          key={item}
          aria-hidden="true"
          className="grid gap-6 rounded-[22px] border border-slate-200/90 bg-white p-6 shadow-[0_14px_35px_rgba(15,23,42,0.055)] sm:grid-cols-[250px_minmax(0,1fr)]"
        >
          <div
            className={`aspect-8/5 w-full rounded-[18px] ${skeletonClass}`}
          />
          <div className="flex min-w-0 flex-col justify-center">
            <div className={`h-3 w-20 rounded-full ${skeletonClass}`} />
            <div className={`mt-4 h-5 w-4/5 rounded-full ${skeletonClass}`} />
            <div className="mt-4 space-y-2.5">
              <div className={`h-3 w-full rounded-full ${skeletonClass}`} />
              <div className={`h-3 w-11/12 rounded-full ${skeletonClass}`} />
              <div className={`h-3 w-2/3 rounded-full ${skeletonClass}`} />
            </div>
            <div className="mt-4 flex gap-2">
              <div className={`h-6 w-16 rounded-full ${skeletonClass}`} />
              <div className={`h-6 w-20 rounded-full ${skeletonClass}`} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function PublicSidebarLoading() {
  const sectionClass = "rounded-[22px] border border-slate-200/90 bg-white p-[22px] shadow-[0_14px_35px_rgba(15,23,42,0.05)]";

  return (
    <aside
      role="status"
      aria-label="サイドバーを読み込んでいます"
      className="space-y-4 lg:sticky lg:top-6 lg:self-start"
    >
      <section aria-hidden="true" className={sectionClass}>
        <div className="flex items-center gap-4">
          <div className={`size-14 rounded-[18px] ${skeletonClass}`} />
          <div className={`h-5 w-28 rounded-full ${skeletonClass}`} />
        </div>
        <div className="mt-5 space-y-2.5">
          <div className={`h-3 w-full rounded-full ${skeletonClass}`} />
          <div className={`h-3 w-5/6 rounded-full ${skeletonClass}`} />
          <div className={`h-3 w-2/3 rounded-full ${skeletonClass}`} />
        </div>
      </section>

      <section aria-hidden="true" className={sectionClass}>
        <div className="flex items-center justify-between gap-4">
          <div className={`h-5 w-20 rounded-full ${skeletonClass}`} />
          <div className={`h-3 w-8 rounded-full ${skeletonClass}`} />
        </div>
        <div className="mt-5 space-y-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="flex items-center justify-between gap-4">
              <div className={`h-3 w-28 rounded-full ${skeletonClass}`} />
              <div className={`h-6 w-7 rounded-full ${skeletonClass}`} />
            </div>
          ))}
        </div>
      </section>

      <section aria-hidden="true" className={sectionClass}>
        <div className="flex items-center justify-between gap-4">
          <div className={`h-5 w-12 rounded-full ${skeletonClass}`} />
          <div className={`h-3 w-8 rounded-full ${skeletonClass}`} />
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          {["w-16", "w-20", "w-14", "w-24", "w-16"].map((width, item) => (
            <div
              key={`${width}-${item}`}
              className={`h-7 rounded-full ${width} ${skeletonClass}`}
            />
          ))}
        </div>
      </section>
    </aside>
  );
}
