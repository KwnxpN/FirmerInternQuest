import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    startItem: number;
    endItem: number;
    totalItems: number;
    isLoading?: boolean;
}

function Pagination({
    page,
    totalPages,
    onPageChange,
    startItem,
    endItem,
    totalItems,
    isLoading,
}: PaginationProps) {
    return (
        <div className='bg-[#162033] text-[#92a1b6] p-4 rounded-md flex justify-between items-center'>

            <p className="text-sm text-slate-400">
                Showing <span className="font-semibold text-slate-200">{startItem}</span> to{" "}
                <span className="font-semibold text-slate-200">{endItem}</span> of{" "}
                <span className="font-semibold text-slate-200">
                    {totalItems.toLocaleString()}
                </span>{" "}
                logs
            </p>

            <div className="flex items-center gap-2">
                <Button
                    disabled={page === 1 || isLoading}
                    onClick={() => onPageChange(page - 1)}
                >
                    <ChevronLeft />
                    Prev
                </Button>

                <span>
                    Page {page} of {totalPages}
                </span>

                <Button
                    disabled={page === totalPages || isLoading}
                    onClick={() => onPageChange(page + 1)}
                >
                    Next
                    <ChevronRight />
                </Button>
            </div>
        </div>
    );
}

export default Pagination;