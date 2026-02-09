import { useState } from 'react';
import { useFetchUsers, exportLogsData } from '@/api';
import { ACTION_ORDER } from '@/constants/actions';
import { formatUserFullName } from '@/utils/formats';
import { useAuth } from "@/hooks/useAuth"
import * as XLSX from 'xlsx';

import DateRangePicker from './filters/DateRangePicker'
import MultiSelect from './filters/MultiSelect';
import type { User } from '@/types/user.type';
import type { LogQueryParams } from "@/types/log.type.ts";

import { Input } from './ui/input';
import { Button } from './ui/button';
import { toast } from "sonner"
import { useDebouncedInput } from '@/lib/utils';
import { parseDateFromApi } from '@/utils/date';

interface FiltersPanelProps {
    logsQueryParams: LogQueryParams;
    onDateChange: (start: Date | null, end: Date | null) => void;
    onActionChange: (actions: string[]) => void;
    onUserChange: (users: string[]) => void;
    onStatusCodeChange: (statusCode: string) => void;
    onLabNumberChange: (labNumber: string) => void;
    onMinResponseTimeChange: (minResponseTime: string) => void;
    onMaxResponseTimeChange: (maxResponseTime: string) => void;
    clearFilters: () => void;
}

function FiltersPanel({
    logsQueryParams,
    onDateChange,
    onActionChange,
    onUserChange,
    onStatusCodeChange,
    onLabNumberChange,
    onMinResponseTimeChange,
    onMaxResponseTimeChange,
    clearFilters
}: FiltersPanelProps) {

    const [selectedActions, setSelectedActions] = useState<string[]>(logsQueryParams.action || []);
    const [selectedUsers, setSelectedUsers] = useState<string[]>(logsQueryParams.userId || []);
    const { users, isLoading: isLoadingUsers, isError: isErrorUsers } = useFetchUsers();
    const { user: currentUser } = useAuth();
    const parsedStartDate = logsQueryParams.startDate ? parseDateFromApi(logsQueryParams.startDate) : null;
    const parsedEndDate = logsQueryParams.endDate ? parseDateFromApi(logsQueryParams.endDate) : null;

    const {
        value: searchStatusCode,
        handleChange: handleStatusCodeChange,
    } = useDebouncedInput({
        initialValue: logsQueryParams.statusCode || "",
        onChange: onStatusCodeChange,
    });

    const {
        value: labNumber,
        handleChange: handleLabNumberChange,
    } = useDebouncedInput({
        initialValue: logsQueryParams.labNumber || "",
        onChange: onLabNumberChange,
    });

    const {
        value: minResponseTime,
        handleChange: handleMinResponseTimeChange,
    } = useDebouncedInput({
        initialValue: logsQueryParams.minResponseTime || "",
        onChange: onMinResponseTimeChange,
    });

    const {
        value: maxResponseTime,
        handleChange: handleMaxResponseTimeChange,
    } = useDebouncedInput({
        initialValue: logsQueryParams.maxResponseTime || "",
        onChange: onMaxResponseTimeChange,
    });

    const handleClearFilters = () => {
        setSelectedActions([]);
        setSelectedUsers([]);
        handleStatusCodeChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
        handleLabNumberChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
        handleMinResponseTimeChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
        handleMaxResponseTimeChange({ target: { value: "" } } as React.ChangeEvent<HTMLInputElement>);
        clearFilters();
    }

    const [isExporting, setIsExporting] = useState(false);

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const exportData = await exportLogsData(logsQueryParams);

            const flattenedData = exportData.data.map((log) => ({
                "User": formatUserFullName(log.user.prefix, log.user.firstname, log.user.lastname),
                "Endpoint": log.request?.endpoint,
                "Method": log.request?.method,
                "Timestamp": new Date(log.timestamp).toLocaleString(),
                "Lab Numbers": log.labnumber?.join(', ') || '',
                "Action": log.action,
                "Status": log.response?.statusCode,
                "Message": log.response?.message,
                "Response Time (ms)": log.response?.timeMs,
            }));

            const worksheet = XLSX.utils.json_to_sheet(flattenedData);

            const colWidths = [
                { wch: 15 }, // User
                { wch: 20 }, // Endpoint
                { wch: 10 }, // Method
                { wch: 20 }, // Timestamp
                { wch: 50 }, // Lab Numbers
                { wch: 15 }, // Action
                { wch: 10 }, // Status
                { wch: 30 }, // Message
                { wch: 10 }, // Response Time (ms)
            ];
            worksheet["!cols"] = colWidths;

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Logs");
            XLSX.writeFile(workbook, `logs_export_${new Date().toISOString()}.xlsx`);
            toast.success("Logs exported successfully!");
        } catch (error) {
            toast.error("Failed to export logs.");
            console.error("Error exporting logs:", error);
        } finally {
            setIsExporting(false);
        }
    }

    return (
        <div className='bg-[#0f172a] border border-[#1e293b] rounded-md p-4 flex flex-col gap-4'>
            <div className='flex gap-2'>
                <div className='flex-1 flex flex-col gap-2'>
                    <label htmlFor="date-range" className='text-[#94a3b8] font-bold'>Date Range</label>
                    <DateRangePicker startDate={parsedStartDate} endDate={parsedEndDate} onChange={onDateChange} />
                </div>
                <div className='flex-1 flex flex-col gap-2'>
                    <label htmlFor="status-code" className='text-[#94a3b8] font-bold'>Status Code</label>
                    <Input id='status-code' value={searchStatusCode} onChange={handleStatusCodeChange} placeholder="Status Code (200, 300, 400 ...)"
                        className='text-white border border-[#334155] rounded-md px-3 py-2' />
                </div>
                <div className='flex-1 flex flex-col gap-2'>
                    <label htmlFor="lab-number" className='text-[#94a3b8] font-bold'>Lab Number</label>
                    <Input id='lab-number' value={labNumber} onChange={handleLabNumberChange} placeholder="Lab Number"
                        className='text-white border border-[#334155] rounded-md px-3 py-2' />
                </div>
                <div className='flex-2 flex flex-col gap-2'>
                    <label htmlFor="min-response-time" className='text-[#94a3b8] font-bold'>Response Time Range (ms)</label>
                    <div className='flex gap-2'>
                        <Input id='min-response-time' value={minResponseTime} onChange={handleMinResponseTimeChange} placeholder="Min Response Time (ms)"
                            className='text-white border border-[#334155] rounded-md px-3 py-2' />
                        <Input id='max-response-time' value={maxResponseTime} onChange={handleMaxResponseTimeChange} placeholder="Max Response Time (ms)"
                            className='text-white border border-[#334155] rounded-md px-3 py-2' />
                    </div>
                </div>
            </div>
            <MultiSelect
                options={ACTION_ORDER.map(action => ({ label: String(action), value: String(action) }))}
                selected={selectedActions}
                onChange={(actions) => {
                    setSelectedActions(actions);
                    onActionChange(actions);
                }}
                placeholder="Select Actions"
            />
            <div className='flex gap-2'>
                <div className='w-full'>
                    {currentUser && currentUser.level === 'admin' && (
                        <MultiSelect
                            options={users ? users.data.map((user: User) => ({ label: formatUserFullName(user.prefix, user.firstname, user.lastname), value: user._id })) : []}
                            selected={selectedUsers}
                            onChange={(users) => {
                                setSelectedUsers(users);
                                onUserChange(users);
                            }}
                            placeholder="Select Users"
                            disabled={isLoadingUsers || isErrorUsers}
                        />
                    )}

                    {currentUser && currentUser.level === 'user' && (
                        <MultiSelect
                            options={[{ label: formatUserFullName(currentUser.prefix, currentUser.firstname, currentUser.lastname), value: currentUser._id }]}
                            selected={selectedUsers}
                            onChange={(users) => {
                                setSelectedUsers(users);
                                onUserChange(users);
                            }}
                            placeholder="Select Users"
                            disabled={isLoadingUsers || isErrorUsers}
                        />
                    )}

                </div>

                <div className='flex justify-end'>
                <Button className='bg-green-600 hover:bg-green-700 text-white' onClick={handleExport} disabled={isExporting}>
                    {isExporting ? 'Exporting...' : 'Export CSV'}
                </Button>
                <Button className="text-sm text-[#f87171] underline" onClick={handleClearFilters}>Clear All Filters</Button>
            </div>
            </div>
        </div>
    )
}

export default FiltersPanel