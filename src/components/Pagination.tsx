import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPostCount: number;
};

const POSTS_PER_PAGE = 10;

export default async function Pagination({
  currentPage,
  totalPostCount,
}: PaginationProps) {
  const totalPages = Math.ceil(totalPostCount / POSTS_PER_PAGE);
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1,
  );

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="mt-6 flex justify-center" aria-label="ページネーション">
      <ul className="flex gap-2 rounded-lg border border-divider bg-white p-1 shadow-sm">
        {pageNumbers.map((pageNumber) => {
          const isActive = pageNumber === currentPage;

          return (
            <li key={pageNumber}>
              <Link
                href={`/dashboard/posts?page=${pageNumber}`}
                aria-current={isActive ? "page" : undefined}
                className={`flex h-9 min-w-9 items-center justify-center rounded-md px-3 text-sm font-bold transition-colors ${
                  isActive
                    ? "bg-sidebar text-white"
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
