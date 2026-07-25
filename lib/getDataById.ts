
import { Announcement, Article, Product, Symptom, User } from "@/generated/prisma/client";
import { database } from "./prisma";
import { unstable_cache } from "next/cache";

interface GetDataByIdParams<T = any> {
    where?: T;
    include?: any;
    select?: any;
}
async function getDataById<T>(
    model: any,
    id: string,
    { where, include, select }: GetDataByIdParams,
): Promise<T> {
    const query: any = {
        where: {
            id,
            ...where,
        },
    };

    if (select) {
        query.select = select;
    } else if (include) {
        query.include = include;
    }

    return await model.findUnique(query);
}

export const getArticleById = (id: string, params: GetDataByIdParams) => {
    const serialized = JSON.stringify(params || {});
    return unstable_cache(
        async () => getDataById<Article>(database.article, id, params),
        [`article-by-id-${id}`, serialized],
        { tags: ["articles", `article-${id}`] }
    )();
};

export const getSymptomById = (id: string, params: GetDataByIdParams) => {
    const serialized = JSON.stringify(params || {});
    return unstable_cache(
        async () => getDataById<Symptom>(database.symptom, id, params),
        [`symptom-by-id-${id}`, serialized],
        { tags: ["symptoms", `symptom-${id}`] }
    )();
};

export const getProductById = (id: string, params: GetDataByIdParams) => {
    const serialized = JSON.stringify(params || {});
    return unstable_cache(
        async () => getDataById<Product>(database.product, id, params),
        [`product-by-id-${id}`, serialized],
        { tags: ["products", `product-${id}`] }
    )();
};

export const getAnnouncementById = (id: string, params: GetDataByIdParams) => {
    const serialized = JSON.stringify(params || {});
    return unstable_cache(
        async () => getDataById<Announcement>(database.announcement, id, params),
        [`announcement-by-id-${id}`, serialized],
        { tags: ["announcements", `announcement-${id}`] }
    )();
};

export const getAccountById = (id: string, params: GetDataByIdParams) => {
    const serialized = JSON.stringify(params || {});
    return unstable_cache(
        async () => getDataById<User>(database.user, id, params),
        [`account-by-id-${id}`, serialized],
        { tags: ["accounts", `account-${id}`] }
    )();
};
