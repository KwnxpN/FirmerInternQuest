import { useFetchLogs } from "@/api.ts";
import LogsTable from "./components/LogsTable"
import Pagination from "./components/Pagination"
import FiltersPanel from "./components/FiltersPanel";
import type { LogQueryParams } from "@/types/log.type.ts";
import { formatDateForApi, parseDateFromApi } from "./utils/date";

function App() {
  const { logs, isLoading, isError, setQueryParams, queryParams } = useFetchLogs();

  const currentPage = logs?.pagination.page ?? 1;
  const totalPages = logs?.pagination.totalPages ?? 1;

  const totalLogs = logs?.totalCount ?? 0;
  const limit = logs?.pagination.limit ?? 50;

  const startItem = totalLogs ? (currentPage - 1) * limit + 1 : 0;
  const endItem = Math.min(currentPage * limit, totalLogs);

  const isEmpty = !logs || !logs.data || logs.data.length === 0;

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

  return (
    <div className="p-8 bg-[#101922] min-h-screen flex flex-col gap-4">
      <FiltersPanel
        startDate={queryParams.startDate ? parseDateFromApi(queryParams.startDate) : null}
        endDate={queryParams.endDate ? parseDateFromApi(queryParams.endDate) : null}
        onDateChange={(start, end) => handleFilterChange({ startDate: formatDateForApi(start), endDate: formatDateForApi(end) })}
        onActionChange={(actions) => handleFilterChange({ action: actions })}
      />
      <LogsTable logs={logs} isLoading={isLoading} isEmpty={isEmpty} />
      <Pagination
        page={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => handleFilterChange({ page })}
        onLimitChange={(newLimit) => handleFilterChange({ limit: newLimit })}
        limit={limit}
        startItem={startItem}
        endItem={endItem}
        totalItems={totalLogs}
        isLoading={isLoading}
        isEmpty={isEmpty}
      />
    </div>
  )
}

export default App
