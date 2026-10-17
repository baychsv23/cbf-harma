"use client";
import { api } from "@/lib/axios";
import { useEffect } from "react";

interface ProductViewCounterProps {
  slug: string;
}

export default function ProductViewCounter({ slug }: ProductViewCounterProps) {
  useEffect(() => {
    if (!slug) return;

    const storageKey = `product-viewed-${slug}`;

    // ถ้านับไปแล้วใน session นี้ → ไม่ต้องนับซ้ำ
    if (sessionStorage.getItem(storageKey)) return;

    const timer = setTimeout(async () => {
      try {
        await api.post("/products/count-view", { slug }, { isSilent: true });
        sessionStorage.setItem(storageKey, "1");
      } catch (error) {
        console.error("count view failed", error);
      }
    }, 10_000); // 10 s

    return () => clearTimeout(timer);
  }, [slug]);

  return null;
}
