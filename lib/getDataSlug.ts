import { Article, Product } from "@/generated/prisma/client";
import { database } from "./prisma";

interface GetDataBySlugParams<T = any> {
    where?: T;
    include?: any;
    select?: any;
}

async function getDataBySlug<T>(
    model: any,
    slug: string,
    { where, include, select }: GetDataBySlugParams,
): Promise<T> {
    const query: any = {
        where: {
            slug,
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


export const getArticleBySlug = (slug: string, params: GetDataBySlugParams) =>
    getDataBySlug<Article>(database.article, slug, params);
export const getProductBySlug = (slug: string, params: GetDataBySlugParams) =>
    getDataBySlug<Product>(database.product, slug, params);