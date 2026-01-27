"use client";

import { CldUploadWidget } from "next-cloudinary";
import Image from "next/image";
import { Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  value: string | null;
  onChange: (value: { url: string; publicId: string }) => void;
  disabled?: boolean;
  folder?: string;
  aspectRatio?: number; // 1.77 for 16:9, 1 for Square
  label?: string;
}

export default function ImageUpload({
  value,
  onChange,
  disabled,
  folder = "cbf",
  aspectRatio = 1.77, // Default to 16:9 (Banner)
  label = "Click to Upload Image",
}: ImageUploadProps) {
  return (
    <div className="space-y-2">
      <CldUploadWidget
        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_PRESET}
        options={{
          multiple: false,
          maxFiles: 1,
          folder: folder,
          sources: ["local", "url"],
          clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
          maxFileSize: 10000000, // จำกัด 10MB
          maxImageWidth: 4000,
          validateMaxWidthHeight: true,

          cropping: true,
          croppingAspectRatio: aspectRatio,
          croppingShowDimensions: true, // โชว์ขนาด Pixel ขณะตัด
          croppingValidateDimensions: true, // แจ้งเตือนถ้าตัดแล้วรูปเล็กเกินไป
          showSkipCropButton: false, // บังคับตัดภาพเสมอ (ดีแล้วสำหรับ Layout ที่เป๊ะ)
          styles: {
            palette: {
              window: "#FFFFFF",
              windowBorder: "#90A0B3",
              tabIcon: "#0078FF",
              menuIcons: "#5A616A",
              textDark: "#000000",
              textLight: "#FFFFFF",
              link: "#0078FF",
              action: "#FF620C",
              inactiveTabIcon: "#0E2F5A",
              error: "#F44235",
              inProgress: "#0078FF",
              complete: "#20B832",
              sourceBg: "#E4EBF1",
            },
            fonts: {
              default: null,
              "'Poppins', sans-serif": {
                url: "https://fonts.googleapis.com/css?family=Poppins",
                active: true,
              },
            },
          },
        }}
        onSuccess={(result: any) => {
          onChange({
            url: result.info.secure_url,
            publicId: result.info.public_id,
          });
        }}
      >
        {({ open }) => (
          <div
            onClick={() => !disabled && open()}
            className={`
              group relative w-full overflow-hidden rounded-xl border-2 border-dashed transition-all flex flex-col items-center justify-center
              ${aspectRatio === 1 ? "aspect-square" : "aspect-video"} 
              ${
                disabled
                  ? "opacity-50 cursor-not-allowed border-slate-200 bg-slate-100"
                  : "cursor-pointer border-slate-300 bg-slate-50 hover:bg-slate-100 hover:border-orange-400"
              }
            `}
          >
            {value ? (
              <>
                <Image
                  src={value}
                  alt="Upload Preview"
                  fill
                  className="object-cover"
                />
                {!disabled && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-white font-bold text-xs z-10">
                    Change Image
                  </div>
                )}
              </>
            ) : (
              <div className="text-slate-400 text-center p-4">
                <ImageIcon size={32} className="mx-auto mb-2" />
                <span className="text-xs font-medium">{label}</span>
              </div>
            )}
          </div>
        )}
      </CldUploadWidget>
    </div>
  );
}
