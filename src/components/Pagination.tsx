import Link from "next/link";

type PaginationProps = {
  currentPage: number;
  totalPostCount: number;
};

export default async function Pagination({ currentPage, totalPostCount }: PaginationProps) {
  const POSTS_PER_PAGE = 1;
  const totalPages = Math.ceil(totalPostCount / POSTS_PER_PAGE);
  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1);

  return (
    <>
      <ul className="flex gap-4 max-w-80 mt-8 m-auto">
        {pageNumbers.map((pageNumber) => {
          const isActive = pageNumber === Number(currentPage);

          return (
            <li key={pageNumber}>
              <Link
                href={`/dashboard/posts/?page=${pageNumber}`}
                className={`w-9 h-9 flex items-center justify-center rounded-xl ${
                  isActive ? "bg-sidebar text-white" : "bg-white text-black"
                }`}
              >
                {pageNumber}
              </Link>
            </li>
          );
        })}
      </ul>
    </>
  )
}