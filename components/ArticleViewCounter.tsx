"use client";

import { useEffect } from "react";
import axios from "axios";

interface ArticleViewCounterProps {
    slug: string;
}

export default function ArticleViewCounter({ slug }: ArticleViewCounterProps) {
    useEffect(() => {
        if (!slug) return;

        // ฟังก์ชันยิง API
        const countView = async () => {
            try {
                await axios.post(`/api/articles/slug/${slug}/countView`);
                // ไม่ต้องทำอะไรต่อ หรือ console.log("View counted") เพื่อ debug
            } catch (error) {
                console.error("Failed to count view", error);
            }
        };

        // เรียกทำงานทันทีที่ Component ถูก mount (คนเข้าหน้าเว็บ)
        countView();
    }, [slug]);

    // Component นี้ไม่ต้องแสดงผลอะไร (Invisible)
    return null;
}