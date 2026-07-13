const skeletonClass = "animate-pulse bg-slate-200 motion-reduce:animate-none";

export function CategoryLoading() {
  return (
    <main
      role="status"
      aria-label="カテゴリを読み込んでいます"
      className="min-w-0"
    >
      <section aria-hidden="true">
        <div className="mb-8 border-b border-slate-200 pb-8">
          <div className={`h-10 w-56 rounded-lg ${skeletonClass}`} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
            >
              <div className={`h-6 w-2/3 rounded-lg ${skeletonClass}`} />
              <div className="mt-4 space-y-3">
                <div className={`h-3.5 w-full rounded-full ${skeletonClass}`} />
                <div className={`h-3.5 w-4/5 rounded-full ${skeletonClass}`} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
