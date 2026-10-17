"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function BackButton({ label }: { label: string }) {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="group flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors cursor-pointer"
    >
      <div className="p-2 rounded-full group-hover:bg-primary/10 transition-colors">
        <ArrowLeft className="w-4 h-4" />
      </div>
      <span className="hidden sm:inline">{label}</span>
    </button>
  );
}
