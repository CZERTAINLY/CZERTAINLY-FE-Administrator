interface Props {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

function Pagination({ page, totalPages, onPageChange }: Props) {
    const getPageNumbers = () => {
        const pages: (number | 'ellipsis')[] = [];
        const maxPagesToShow = 7; // Max page buttons to show

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(1);

            let start = Math.max(2, page - 1);
            let end = Math.min(totalPages - 1, page + 1);

            if (page <= 3) {
                end = 5;
            } else if (page >= totalPages - 2) {
                start = totalPages - 4;
            }

            if (start > 2) {
                pages.push('ellipsis');
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }

            if (end < totalPages - 1) {
                pages.push('ellipsis');
            }

            pages.push(totalPages);
        }

        return pages;
    };

    const pageNumbers = getPageNumbers();

    return (
        <div className="grid justify-center sm:flex sm:justify-start sm:items-center gap-2">
            <nav className="flex items-center gap-x-1" aria-label="Pagination">
                <button
                    type="button"
                    className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex jusify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
                    aria-label="Previous"
                    onClick={() => onPageChange(page - 1)}
                    disabled={page === 1}
                >
                    <svg
                        className="shrink-0 size-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m15 18-6-6 6-6"></path>
                    </svg>
                    <span>Previous</span>
                </button>
                <div className="flex items-center gap-x-1">
                    {pageNumbers.map((pageNum, index) =>
                        pageNum === 'ellipsis' ? (
                            <div key={`ellipsis-${index}`} className="hs-tooltip inline-block">
                                <button
                                    type="button"
                                    className="min-h-9.5 min-w-9.5 flex justify-center items-center text-gray-400 p-2 text-sm rounded-lg pointer-events-none dark:text-neutral-500"
                                    disabled
                                >
                                    <span className="text-xs">•••</span>
                                </button>
                            </div>
                        ) : (
                            <button
                                key={pageNum}
                                type="button"
                                className={
                                    pageNum === page
                                        ? 'min-h-9.5 min-w-9.5 flex justify-center items-center bg-gray-200 text-gray-800 py-2 px-3 text-sm rounded-lg focus:outline-hidden focus:bg-gray-300 disabled:opacity-50 disabled:pointer-events-none dark:bg-neutral-600 dark:text-white dark:focus:bg-neutral-500'
                                        : 'min-h-9.5 min-w-9.5 flex justify-center items-center text-gray-800 hover:bg-gray-100 py-2 px-3 text-sm rounded-lg focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10'
                                }
                                onClick={() => onPageChange(pageNum)}
                                aria-current={pageNum === page ? 'page' : undefined}
                            >
                                {pageNum}
                            </button>
                        ),
                    )}
                </div>
                <button
                    type="button"
                    className="min-h-9.5 min-w-9.5 py-2 px-2.5 inline-flex jusify-center items-center gap-x-2 text-sm rounded-lg text-gray-800 hover:bg-gray-100 focus:outline-hidden focus:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none dark:text-white dark:hover:bg-white/10 dark:focus:bg-white/10"
                    aria-label="Next"
                    onClick={() => onPageChange(page + 1)}
                    disabled={page === totalPages}
                >
                    <span>Next</span>
                    <svg
                        className="shrink-0 size-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m9 18 6-6-6-6"></path>
                    </svg>
                </button>
            </nav>
        </div>
    );
}

export default Pagination;
