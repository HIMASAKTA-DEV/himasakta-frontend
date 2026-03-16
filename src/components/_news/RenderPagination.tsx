import { getPagination } from "@/components/_news/NewsPagination";
import clsxm from "@/lib/clsxm";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

export default function RenderPagination({
  currPage,
  totPage,
  onChange,
  styling,
}: {
  currPage: number;
  totPage: number;
  onChange: (page: number) => void;
  styling?: string;
}) {
  const pages = getPagination(currPage, totPage);

  return (
    <div className={clsxm("flex items-center gap-2", styling)}>
      <button
        type="button"
        disabled={currPage <= 1}
        onClick={() => onChange(currPage - 1)}
        className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-gray-300 bg-white text-gray-500 transition hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaChevronLeft size={12} />
      </button>

      {pages.map((page, i) =>
        page === "dots" ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400 select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            type="button"
            onClick={() => onChange(page)}
            className={`
            min-w-[32px] h-8 px-2 py-1 rounded-md border-2 text-sm transition border-gray-300
            ${
              page === currPage
                ? "bg-primaryPink text-white border-primaryPink"
                : "bg-white hover:bg-gray-100"
            }
          `}
          >
            {page}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={currPage >= totPage}
        onClick={() => onChange(currPage + 1)}
        className="flex h-8 w-8 items-center justify-center rounded-md border-2 border-gray-300 bg-white text-gray-500 transition hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaChevronRight size={12} />
      </button>
    </div>
  );
}
