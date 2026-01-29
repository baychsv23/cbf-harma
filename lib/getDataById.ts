
import { Announcement, Article, Product, Symptom, User } from "@/generated/prisma/client";
import { database } from "./prisma";

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

export const getArticleById = (id: string, params: GetDataByIdParams) =>
    getDataById<Article>(database.article, id, params);
export const getSymptomById = (id: string, params: GetDataByIdParams) =>
    getDataById<Symptom>(database.symptom, id, params);
export const getProductById = (id: string, params: GetDataByIdParams) =>
    getDataById<Product>(database.product, id, params);
export const getAnnouncementById = (id: string, params: GetDataByIdParams) =>
    getDataById<Announcement>(database.announcement, id, params);
export const getAccountById = (id: string, params: GetDataByIdParams) =>
    getDataById<User>(database.user, id, params);
