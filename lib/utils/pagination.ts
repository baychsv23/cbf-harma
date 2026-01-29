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
        },
    };
};

export const DEFAULT_LIMIT = 50;
export const DEFAULT_PAGE = 1;
export const MAX_LIMIT = 1000;