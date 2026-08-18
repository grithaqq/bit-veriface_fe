import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    hasPrev: boolean;
    hasNext: boolean;
    onPageChange: (page: number) => void;
}

/**
 * Reusable pagination component.
 * Shows at most 5 page number buttons with ellipsis for large ranges.
 */
export default function Pagination({
    currentPage,
    totalPages,
    hasPrev,
    hasNext,
    onPageChange,
}: PaginationProps) {
    if (totalPages <= 1) return null;

    // Build the list of page numbers to show (max 5 around current)
    const buildPages = (): (number | '...')[] => {
        const pages: (number | '...')[] = [];
        if (totalPages <= 7) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
            return pages;
        }
        pages.push(1);
        if (currentPage > 3) pages.push('...');
        const start = Math.max(2, currentPage - 1);
        const end = Math.min(totalPages - 1, currentPage + 1);
        for (let i = start; i <= end; i++) pages.push(i);
        if (currentPage < totalPages - 2) pages.push('...');
        pages.push(totalPages);
        return pages;
    };

    return (
        <div className="flex justify-center items-center gap-1 mt-6 flex-wrap">
            {/* Prev */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={!hasPrev}
                className="btn btn-sm btn-ghost disabled:opacity-30"
            >
                ← Prev
            </button>

            {/* Page numbers */}
            {buildPages().map((page, idx) =>
                page === '...' ? (
                    <span key={`ellipsis-${idx}`} className="px-2 text-base-content/40 select-none">
                        …
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page as number)}
                        className={`btn btn-sm ${currentPage === page ? 'btn-primary' : 'btn-ghost'}`}
                    >
                        {page}
                    </button>
                )
            )}

            {/* Next */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={!hasNext}
                className="btn btn-sm btn-ghost disabled:opacity-30"
            >
                Next →
            </button>
        </div>
    );
}
