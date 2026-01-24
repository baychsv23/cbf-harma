import { useState, useEffect } from "react";

interface PaginationResult {
  data: any[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

interface Filters {
  [key: string]: any;
}

interface ActionResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}

export function usePaginatedData<T = any>(
  action: (
    page: number,
    limit: number,
    filters?: Filters
  ) => Promise<ActionResponse<PaginationResult>>
) {
  const [items, setItems] = useState<T[]>([]);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationResult["pagination"]>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({});

  const loadData = async (p = page, currentFilters = filters) => {
    setLoading(true);
    try {
      const response = await action(p, 50, currentFilters);
      if (response.success && response.data) {
        setItems(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setItems([]);
        setPagination({
          currentPage: 1,
          totalPages: 1,
          totalItems: 0,
          hasNext: false,
          hasPrev: false,
        });
      }
    } catch (error: any) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1);
    loadData(1, newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
    loadData(1, {});
  };

  useEffect(() => {
    loadData(page, filters);
  }, [page]);

  return {
    items,
    pagination,
    loading,
    page,
    setPage,
    loadData,
    filters,
    applyFilters,
    clearFilters,
  };
}
