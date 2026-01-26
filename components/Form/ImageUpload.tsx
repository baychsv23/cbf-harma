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
                    sources: ["local", "url"],
                    clientAllowedFormats: ["jpg", "jpeg", "png", "webp"],
                    cropping: true,
                    croppingAspectRatio: aspectRatio,
                    folder: folder,
                    showSkipCropButton: false
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
              ${disabled
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