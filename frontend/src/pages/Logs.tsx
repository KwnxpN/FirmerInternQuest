import { useFetchLogs } from "@/api.ts";
import LogsTable from "@/components/LogsTable"
import Pagination from "@/components/Pagination"
import FiltersPanel from "@/components/FiltersPanel";
import Navbar from "@/components/Navbar";

import { formatDateForApi } from "@/utils/date";
import type { LogQueryParams } from "@/types/log.type.ts";

function Logs() {
    const { logs, isLoading: isLoadingLogs, setQueryParams, queryParams } = useFetchLogs();

    const currentPage = logs?.pagination.page ?? 1;
    const totalPages = logs?.pagination.totalPages ?? 1;

    const totalLogs = logs?.totalCount ?? 0;
    const limit = queryParams.limit ?? "50";

    const startItem = totalLogs ? (currentPage - 1) * Number(limit) + 1 : 0;
    const endItem = Math.min(currentPage * Number(limit), totalLogs);

    const isEmpty = !logs || !logs.data || logs.data.length === 0;
    const sortBy = queryParams.sortBy;
    const sortOrder = queryParams.sortOrder;

    const handleFilterChange = (newFilters: LogQueryParams) => {
        console.log("Applying new filters:", newFilters);
        setQueryParams((prev) => {
            const updated = { ...prev, ...newFilters };
            // Refresh page if filter changes and it's not just the page parameter
            if (Object.keys(newFilters).some(key => key !== 'page')) {
                updated.page = 1;
            }
            return updated;
        });
    }

    const clearFilters = () => {
        setQueryParams({});
    }

    return (
        <>
            <Navbar />
            <div className="p-8 pt-4 bg-[#101922] min-h-screen flex flex-col gap-4">
                <FiltersPanel
                    logsQueryParams={queryParams}
                    onDateChange={(start, end) => handleFilterChange({ startDate: formatDateForApi(start), endDate: formatDateForApi(end) })}
                    onActionChange={(actions) => handleFilterChange({ action: actions })}
                    onUserChange={(users) => handleFilterChange({ userId: users })}
                    onStatusCodeChange={(statusCode) => handleFilterChange({ statusCode })}
                    onLabNumberChange={(labNumber) => handleFilterChange({ labNumber })}
                    onMinResponseTimeChange={(minResponseTime) => handleFilterChange({ minResponseTime: minResponseTime })}
                    onMaxResponseTimeChange={(maxResponseTime) => handleFilterChange({ maxResponseTime: maxResponseTime })}
                    clearFilters={clearFilters}
                />
                <LogsTable
                    logs={logs}
                    isLoading={isLoadingLogs}
                    isEmpty={isEmpty}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSortChange={(sortBy, sortOrder) => handleFilterChange({ sortBy, sortOrder })}
                />

                <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => handleFilterChange({ page })}
                    onLimitChange={(newLimit) => handleFilterChange({ limit: newLimit })}
                    limit={limit}
                    startItem={startItem}
                    endItem={endItem}
                    totalItems={totalLogs}
                    isLoading={isLoadingLogs}
                    isEmpty={isEmpty}
                />
            </div>
        </>
    )
}

export default Logs
