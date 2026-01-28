// api/articles/slug/[slug]/countView
import { redis } from '@/lib/redis' // ไฟล์ที่เราสร้างไว้ก่อนหน้านี้
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'

export async function POST(request: NextRequest,
    { params }: { params: Promise<{ slug: string }> },) {
    const { slug } = await params;

    // 1. ดึง IP Address ของผู้ใช้ (Vercel จะส่งมาใน Header)
    const headerList = headers()
    const forwarded = (await headerList).get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1'

    const rateLimitKey = `view_limit:${slug}:${ip}`

    // 3. เช็คใน Redis ว่า Key นี้มีอยู่ไหม
    const isLimited = await redis.get(rateLimitKey)

    if (isLimited) {
        // ถ้าเคยดูแล้ว (Key ยังไม่หมดอายุ) ไม่ต้องนับเพิ่ม
        return NextResponse.json({ message: 'View already counted' }, { status: 200 })
    }

    // 4. ถ้ายังไม่เคยดู:
    // - เซ็ต Key กันปั๊มไว้ (อายุ 24 ชม. = 86400 วินาที)
    await redis.set(rateLimitKey, '1', { ex: 86400 })

    // - เพิ่มยอดวิวใน Redis คีย์หลัก (สำหรับการ Sync ลง DB)
    await redis.incr(`article:views:${slug}`)

    return NextResponse.json({ success: true })
}