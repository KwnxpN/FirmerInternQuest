import { useFetchLogs } from '@/api.ts'

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
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Endpoint</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>Labnumber</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Message</TableHead>
                    <TableHead>Time Response</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {logs && logs.data && logs.data.map((log) => (
                    <TableRow key={log._id}>
                        <TableCell className="font-medium">{log.user?.firstname}</TableCell>
                        <TableCell>{log.request.endpoint}</TableCell>
                        <TableCell>{log.request.method}</TableCell>
                        <TableCell className="text-right">{log.timestamp}</TableCell>
                        <TableCell className="text-right">{log.labnumber.join(", ")}</TableCell>
                        <TableCell className="text-right">{log.action}</TableCell>
                        <TableCell className="text-right">{log.response.statusCode}</TableCell>
                        <TableCell className="text-right">{log.response.message}</TableCell>
                        <TableCell className="text-right">{log.response.timeMs}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default LogsTable