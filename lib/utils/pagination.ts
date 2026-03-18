export const addSequenceNumbers = <T>(
  data: T[],
  page: number,
  limit: number,
): (T & { stt: number })[] => {
  const skip = (page - 1) * limit;
  return data.map((item, index) => ({
    ...item,
    stt: skip + index + 1,
  }));
};

export const simpleResponse = <T>(data: T[]) => {
  return {
    success: true,
    data: data,
  };
};

export const paginatedResponse = <T>(
  data: T[],
  total: number,
  page: number,
  limit: number,
) => {
  return {
    success: true,
    data: addSequenceNumbers(data, page, limit),
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
};

export const DEFAULT_LIMIT = 25;
export const DEFAULT_PAGE = 1;

export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Number(searchParams.get("page")) || DEFAULT_PAGE;
  const limit = Number(searchParams.get("limit")) || DEFAULT_LIMIT;

  return { page, limit };
}
