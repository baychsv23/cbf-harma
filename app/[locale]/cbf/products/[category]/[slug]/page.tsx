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
} from "lucide-react";
import { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";
import { isEnglish } from "@/lib/utils/locale";
import { ProductCBF } from "@/lib/interface";
// You might need to create this getter similar to getArticleBySlug
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

  // Assuming you have a similar getter for products
  const product = await getProductBySlug(slug, {
    where: { isActive: BooleanState.TRUE },
    select: selectDataOfProduct, // Or isActive: "TRUE" based on your schema
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
    // Add your prisma select logic here if needed
    // select: selectDataOfProduct
  })) as ProductCBF;

  // 3. Handle 404
  if (!product) {
    notFound();
  }

  // Helpers
  const name = isEnglish(locale) ? product.nameEN : product.nameLA;
  const indication = isEnglish(locale)
    ? product.indicationEN
    : product.indicationLA;

  // Format Category for display

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Back Button */}
        <Link
          href="/cbf/products" // Change to your actual product listing path
          className="inline-flex items-center text-gray-500 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Products
        </Link>

        {/* Top Section: Image & Key Info */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row">
            {/* Left: Product Image */}
            <div className="w-full md:w-2/5 bg-gray-50/50 relative min-h-[350px] md:min-h-[500px] flex items-center justify-center p-6 md:p-10 border-b md:border-b-0 md:border-r border-gray-100 group overflow-hidden">

              {/* --- 1. Badges Area (แก้เรื่องทับกัน) --- */}
              <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-2">
                {/* Main Category */}
                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-white border border-gray-200 text-xs font-bold uppercase tracking-wider text-gray-900 shadow-sm">
                  {t(product.category)}
                </span>

                {/* Sub Category (เช็คก่อนว่ามีค่าไหม) */}
                {product.categorySub !== CategorySub.NONE && (
                  <span className="inline-flex items-center px-3 py-1 rounded-lg bg-primary/10 border border-primary/10 text-xs font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-sm">
                    {t(product.categorySub)}
                  </span>
                )}
              </div>

              {/* --- 2. Image Area --- */}
              {product.productImage ? (
                <div className="relative w-full h-full min-h-[280px] md:min-h-[350px]">
                  <Image
                    src={product.productImage}
                    alt={name} // ตรวจสอบว่าตัวแปร name มีค่าถูกส่งมานะครับ
                    fill
                    className="object-contain drop-shadow-sm transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, 40vw"
                    priority
                  />
                </div>
              ) : (
                /* กรณีไม่มีรูป */
                <div className="flex flex-col items-center justify-center text-gray-300 gap-3">
                  <div className="p-4 rounded-full bg-gray-100">
                    <Package className="w-10 h-10 opacity-50" />
                  </div>
                  <span className="text-sm font-medium">No Image Available</span>
                </div>
              )}

              {/* (Optional) Decoration: ปุ่มขยายรูป หรือลายน้ำจางๆ */}
              {/* <div className="absolute bottom-4 right-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity">
       <ZoomIn className="w-5 h-5" />
  </div> */}
            </div>

            {/* Right: Product Details */}
            <div className="w-full md:w-3/5 p-6 md:p-10 flex flex-col">
              {/* Prescription Warning */}
              {product.isPrescription === BooleanState.TRUE ? (
                <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold w-fit mb-4 border border-red-100">
                  <AlertTriangle className="w-4 h-4" />
                  Prescription Required (Rx Only)
                </div>
              ) : (
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold w-fit mb-4 border border-green-100">
                  <ShieldCheck className="w-4 h-4" />
                  Over-the-Counter (OTC)
                </div>
              )}

              {/* Names */}
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {name}
              </h1>
              {product.genericName && (
                <p className="text-lg text-gray-500 italic mb-6 font-serif">
                  ({product.genericName})
                </p>
              )}

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {product.dosage && (
                  <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100">
                    <div className="flex items-center gap-2 text-blue-700 mb-1">
                      <Pill className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase">
                        Dosage
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {product.dosage}
                    </p>
                  </div>
                )}
                {product.packaging && (
                  <div className="p-3 bg-purple-50/50 rounded-xl border border-purple-100">
                    <div className="flex items-center gap-2 text-purple-700 mb-1">
                      <Package className="w-4 h-4" />
                      <span className="text-xs font-bold uppercase">
                        Packaging
                      </span>
                    </div>
                    <p className="text-gray-900 font-medium">
                      {product.packaging}
                    </p>
                  </div>
                )}
              </div>

              {/* Symptoms Tag Cloud (If any) */}
              {product.symptoms && product.symptoms.length > 0 && (
                <div className="mt-auto">
                  <p className="text-sm text-gray-500 mb-2 font-medium">
                    Treats / Relieves:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.symptoms.map((symptom, index) => (
                      <span key={index} className="inline-flex items-center px-3 py-1 rounded-full bg-gray-100 text-gray-600 text-sm">
                        <Stethoscope className="w-3 h-3 mr-1.5 text-primary" />
                        {isEnglish(locale)
                          ? symptom.nameEN
                          : symptom.nameLA}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Indications / Details */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 md:p-10">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <ShieldCheck className="w-5 h-5 text-primary" />
            {t(translations.indication)}
          </h2>

          <div className="prose prose-blue max-w-none text-gray-700 leading-relaxed">
            {indication ? (
              <div dangerouslySetInnerHTML={{ __html: indication }} />
            ) : (
              <p className="text-gray-500">No indications available.</p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
