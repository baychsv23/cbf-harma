import { Article, Product } from "@/generated/prisma/client";
import { database } from "./prisma";
import { unstable_cache } from "next/cache";

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


export const getArticleBySlug = (slug: string, params: GetDataBySlugParams) => {
    const serialized = JSON.stringify(params || {});
    return unstable_cache(
        async () => getDataBySlug<Article>(database.article, slug, params),
        [`article-by-slug-${slug}`, serialized],
        { tags: ["articles", `article-slug-${slug}`] }
    )();
};

export const getProductBySlug = (slug: string, params: GetDataBySlugParams) => {
    const serialized = JSON.stringify(params || {});
    return unstable_cache(
        async () => getDataBySlug<Product>(database.product, slug, params),
        [`product-by-slug-${slug}`, serialized],
        { tags: ["products", `product-slug-${slug}`] }
    )();
};