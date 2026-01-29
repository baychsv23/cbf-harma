import { Announcement, Article, Product, Symptom, User } from "@/generated/prisma/client";
import { database } from "@/lib/prisma";


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
export const getProducts = (params: GetDataParams) =>
    getData<Product>(database.product, params);
export const getArticles = (params: GetDataParams) =>
    getData<Article>(database.article, params);
export const getSymptoms = (params: GetDataParams) =>
    getData<Symptom>(database.symptom, params);

export const getAnnouncements = (params: GetDataParams) =>
    getData<Announcement>(database.announcement, params);
export const getAccounts = (params: GetDataParams) =>
    getData<User>(database.user, params);


