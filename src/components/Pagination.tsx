import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPostCount: number;
  basePath: string;
  variant?: "admin" | "public";
};

const POSTS_PER_PAGE = 10;

export default async function Pagination({
  currentPage,
  totalPostCount,
  basePath,
  variant = "admin",
}: PaginationProps) {
  const totalPages = Math.ceil(totalPostCount / POSTS_PER_PAGE);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  if (totalPages === 0) {
    return null;
  }

  const isPublic = variant === "public";

  return (
    <nav
      className={`${isPublic ? "mt-8" : "mt-6"} flex justify-center`}
      aria-label="ページネーション"
    >
      <ul className="flex gap-2">
        {pageNumbers.map((pageNumber) => {
          const isActive = pageNumber === currentPage;

          return (
            <li key={pageNumber}>
              <Link
                href={
                  pageNumber === 1
                    ? basePath
                    : {
                        pathname: basePath,
                        query: { page: pageNumber },
                      }
                }
                aria-current={isActive ? "page" : undefined}
                className={`flex items-center justify-center text-sm font-bold transition-colors ${
                  isPublic
                    ? "h-10 min-w-10 rounded-[14px] px-3"
                    : "h-9 min-w-9 rounded-md px-3"
                } ${
                  isActive
                    ? isPublic
                      ? "bg-slate-900 text-white shadow-[0_10px_24px_rgba(15,23,42,0.2)]"
                      : "bg-sidebar text-white"
                    : isPublic
                      ? "border border-slate-200 bg-white text-slate-600 hover:border-slate-400 hover:text-slate-900"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                {pageNumber}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
