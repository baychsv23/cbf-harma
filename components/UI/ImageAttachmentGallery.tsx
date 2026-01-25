"use client";

import { Package, ExternalLink } from "lucide-react";
import { useTranslations } from "next-intl";
import { translations } from "@/lib/translation";

interface ImageItem {
  id: number | string;
  url: string;
}

interface ImageAttachmentGalleryProps {
  images: ImageItem[];
  title?: string;
}

export default function ImageAttachmentGallery({
  images,
  title,
}: ImageAttachmentGalleryProps) {
  const t = useTranslations();

  if (!images || images.length === 0) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6 no-print border border-gray-100">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <Package size={20} className="text-blue-600" />
          {title || t(translations.view)} ({images.length})
        </h2>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {images.map((img) => (
          <div
            key={img.id}
            className="group relative aspect-square overflow-hidden rounded-xl border-2 border-gray-100 hover:border-blue-500 transition-all shadow-sm"
          >
            <a
              href={img.url.replace("/uploads/", "/api/images/")}
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full h-full"
            >
              <img
                src={img.url.replace("/uploads/", "/api/images/")}
                alt="Attachment"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                <ExternalLink size={20} className="text-white" />
                <span className="text-white text-[10px] font-bold uppercase tracking-wider bg-white/20 px-2 py-1 rounded backdrop-blur-md">
                  {t(translations.view)}
                </span>
              </div>
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
