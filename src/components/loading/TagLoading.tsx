const skeletonClass = "animate-pulse bg-slate-200 motion-reduce:animate-none";

export function TagLoading() {
  return (
    <main
      role="status"
      aria-label="タグを読み込んでいます"
      className="min-w-0"
    >
      <section aria-hidden="true">
        <div className="mb-8 border-b border-slate-200 pb-8">
          <div className={`h-10 w-48 rounded-lg ${skeletonClass}`} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 6 }, (_, index) => (
            <div
              key={index}
              className="rounded-[18px] border border-slate-200 bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.03)]"
            >
              <div className="flex items-center gap-2">
                <div className={`h-6 w-5 rounded-lg ${skeletonClass}`} />
                <div className={`h-6 w-1/2 rounded-lg ${skeletonClass}`} />
              </div>
              <div className={`mt-4 h-3.5 w-20 rounded-full ${skeletonClass}`} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
