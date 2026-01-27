import { database } from "@/lib/prisma";


export async function getArticles({
    where,
    skip,
    limit,
    include,
    select,
}: {
    where?: any;
    skip?: number;
    limit?: number;
    include?: any;
    select?: any;
}) {

    const query: any = {
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
    };

    // Prisma rule: select OR include (not both)
    if (select) {
        query.select = select;
    } else if (include) {
        query.include = include;
    }

    const [data, total] = await Promise.all([
        database.article.findMany(query),
        database.article.count({ where }),
    ]);

    return { data, total };
}

export async function getProducts({
    where,
    skip,
    limit,
    include,
    select,
}: {
    where?: any;
    skip?: number;
    limit?: number;
    include?: any;
    select?: any;
}) {

    const query: any = {
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
    };

    // Prisma rule: select OR include (not both)
    if (select) {
        query.select = select;
    } else if (include) {
        query.include = include;
    }

    const [data, total] = await Promise.all([
        database.product.findMany(query),
        database.product.count({ where }),
    ]);

    return { data, total };
}