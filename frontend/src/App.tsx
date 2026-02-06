import { useFetchLogs } from "@/api.ts";
import LogsTable from "./components/LogsTable"
import Pagination from "./components/Pagination"

function App() {
  const { logs, isLoading, isError, setQueryParams } = useFetchLogs();

  const currentPage = logs?.pagination.page ?? 1;
  const totalPages = logs?.pagination.totalPages ?? 1;

  const totalLogs = logs?.totalCount ?? 0;
  const limit = logs?.pagination.limit ?? 50;

  const startItem = (currentPage - 1) * limit + 1;
  const endItem = Math.min(currentPage * limit, totalLogs);

  const handlePageChange = (page: number) => {
    setQueryParams((prev) => ({
      ...prev,
      page,
    }));
  };

  return (
    <div className="p-8 bg-[#101922] min-h-screen flex flex-col gap-4">
      <LogsTable logs={logs} isLoading={isLoading} />
      {logs && (
        <Pagination
          page={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
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
