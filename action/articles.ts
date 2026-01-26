
import { database } from "@/lib/prisma";

export async function getArticles({ where, skip, limit, include }: { where?: any; skip?: number; limit?: number; include?: any }) {
    const [data, total] = await Promise.all([
        database.article.findMany({ where, skip, take: limit, include, orderBy: { createdAt: 'desc' } }),
        database.article.count({ where })
    ]);
    return { data, total };
}