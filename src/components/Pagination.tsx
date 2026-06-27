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
    <nav className="mt-6 flex justify-center" aria-label="ページネーション">
      <ul
        className={
          isPublic
            ? "flex gap-2"
            : "flex gap-2 rounded-lg border border-divider bg-white p-1 shadow-sm"
        }
      >
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
                className={`flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-bold transition-colors ${
                  isActive
                    ? isPublic
                      ? "bg-slate-900 text-white shadow-sm"
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
