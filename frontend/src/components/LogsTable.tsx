import { useFetchLogs } from '@/api.ts'
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

function LogsTable() {
    const { logs, isLoading, isError, setQueryParams } = useFetchLogs();


    return (
        <div className='rounded-xl border overflow-hidden  relative'>
            <div className="overflow-y-auto max-h-[70vh]">
                <Table className='border-separate border-spacing-0'>
                    <TableHeader className='h-16'>
                        <TableRow className='pointer-events-none'>
                            <TableHead className='sticky top-0 z-20 bg-[#162033] text-[#92a1b6] font-bold pl-4'>User</TableHead>
                            <TableHead className='sticky top-0 z-20 bg-[#162033] text-[#92a1b6] font-bold'>Endpoint</TableHead>
                            <TableHead className='sticky top-0 z-20 bg-[#162033] text-[#92a1b6] font-bold'>Method</TableHead>
                            <TableHead className='sticky top-0 z-20 bg-[#162033] text-[#92a1b6] font-bold'>Timestamp</TableHead>
                            <TableHead className='sticky top-0 z-20 bg-[#162033] text-[#92a1b6] font-bold'>Labnumber</TableHead>
                            <TableHead className='sticky top-0 z-20 bg-[#162033] text-[#92a1b6] font-bold'>Action</TableHead>
                            <TableHead className='sticky top-0 z-20 bg-[#162033] text-[#92a1b6] font-bold'>Status</TableHead>
                            <TableHead className='sticky top-0 z-20 bg-[#162033] text-[#92a1b6] font-bold'>Message</TableHead>
                            <TableHead className='sticky top-0 z-20 bg-[#162033] text-[#92a1b6] font-bold'>Time Response</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs && logs.data && logs.data.map((log) => (
                            <TableRow key={log._id} className='h-16'>
                                <TableCell className="font-medium text-[#d8dadd] pl-4">
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
                                    <div className="columns-4 gap-4">
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