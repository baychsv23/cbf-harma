"use client";
import { useState, useEffect } from "react";
import { X, Megaphone, Eye, CheckCircle2 } from "lucide-react";
import { BooleanState, ImageType } from "@/generated/prisma/enums";
import { translations } from "@/lib/translation";
import ImageUpload from "./ImageUpload";

interface AnnouncementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
  t: any; // Pass translation function
}

export default function AnnouncementFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  t,
}: AnnouncementFormProps) {
  // --- STATE ---
  const [formData, setFormData] = useState<{
    type: ImageType;
    isPublic: BooleanState;
    image: string;
    imagePublicId: string;
  }>({
    type: ImageType.BANNER,
    isPublic: BooleanState.TRUE,
    image: "",
    imagePublicId: "",
  });

  // --- EFFECT: Load Data ---
  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setFormData({
          type: initialData.type || ImageType.BANNER,
          isPublic: initialData.isPublic || BooleanState.TRUE,
          image: initialData.image || "",
          imagePublicId: initialData.imagePublicId || "",
        });
      } else {
        // Reset
        setFormData({
          type: ImageType.BANNER,
          isPublic: BooleanState.TRUE,
          image: "",
          imagePublicId: "",
        });
      }
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  // --- HANDLERS ---
  const handleSubmit = () => {
    // Simple validation if needed
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 transition-all">
      <div className="bg-white w-full max-w-[600px] h-auto max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* HEADER */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                initialData
                  ? "bg-accent/10 text-accent"
                  : "bg-primary/10 text-primary"
              }`}
            >
              <Megaphone size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800 leading-none">
                {initialData
                  ? t(translations.Edit, { name: t(translations.announcement) })
                  : t(translations.Create, {
                      name: t(translations.announcement),
                    })}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Manage banners and public announcements
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto bg-slate-50/50 p-6 flex flex-col gap-6">
          {/* 1. Image Upload */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-700 mb-4 pb-2 border-b border-slate-100">
              Type & Category
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.values(ImageType).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, type })}
                  className={`relative flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-bold text-sm transition-all ${
                    formData.type === type
                      ? "border-orange-500 bg-orange-50 text-orange-700 ring-1 ring-orange-500"
                      : "border-slate-200 hover:border-slate-300 text-slate-600 bg-white"
                  }`}
                >
                  {type}
                  {formData.type === type && (
                    <div className="absolute top-2 right-2 text-orange-600">
                      <CheckCircle2 size={14} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
          {formData.type === ImageType.BANNER && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">
                {t(translations.image)} (16:9 Aspect Ratio)
              </label>
              <ImageUpload
                value={formData.image}
                aspectRatio={1.77} // 16:9 for Banners
                label="Click to Upload Banner 16:9"
                onChange={(result) =>
                  setFormData((prev) => ({
                    ...prev,
                    image: result.url,
                    imagePublicId: result.publicId,
                  }))
                }
              />
            </div>
          )}
          {formData.type === ImageType.ANNOUNCEMENT && (
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <label className="text-xs font-bold text-slate-500 uppercase mb-3 block">
                {t(translations.image)} (16:9 Aspect Ratio)
              </label>
              <ImageUpload
                value={formData.image}
                aspectRatio={1} // 16:9 for Banners
                label="Click to Upload Banner 1:1"
                onChange={(result) =>
                  setFormData((prev) => ({
                    ...prev,
                    image: result.url,
                    imagePublicId: result.publicId,
                  }))
                }
              />
            </div>
          )}

          {/* 2. Type Selection */}

          {/* 3. Visibility (Styled like Product Form's Safety Control) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm border-l-4 border-l-green-500">
            <div className="flex items-center gap-2 mb-2">
              <Eye size={16} className="text-secondary" />
              <label className="text-xs font-bold text-secondary uppercase">
                Visibility Status
              </label>
            </div>
            <label className="flex items-start gap-3 cursor-pointer p-2 hover:bg-secondary/10 rounded-lg transition-colors">
              <input
                type="checkbox"
                className="mt-1 w-4 h-4 accent-green-600"
                checked={formData.isPublic === BooleanState.TRUE}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    isPublic: e.target.checked
                      ? BooleanState.TRUE
                      : BooleanState.FALSE,
                  })
                }
              />
              <div>
                <span className="block font-bold text-slate-800 text-sm">
                  Active / Public
                </span>
                <span className="text-[10px] text-slate-500 block leading-tight">
                  Display this announcement to all users immediately.
                </span>
              </div>
            </label>
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-6 py-4 bg-white border-t border-slate-200 flex justify-end gap-3 sticky bottom-0">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition text-sm"
          >
            {t(translations.cancel)}
          </button>
          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-slate-800 transition shadow-lg shadow-slate-200 text-sm"
          >
            {initialData ? t(translations.update) : t(translations.create)}
          </button>
        </div>
      </div>
    </div>
  );
}
