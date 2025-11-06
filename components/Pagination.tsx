import { PaginationProps } from "@/data/sessions";


export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
    return (
        <div className="flex justify-center items-center gap-2 p-4">
        <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-lg border transition-colors duration-200 ${
                currentPage === 1
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "hover:bg-gray-100 text-gray-700 border-gray-300"
                }`}
        >
            « Prev
        </button>

        <button
            key={currentPage}
            onClick={() => onPageChange(1)}
            className={`px-3 py-1 rounded-lg transition-colors duration-200 ${
            currentPage === currentPage
                ? "bg-gray-200 border border-gray-200 text-brand-primary"
                : "text-gray-700 hover:bg-gray-100"
            }`}
        >
            {currentPage}
        </button>

        <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-lg border transition-colors duration-200 ${
                currentPage === totalPages
                    ? "text-gray-400 border-gray-200 cursor-not-allowed"
                    : "hover:bg-gray-100 text-gray-700 border-gray-300"
            }`}
        >
            Next »
        </button>
        </div>
    );
}
