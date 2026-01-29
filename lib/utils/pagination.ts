const addSequenceNumbers = <T>(
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


export const paginatedResponse = <T>(
    data: T[],
    total: number,
    page: number,
    limit: number,
) => {
    const totalPages = Math.ceil(total / limit);
    return {
        success: true,
        data: addSequenceNumbers(data, page, limit),
        pagination: {
            currentPage: page,
            totalPages: totalPages,
            totalItems: total,
            hasNext: page < totalPages,
            hasPrev: page > 1,
        },
    };
};

export const DEFAULT_LIMIT = 2;
export const DEFAULT_PAGE = 1;
export const MAX_LIMIT = 1000;