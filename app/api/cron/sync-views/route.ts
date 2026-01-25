import { database } from '@/lib/prisma'
import { redis } from '@/lib/redis'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    // 1. Security Check: ตรวจสอบว่าเป็น Vercel Cron รันจริงหรือไม่
    // Vercel จะส่ง CRON_SECRET มาให้ใน Header (ต้องตั้งค่าใน Vercel Env)
    const authHeader = req.headers.get('authorization')
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', { status: 401 })
    }

    try {
        // 2. ดึง Keys ทั้งหมดที่เก็บยอดวิว (e.g., article:views:uuid)
        const keys = await redis.keys('article:views:*')

        if (keys.length === 0) {
            return NextResponse.json({ message: 'No views to sync' })
        }

        // 3. ใช้ Promise.all เพื่อรันอัปเดตแบบขนาน (เร็วขึ้น)
        const syncTasks = keys.map(async (key) => {
            const articleId = key.split(':').pop()
            const viewsInRedis = await redis.get<number>(key)

            if (articleId && viewsInRedis && viewsInRedis > 0) {
                // อัปเดตลง Supabase (Postgres)
                await database.article.update({
                    where: { id: articleId },
                    data: {
                        views: { increment: viewsInRedis }
                    }
                })

                // ลบข้อมูลใน Redis เฉพาะคีย์ที่ซิงค์แล้ว
                await redis.del(key)
            }
        })

        await Promise.all(syncTasks)

        return NextResponse.json({
            success: true,
            syncedCount: keys.length
        })

    } catch (error) {
        console.error('Sync Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}