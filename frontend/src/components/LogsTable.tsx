import {
    formatDateToDisplay,
    formatUserFullName
} from "@/utils/formats.ts";
import {
    getStatusCodeColor,
    getActionColor,
    getMethodColor,
    getMethodTextColor,
    getActionTextColor,
    getStatusCodeTextColor
} from '@/utils/colors';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import type { LogResponse } from '@/types/log.type';
import { LoaderCircle, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

interface LogsTableProps {
    logs: LogResponse | null;
    isLoading: boolean;
    isEmpty?: boolean;
    sortBy?: 'timestamp' | 'action' | 'timeMs' | '';
    sortOrder?: 'asc' | 'desc';
    onSortChange?: (sortBy: 'timestamp' | 'action' | 'timeMs' | '', sortOrder: 'asc' | 'desc') => void;
}

function LogsTable({ logs, isLoading, isEmpty, sortBy, sortOrder, onSortChange }: LogsTableProps) {

    const handleSortClick = (column: 'timestamp' | 'action' | 'timeMs' | '') => {
        // If no sort is active or we click a different column: start ASC
        if (sortBy !== column) {
            onSortChange?.(column, 'asc');
            return;
        }

        // Cycle logic for the currently active column
        if (sortOrder === 'asc') {
            onSortChange?.(column, 'desc');
        } else {
            // Reached 'desc', so reset to none
            onSortChange?.('', 'asc');
        }
    };

    // Helper to render the correct icon based on state
    const getSortIcon = (column: string) => {
        if (sortBy !== column) return <ArrowUpDown className="w-4 h-4 text-slate-500" />;
        return sortOrder === 'asc'
            ? <ArrowUp className="w-4 h-4 text-blue-400" />
            : <ArrowDown className="w-4 h-4 text-blue-400" />;
    };

    return (
        <div className='rounded-xl border border-[#1e293b] overflow-hidden  relative'>
            <div className="overflow-y-auto h-[59vh]">
                <Table className='border-separate border-spacing-0'>
                    <TableHeader className='h-16'>
                        <TableRow>
                            <TableHead className='sticky top-0 z-20 bg-[#162033] text-[#92a1b6] font-bold pl-4'>User</TableHead>
                            <TableHead className='sticky top-0 z-20 bg-[#162033] text-[#92a1b6] font-bold'>Endpoint</TableHead>
                            <TableHead className='sticky top-0 z-20 bg-[#162033] text-[#92a1b6] font-bold'>Method</TableHead>
                            <TableHead className='sticky top-0 z-20 bg-[#162033] text-[#92a1b6] font-bold'>
                                <div className="flex items-center">
                                    Timestamp
                                    <button className="z-40 inline-block ml-1" onClick={() => handleSortClick('timestamp')}>
                                        {getSortIcon('timestamp')}
                                    </button>
                                </div>
                            </TableHead>
                            <TableHead className='sticky top-0 z-20 bg-[#162033] text-[#92a1b6] font-bold'>Labnumber</TableHead>
                            <TableHead className='sticky top-0 z-20 bg-[#162033] text-[#92a1b6] font-bold'>
                                <div className="flex items-center">
                                    Action
                                    <button className="z-40 inline-block ml-1" onClick={() => handleSortClick('action')}>
                                        {getSortIcon('action')}
                                    </button>
                                </div>
                            </TableHead>
                            <TableHead className='sticky top-0 z-20 bg-[#162033] text-[#92a1b6] font-bold'>Status</TableHead>
                            <TableHead className='sticky top-0 z-20 bg-[#162033] text-[#92a1b6] font-bold'>Message</TableHead>
                            <TableHead className='sticky top-0 z-20 bg-[#162033] text-[#92a1b6] font-bold'>
                                <div className="flex items-center">
                                    Time Response
                                    <button className="z-40 inline-block ml-1" onClick={() => handleSortClick('timeMs')}>
                                        {getSortIcon('timeMs')}
                                    </button>
                                </div>
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading && (
                            <TableRow className="pointer-events-none bg-[#0f172a]">
                                <TableCell colSpan={9} className='h-[52vh] text-center text-[#637289]'>
                                    <div className="flex justify-center mt-4">
                                        <span>Please wait, we are getting logs data for you</span>
                                        <LoaderCircle className="animate-spin text-[#637289] ml-2" />
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}

                        {isEmpty && (
                            <TableRow className="pointer-events-none bg-[#0f172a]">
                                <TableCell colSpan={9} className='h-[52vh] text-center text-[#637289]'>
                                    <div className="flex justify-center mt-4">
                                        <span>Not found any logs, try change your filters.</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}

                        {!isLoading && logs && logs.data && logs.data.map((log) => (
                            <TableRow key={log._id} className='h-16 hover:bg-[#1b2738] bg-[#0f172a]'>
                                <TableCell className="text-xs font-medium text-[#d8dadd] pl-4">
                                    {formatUserFullName(log.user?.prefix || "", log.user?.firstname || "", log.user?.lastname || "")}
                                </TableCell>
                                <TableCell className='text-[#637289]'>{log.request.endpoint}</TableCell>
                                <TableCell>
                                    <div className={`${getMethodColor(log.request.method)}` +
                                        ' px-2 py-0.5 rounded-sm w-fit'}>
                                        <span className={`${getMethodTextColor(log.request.method)}` + ' font-medium text-xs'}>
                                            {log.request.method}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className='text-[#637289] whitespace-break-spaces'>{formatDateToDisplay(log.timestamp)}</TableCell>
                                <TableCell className="text-[#137fec] whitespace-normal">
                                    <div className="columns-3 gap-2 text-xs">
                                        {log.labnumber.join(", ")}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className={`${getActionColor(log.action)}` + ' px-2 py-0.5 rounded-sm w-fit'}>
                                        <span className={`${getActionTextColor(log.action)}` + ' font-medium text-xs'}>
                                            {log.action}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className={`${getStatusCodeColor(log.response.statusCode)}` +
                                        ' px-2 py-0.5 rounded-sm w-fit'}>
                                        <span className={`${getStatusCodeTextColor(log.response.statusCode)}` + ' font-medium text-xs'}>
                                            {log.response.statusCode}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className='text-[#94a3b8]'>{log.response.message}</TableCell>
                                <TableCell className='text-[#637289] text-center'>{log.response.timeMs}ms</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default LogsTable