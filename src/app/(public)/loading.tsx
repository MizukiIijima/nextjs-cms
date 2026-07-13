import { HomeLoading, PublicSidebarLoading } from "@/src/components/loading/HomeLoading";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto grid w-full max-w-268 gap-7 px-5 py-10 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,744px)_300px] lg:px-0">
        <main id="latest-posts" className="min-w-0">
          <header className="mb-7 flex items-end justify-between gap-4">
            <h1 className="text-[34px] font-bold leading-tight tracking-[-0.02em] text-slate-950">
              新着記事
            </h1>
          </header>

          <HomeLoading />
        </main>

        <PublicSidebarLoading />
      </div>
    </div>
  );
}
