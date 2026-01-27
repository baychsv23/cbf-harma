// app/api/cron/sync-views/route.ts
import { database } from '@/lib/prisma'
import { redis } from '@/lib/redis'

export async function GET(req: Request) {
    // 1. ตรวจสอบ Security (CRON_SECRET)
    if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 })
    }

    // 2. ดึงคีย์ทั้งหมดที่ขึ้นต้นด้วย article:views:
    const keys = await redis.keys('article:views:*')

    const updates = []
    for (const key of keys) {
        const slug = key.replace('article:views:', '')
        const count = await redis.get<number>(key)

        if (count && count > 0) {
            // 3. เตรียมคำสั่ง Update (เช่น Prisma increment)
            updates.push(
                database.article.update({
                    where: { slug },
                    data: { views: { increment: Number(count) } }
                })
            )
            // 4. ลบคีย์ที่ประมวลผลแล้วออก หรือ Reset เป็น 0
            await redis.del(key)
        }
    }

    // รันคำสั่งทั้งหมดแบบขนาน (Batch)
    await Promise.all(updates)

    return Response.json({ status: 'success', synced: updates.length })
}