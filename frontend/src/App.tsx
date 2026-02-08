import { useFetchLogs } from "@/api.ts";
import LogsTable from "./components/LogsTable"
import Pagination from "./components/Pagination"
import type { LogQueryParams } from "@/types/log.type.ts";

function App() {
  const { logs, isLoading, isError, setQueryParams, queryParams } = useFetchLogs();

  const currentPage = logs?.pagination.page ?? 1;
  const totalPages = logs?.pagination.totalPages ?? 1;

  const totalLogs = logs?.totalCount ?? 0;
  const limit = logs?.pagination.limit ?? 50;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalLogs);

  const handleFilterChange = (newFilters: LogQueryParams) => {
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
      <LogsTable logs={logs} isLoading={isLoading} />
      {logs && (
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
        />
      )}
    </div>
  )
}

export default App
