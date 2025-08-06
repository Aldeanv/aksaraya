import { PaginationProps } from "../types";

export default function Pagination({
  page,
  totalPage,
  onPageChange,
}: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-4 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center ${
          page === 1
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-orange-200"
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Sebelumnya
      </button>

      <div className="flex items-center gap-2 mx-2">
        {Array.from({ length: totalPage }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            onClick={() => onPageChange(num)}
            className={`w-8 h-8 flex items-center justify-center text-sm font-medium rounded-full transition-colors ${
              page === num
                ? "bg-orange-500 text-white shadow-md"
                : "text-gray-600 hover:bg-orange-100"
            }`}
          >
            {num}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPage}
        className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 flex items-center ${
          page === totalPage
            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
            : "bg-orange-500 text-white hover:bg-orange-600 shadow-md hover:shadow-orange-200"
        }`}
      >
        Selanjutnya
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}