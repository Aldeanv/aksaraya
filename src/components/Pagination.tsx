import { PaginationProps } from "../types";

export default function Pagination({
  page,
  totalPage,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`px-3 py-1 text-sm rounded-md ${
          page === 1
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        Sebelumnya
      </button>

      <span className="text-sm text-gray-600">
        Halaman <strong>{page}</strong> dari <strong>{totalPage}</strong>
      </span>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPage}
        className={`px-3 py-1 text-sm rounded-md ${
          page === totalPage
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
        }`}
      >
        Selanjutnya
      </button>
    </div>
  );
}
