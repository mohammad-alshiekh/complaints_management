import { useState, useMemo, useCallback, useEffect } from "react";

interface FetcherParams {
  page: number;
  size: number;
  search: string;
}

interface UseTableProps<T> {
  // Local data mode (optional if fetcher is provided)
  data?: T[];
  filterFn?: (item: T, query: string) => boolean;
  
  // Remote data mode (optional if data is provided)
  fetcher?: (params: FetcherParams) => Promise<{
    data: T[];
    totalCount: number;
    totalPages: number;
  }>;

  itemsPerPage?: number;
  initialSearchQuery?: string;
}

export function useTable<T>({
  data = [],
  filterFn,
  fetcher,
  itemsPerPage = 10,
  initialSearchQuery = "",
}: UseTableProps<T>) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [remoteData, setRemoteData] = useState<T[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPagesRemote, setTotalPagesRemote] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // --- Local Mode Logic ---
  const filteredData = useMemo(() => {
    if (fetcher) return []; // Skip local filtering if in remote mode
    if (!filterFn) return data;
    return data.filter((item) => filterFn(item, searchQuery));
  }, [data, searchQuery, filterFn, fetcher]);

  const totalPagesLocal = Math.ceil(filteredData.length / itemsPerPage);

  const paginatedDataLocal = useMemo(() => {
    if (fetcher) return [];
    const start = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(start, start + itemsPerPage);
  }, [filteredData, currentPage, itemsPerPage, fetcher]);

  // --- Remote Mode Logic ---
  const loadRemoteData = useCallback(async () => {
    if (!fetcher) return;
    setIsLoading(true);
    try {
      const result = await fetcher({
        page: currentPage,
        size: itemsPerPage,
        search: searchQuery,
      });
      setRemoteData(result.data);
      setTotalCount(result.totalCount);
      setTotalPagesRemote(result.totalPages);
    } catch (error) {
      console.error("Error fetching table data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetcher, currentPage, itemsPerPage, searchQuery]);

  // Fetch data on change for remote mode
  useEffect(() => {
    if (fetcher) {
      loadRemoteData();
    }
  }, [loadRemoteData, fetcher]);

  // --- Handlers ---
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleNextPage = useCallback(() => {
    const total = fetcher ? totalPagesRemote : totalPagesLocal;
    if (currentPage < total) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, fetcher, totalPagesRemote, totalPagesLocal]);

  const handlePrevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  }, [currentPage]);

  return {
    // State
    searchQuery,
    setSearchQuery: handleSearch,
    currentPage,
    setCurrentPage: handlePageChange,
    isLoading,
    
    // Data
    paginatedData: fetcher ? remoteData : paginatedDataLocal,
    filteredData: fetcher ? remoteData : filteredData,
    
    // Pagination Info
    totalPages: fetcher ? totalPagesRemote : totalPagesLocal,
    totalItems: fetcher ? totalCount : filteredData.length,
    itemsPerPage,
    
    // Actions
    nextPage: handleNextPage,
    prevPage: handlePrevPage,
    refresh: loadRemoteData,
  };
}
