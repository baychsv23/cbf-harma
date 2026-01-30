import { Link } from "@/i18n/routing";
import Image from "next/image";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Pill,
  Package,
  AlertTriangle,
  ShieldCheck,
  Stethoscope,
  Info
} from "lucide-react";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { isEnglish } from "@/lib/utils/locale";
import { ProductCBF } from "@/lib/interface";
import { getProductBySlug } from "@/lib/getDataSlug";
import { BooleanState, CategorySub } from "@/generated/prisma/enums";
import { selectDataOfProduct } from "@/lib/selectData";
import { translations } from "@/lib/translation";

// 1. Generate Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const product = await getProductBySlug(slug, {
    where: { isActive: BooleanState.TRUE },
    select: selectDataOfProduct,
  });

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.nameEN,
    description: product.genericName || "Pharmaceutical Product",
    openGraph: {
      images: product.productImage ? [product.productImage] : [],
    },
  };
}

export default async function ProductSingleCBFPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const locale = await getLocale();
  const t = await getTranslations();

  // 2. Fetch Data
  const product = (await getProductBySlug(slug, {
    select: selectDataOfProduct,
  })) as ProductCBF;

  // 3. Handle 404
  if (!product) {
    notFound();
  }

  // Helpers
  const isEn = isEnglish(locale);
  const name = isEn ? product.nameEN : product.nameLA;
  const indication = isEn ? product.indicationEN : product.indicationLA;

  return (
    <main className="min-h-screen bg-[#F8F9FA] pb-20">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100 mb-8 transition-all duration-300">
        <div className="container mx-auto px-4 max-w-6xl h-16 flex items-center">
          <Link
            href="/cbf/products"
            className="group flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            <div className="p-2 rounded-full group-hover:bg-gray-100 transition-colors">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>{t(translations.back)}</span>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
        {/* --- Main Layout: Grid 2 Columns --- */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">

          {/* LEFT COLUMN: Product Image (Sticky on Desktop) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 z-10">
            <div className="relative bg-white rounded-3xl p-6 md:p-10 shadow-sm border border-gray-100 aspect-square flex items-center justify-center overflow-hidden group">

              {/* Badges Overlay */}
              <div className="absolute top-4 left-4 z-20 flex flex-wrap gap-2 max-w-full">
                <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gray-900 text-white text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-md">
                  {t(product.category)}
                </span>
                {product.categorySub !== CategorySub.NONE && (
                  <span className="inline-flex items-center px-3 py-1.5 rounded-lg bg-white border border-gray-200 text-gray-700 text-[10px] md:text-xs font-bold uppercase tracking-wider shadow-sm">
                    {t(product.categorySub)}
                  </span>
                )}
              </div>

              {/* Image */}
              {product.productImage ? (
                <div className="relative w-full h-full transition-transform duration-500 group-hover:scale-105">

                  <Image
                    src={product.productImage}
                    alt={name}
                    fill
                    className="object-contain drop-shadow-xl"
                    sizes="(max-width: 768px) 100vw, 500px"
                    priority
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-300 gap-3">
                  <div className="p-6 rounded-full bg-gray-50">
                    <Package className="w-12 h-12 opacity-30" />
                  </div>
                  <span className="text-sm font-medium text-gray-400">Image not available</span>
                </div>
              )}
            </div>

            {/* Warning Box (Mobile/Desktop position adjustment can be done here if needed) */}
            {product.isPrescription === BooleanState.TRUE && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 border border-red-100 flex items-start gap-3 text-red-700">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <div className="text-sm">
                  <span className="font-bold block mb-1">Prescription Required</span>
                  {t(translations.prescriptionRequired)} (Rx Only)
                </div>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Product Details */}
          <div className="lg:col-span-7 min-w-0 flex flex-col gap-8">

            {/* 1. Header Section */}
            <div>
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-3 break-words hyphens-auto">
                {name}
              </h1>
              {product.genericName && (
                <p className="text-lg md:text-xl text-gray-500 font-serif italic break-words">
                  {product.genericName}
                </p>
              )}
            </div>

            {/* 2. Specs Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Dosage */}
              {product.dosage && (
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-blue-100 transition-colors">
                  <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shrink-0">
                    <Pill className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      {t(translations.dosage)}
                    </p>
                    <p className="text-gray-900 font-semibold truncate">
                      {product.dosage}
                    </p>
                  </div>
                </div>
              )}

              {/* Packaging */}
              {product.packaging && (
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:border-purple-100 transition-colors">
                  <div className="p-3 bg-purple-50 text-purple-600 rounded-xl shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                      {t(translations.packaging)}
                    </p>
                    <p className="text-gray-900 font-semibold truncate">
                      {product.packaging}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 3. Indications (Rich Text) */}
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-900">
                  {t(translations.clinicalIndications)}
                </h2>
              </div>

              {/* Prose for HTML Content */}
              <div className="
                prose prose-stone max-w-none 
                prose-p:text-gray-600 prose-p:leading-relaxed
                prose-headings:text-gray-900 prose-headings:font-bold
                prose-li:text-gray-600
                prose-strong:text-gray-800
                break-words
              ">

                {indication ? (
                  <div dangerouslySetInnerHTML={{ __html: indication }} />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400 gap-2 opacity-60">
                    <Info className="w-8 h-8" />
                    <p>No detailed indications available.</p>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Symptoms / Tags */}
            {product.symptoms && product.symptoms.length > 0 && (
              <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-gray-900">
                    {t("treatsRelieves")}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-2">
                  {product.symptoms.map((symptom, index) => (
                    <span
                      key={index}
                      className="
                        inline-flex items-center px-4 py-2 rounded-xl 
                        bg-gray-50 text-gray-700 text-sm font-medium 
                        border border-gray-100 hover:bg-gray-100 hover:border-gray-200 
                        transition-colors cursor-default
                      "
                    >
                      {isEn ? symptom.nameEN : symptom.nameLA}
                    </span>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}