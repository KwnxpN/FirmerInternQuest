import { useFetchLogs } from '@/api.ts'
import { formatDateToDisplay, formatUserFullName } from "@/utils/formats.ts";
import { getStatusCodeColor, getActionColor, getMethodColor, getMethodTextColor } from '@/utils/colors';

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
        <div className='rounded-xl border overflow-hidden'>
            <Table>
                <TableHeader className='bg-[#162033]'>
                    <TableRow className='pointer-events-none'>
                        <TableHead className='text-[#92a1b6]'>User</TableHead>
                        <TableHead className='text-[#92a1b6]'>Endpoint</TableHead>
                        <TableHead className='text-[#92a1b6]'>Method</TableHead>
                        <TableHead className='text-[#92a1b6]'>Timestamp</TableHead>
                        <TableHead className='text-[#92a1b6]'>Labnumber</TableHead>
                        <TableHead className='text-[#92a1b6]'>Action</TableHead>
                        <TableHead className='text-[#92a1b6]'>Status</TableHead>
                        <TableHead className='text-[#92a1b6]'>Message</TableHead>
                        <TableHead className='text-[#92a1b6]'>Time Response</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs && logs.data && logs.data.map((log) => (
                        <TableRow key={log._id}>
                            <TableCell className="font-medium text-[#d8dadd]">{formatUserFullName(log.user?.prefix || "", log.user?.firstname || "", log.user?.lastname || "")}</TableCell>
                            <TableCell className='text-[#637289]'>{log.request.endpoint}</TableCell>
                            <TableCell>
                                <div className={`${getMethodColor(log.request.method)}` + ' px-2 py-0.5 rounded-sm w-fit'}>
                                    <span className={`${getMethodTextColor(log.request.method)}` + ' font-medium text-xs'}>{log.request.method}</span>
                                </div>
                            </TableCell>
                            <TableCell>{formatDateToDisplay(log.timestamp)}</TableCell>
                            <TableCell>{log.labnumber.join(", ")}</TableCell>
                            <TableCell className={getActionColor(log.action)}>{log.action}</TableCell>
                            <TableCell className={getStatusCodeColor(log.response.statusCode)}>{log.response.statusCode}</TableCell>
                            <TableCell>{log.response.message}</TableCell>
                            <TableCell>{log.response.timeMs}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default LogsTable