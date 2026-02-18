import { getPagination } from "@/components/_news/NewsPagination";

export default function RenderPagination({
  currPage,
  totPage,
  onChange,
}: {
  currPage: number;
  totPage: number;
  onChange: (page: number) => void;
}) {
  const pages = getPagination(currPage, totPage);

  return (
    <div className="flex items-center gap-2">
      {pages.map((page, i) =>
        page === "dots" ? (
          <span key={`dots-${i}`} className="px-2 text-gray-400 select-none">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onChange(page)}
            className={`
            px-2 py-1 rounded-md border-2 text-sm transition border-gray-300
            ${
              page === currPage
                ? "bg-primaryPink text-white"
                : "bg-white hover:bg-gray-100"
            }
          `}
          >
            {page}
          </button>
        ),
      )}
    </div>
  );
}
