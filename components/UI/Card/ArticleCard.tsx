"use client";

import { formatDate } from "@/lib/formateData";
import { Article } from "@/lib/interface";
import Image from "next/image";



export default function ArticleCard({ article, }: { article: Article }) {
    // ฟังก์ชันเลือกแสดงผลภาษา (ตัวอย่าง: ถ้าไม่มีภาษาลาว ให้โชว์อังกฤษ)
    const title = article.titleEN || article.titleLA

    return (
        <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full">
            {/* ส่วนรูปภาพ (Image) */}
            <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                {article.image ? (
                    // อย่าลืม config domain รูปใน next.config.js
                    <Image
                        src={article.image}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 bg-gray-100">
                        No Image
                    </div>
                )}

                {/* Badge ประเภทบทความ */}
                <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-sm">
                    {article.type}
                </span>
            </div>

            {/* ส่วนเนื้อหา (Content) */}
            <div className="p-5 flex flex-col flex-grow">
                <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span>{formatDate(article.createdAt)}</span>
                    <span>•</span>
                    <span>{article.createdBy?.fullName || "Admin"}</span>
                </div>

                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {title}
                </h3>

                {/* แสดงสินค้าที่เกี่ยวข้อง (ถ้ามี) */}
                {article.products && article.products.length > 0 && (
                    <div className="mt-auto pt-4 flex flex-wrap gap-1">
                        {article.products.slice(0, 2).map(p => (
                            <span key={p.id} className="text-[10px] bg-gray-50 text-gray-600 px-2 py-1 rounded-md border border-gray-100">
                                {p.nameLA || p.nameEN}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}