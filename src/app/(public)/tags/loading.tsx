import { PublicSidebarLoading } from "@/src/components/loading/HomeLoading";
import { TagLoading } from "@/src/components/loading/TagLoading";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white text-slate-950">
      <div className="mx-auto grid w-full max-w-268 gap-7 px-5 py-8 sm:px-8 lg:grid-cols-[minmax(0,744px)_300px] lg:px-0">
        <TagLoading />
        <PublicSidebarLoading />
      </div>
    </div>

  )
}