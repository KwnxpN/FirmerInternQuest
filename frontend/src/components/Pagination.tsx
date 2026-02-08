import { Button } from './ui/button';
import { Input } from './ui/input';
import { ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import { useDebouncedInput } from '@/lib/utils';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onLimitChange: (newLimit: string) => void;
    limit?: string;
    startItem: number;
    endItem: number;
    totalItems: number;
    isLoading?: boolean;
    isEmpty?: boolean;
}

function Pagination({
    page,
    totalPages,
    onPageChange,
    onLimitChange,
    limit,
    startItem,
    endItem,
    totalItems,
    isLoading,
    isEmpty
}: PaginationProps) {

    const {
        value: searchLimit,
        handleChange: handleLimitChange,
    } = useDebouncedInput({
        initialValue: limit || String(endItem - startItem + 1),
        onChange: onLimitChange,
    });

    return (
        <div className='border border-[#1e293b] bg-[#162033] text-[#92a1b6] p-4 rounded-md flex justify-between items-center'>

            <p className="text-sm text-slate-400">
                Showing <span className="font-semibold text-slate-200">{startItem}</span> to{" "}
                <span className="font-semibold text-slate-200">{endItem}</span> of{" "}
                <span className="font-semibold text-slate-200">
                    {totalItems.toLocaleString()}
                </span>{" "}
                logs
            </p>

            <div className="flex items-center gap-2">
                <label htmlFor="limit">Rows per page</label>
                <Input id="limit" type="number" className='w-24' disabled={isLoading} value={searchLimit} onChange={handleLimitChange} />

                <Button
                    variant="secondary"
                    disabled={page === 1 || isLoading || isEmpty}
                    onClick={() => onPageChange(1)}
                >
                    <ChevronsLeft />
                    First
                </Button>

                <Button
                    disabled={page === 1 || isLoading || isEmpty}
                    onClick={() => onPageChange(page - 1)}
                >
                    <ChevronLeft />
                    Prev
                </Button>

                <span>
                    Page {page} of {totalPages}
                </span>

                <Button
                    disabled={page === totalPages || isLoading || isEmpty}
                    onClick={() => onPageChange(page + 1)}
                >
                    Next
                    <ChevronRight />
                </Button>

                <Button
                    variant="secondary"
                    disabled={page === totalPages || isLoading || isEmpty}
                    onClick={() => onPageChange(totalPages)}
                >
                    Last
                    <ChevronsRight />
                </Button>
            </div>
        </div>
    );
}

export default Pagination;