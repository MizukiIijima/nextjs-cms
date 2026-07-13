import { ArticleLoading } from "@/src/components/loading/ArticleLoading";
import { PublicSidebarLoading } from "@/src/components/loading/HomeLoading";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto grid w-full max-w-6xl gap-7 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:px-0">
        <ArticleLoading />
        <PublicSidebarLoading />
      </div>
    </div>
  );
}
