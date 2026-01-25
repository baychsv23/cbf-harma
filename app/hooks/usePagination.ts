import { useState, useEffect, useRef } from "react";
import { useApiWithAlert } from "@/app/hooks/useApiWithAlert";

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface Filters {
  [key: string]: any;
}

interface UsePaginatedDataResult<T = any> {
  items: T[];
  pagination: Pagination;
  loading: boolean;
  page: number;
  setPage: (p: number) => void;
  filters: Filters;
  applyFilters: (newFilters: Filters) => void;
  clearFilters: () => void;
  reloadData: () => void;
}

export function usePagination<T = any>(
  apiUrl: string,
  defaultFilters: Filters = {},
  defaultPage = 1,
  defaultLimit = 50,
): UsePaginatedDataResult<T> {
  const [items, setItems] = useState<T[]>([]);
  const api = useApiWithAlert();
  const [pagination, setPagination] = useState<Pagination>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNext: false,
    hasPrev: false,
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(defaultPage);
  const [filters, setFilters] = useState<Filters>(defaultFilters);

  const loadData = async (p = page, currentFilters = filters) => {
    setLoading(true);

    try {
      const params = {
        page: p,
        limit: defaultLimit,
        ...currentFilters,
      };

      const response = await api.get(apiUrl, {
        params,
        withCredentials: true,
      });

      if (response?.data?.data) {
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
    } catch (err) {
      setItems([]);
      setPagination({
        currentPage: 1,
        totalPages: 1,
        totalItems: 0,
        hasNext: false,
        hasPrev: false,
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ แค่เปลี่ยน filter / page → useEffect จะโหลดเอง
  const applyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({});
    setPage(1);
  };

  const reloadData = () => {
    loadData(page, filters); // manual reload OK
  };

  // ❗ โหลดข้อมูลที่เดียวเท่านั้น
  useEffect(() => {
    loadData(page, filters);
  }, [page, filters, apiUrl]);

  return {
    items,
    pagination,
    loading,
    page,
    setPage,
    filters,
    applyFilters,
    clearFilters,
    reloadData,
  };
}
