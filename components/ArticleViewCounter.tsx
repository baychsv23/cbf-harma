"use client";
import axios from "axios";
import { useEffect } from "react";

interface ArticleViewCounterProps {
  slug: string;
}

export default function ArticleViewCounter({ slug }: ArticleViewCounterProps) {
  useEffect(() => {
    if (!slug) return;

    const storageKey = `article-viewed-${slug}`;

    // ถ้านับไปแล้วใน session นี้ → ไม่ต้องนับซ้ำ
    if (sessionStorage.getItem(storageKey)) return;

    const timer = setTimeout(async () => {
      try {
        await axios.post("/api/articles/count-view", { slug });
        sessionStorage.setItem(storageKey, "1");
      } catch (error) {
        console.error("count view failed", error);
      }
    }, 10); // 10 s

    return () => clearTimeout(timer);
  }, [slug]);

  return null;
}
