import { useMemo, useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ChevronLeft, ChevronsLeft, ChevronRight, ChevronsRight } from 'lucide-react';
import debounce from 'lodash.debounce';

interface PaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    onLimitChange: (newLimit: number) => void;
    limit?: number;
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
    startItem,
    endItem,
    totalItems,
    isLoading,
    isEmpty
}: PaginationProps) {
    const [searchLimit, setSearchLimit] = useState(endItem - startItem + 1);

    const debouncedOnLimitChange = useMemo(
        () =>
            debounce((value: number) => {
                onLimitChange(value);
            }, 700),
        [onLimitChange]
    );

    useEffect(() => {
        return () => {
            debouncedOnLimitChange.cancel();
        };
    }, [debouncedOnLimitChange]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);
        setSearchLimit(value);

        if (!isNaN(value) && value > 0) {
            debouncedOnLimitChange(value);
        }

        else {
            debouncedOnLimitChange(50); // Default to 50 if invalid
        }
    };

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
                <label htmlFor="limit">Rows per page</label>
                <Input id="limit" type="number" className='w-24' disabled={isLoading} value={searchLimit} onChange={handleChange} />

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