interface PaginationProps {
   currentPage: number;
   totalPages: number;
   onPageChange: (page: number) => void;
   isLoading?: boolean;
   className?: string;
}

export default function Pagination({
   currentPage,
   totalPages,
   onPageChange,
   isLoading = false,
   className = "",
}: PaginationProps) {
   if (totalPages <= 1) return null;

   return (
      <div className={`flex items-center justify-center gap-2 ${className}`}>
         {/* previous button */}
         <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1 || isLoading}
            className="px-3 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
         >
            Previous
         </button>
         {/* page numbers */}
         <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
               <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  disabled={isLoading}
                  className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                     page === currentPage
                        ? "bg-blue-600 text-white"
                        : "text-nuetral-600 bg-white border border-neutral-300 hover:bg-neutral-50"
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
               >
                  {page}
               </button>
            ))}
         </div>
         {/* next button */}
         <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages || isLoading}
            className="px-3 py-2 text-sm font-medium text-neutral-600 bg-white border border-neutral-300 rounded-lg hover:bg-neutral-50 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
         >
            Next
         </button>
      </div>
   );
}
