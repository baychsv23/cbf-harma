import { ArticleStatus } from "@/generated/prisma/enums";
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

export async function getArticleBySlug(slug: string) {
    return await database.article.findUnique({
        where: {
            slug: slug,
            status: ArticleStatus.PUBLISHED // ดึงเฉพาะที่ Publish แล้ว
        },
        select: {
            id: true,
            slug: true,
            titleEN: true,
            titleLA: true,
            type: true,
            contentEN: true,
            contentLA: true,
            coverImage: true,
            createdAt: true,
            views: true,
            products: { select: { id: true, nameEN: true, nameLA: true, productImage: true } }, // ดึงสินค้าที่เกี่ยวข้อง
        },
    });
}

