import { Announcement, Article, Product, Symptom, User } from "@/generated/prisma/client";
import { database } from "@/lib/prisma";
import { unstable_cache } from "next/cache";

interface GetDataParams<T = any> {
    where?: T;
    skip?: number;
    limit?: number;
    include?: any;
    select?: any;
    orderBy?: any;
}

async function getData<T>(
    model: any,
    { where, skip, limit, include, select, orderBy }: GetDataParams,
): Promise<{ data: T[]; total: number }> {
    const query: any = {
        where,
        skip,
        take: limit,
    };

    // Prisma rule: select OR include (not both)
    if (select) {
        query.select = select;
    } else if (include) {
        query.include = include;
    }

    if (orderBy) {
        query.orderBy = orderBy;
    }

    const [data, total] = await Promise.all([
        model.findMany(query),
        model.count({ where }),
    ]);

    return { data, total };
}

export const getProducts = (params: GetDataParams) => {
    const serialized = JSON.stringify(params || {});
    return unstable_cache(
        async () => getData<Product>(database.product, params),
        ["products-list", serialized],
        { tags: ["products"] }
    )();
};

export const getArticles = (params: GetDataParams) => {
    const serialized = JSON.stringify(params || {});
    return unstable_cache(
        async () => getData<Article>(database.article, params),
        ["articles-list", serialized],
        { tags: ["articles"] }
    )();
};

export const getSymptoms = (params: GetDataParams) => {
    const serialized = JSON.stringify(params || {});
    return unstable_cache(
        async () => getData<Symptom>(database.symptom, params),
        ["symptoms-list", serialized],
        { tags: ["symptoms"] }
    )();
};

export const getAnnouncements = (params: GetDataParams) => {
    const serialized = JSON.stringify(params || {});
    return unstable_cache(
        async () => getData<Announcement>(database.announcement, params),
        ["announcements-list", serialized],
        { tags: ["announcements"] }
    )();
};

export const getAccounts = (params: GetDataParams) => {
    const serialized = JSON.stringify(params || {});
    return unstable_cache(
        async () => getData<User>(database.user, params),
        ["accounts-list", serialized],
        { tags: ["accounts"] }
    )();
};


