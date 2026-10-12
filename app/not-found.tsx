import Link from "next/link";
import Image from "next/image";
import { Home, ArrowLeft, Package, Newspaper, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 bg-gradient-to-br from-emerald-50/60 via-white to-primary-50/40 overflow-hidden font-sans">
      {/* Decorative ambient background glows */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 sm:w-[520px] h-96 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 right-10 w-80 h-80 rounded-full bg-secondary-200/30 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-20 w-72 h-72 rounded-full bg-amber-100/30 blur-3xl pointer-events-none" />

      {/* Main card */}
      <div className="relative z-10 w-full max-w-xl mx-auto">
        <div className="rounded-3xl border border-emerald-100/80 bg-white/90 backdrop-blur-md shadow-2xl shadow-emerald-950/5 p-6 sm:p-10 text-center">
          {/* CBF Logo */}
          <div className="flex justify-center mb-6">
            <Link
              href="/"
              className="inline-flex items-center gap-2 p-2 rounded-2xl hover:bg-emerald-50/80 transition"
            >
              <Image
                src="/images/logo.png"
                alt="CBF Pharma"
                width={140}
                height={50}
                priority
                className="h-10 sm:h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Badge */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/70 text-emerald-800 text-xs sm:text-sm font-semibold tracking-wide mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            404 • Page Not Found
          </div>

          {/* Big Gradient 404 */}
          <div className="relative my-2 select-none">
            <h1 className="text-7xl sm:text-9xl font-black tracking-tight bg-gradient-to-r from-emerald-700 via-primary-600 to-secondary-500 bg-clip-text text-transparent drop-shadow-sm">
              404
            </h1>
          </div>

          {/* Title & Description (Bilingual Lao / English) */}
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
            ບໍ່ພົບໜ້າທີ່ທ່ານຕ້ອງການ
          </h2>
          <p className="text-xs sm:text-sm font-medium text-emerald-700/80 mt-0.5">
            Oops! The page you are looking for does not exist.
          </p>

          <p className="mt-3 text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
            ໜ້າເວັບທີ່ທ່ານກຳລັງຊອກຫາອາດຈະຖືກຍ້າຍ, ລຶບ ຫຼື ບໍ່ມີຢູ່ໃນລະບົບ
            ກະລຸນາກວດສອບ URL ອີກຄັ້ງ ຫຼື ກັບຄືນສູ່ໜ້າຫຼັກ
          </p>

          {/* Actions */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center items-center">
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-primary-600 px-6 py-3 text-white text-sm font-medium hover:bg-primary-700 active:scale-[0.98] shadow-md shadow-primary-900/10 transition-all"
            >
              <Home size={17} />
              <span>ກັບຄືນໜ້າຫຼັກ (Home)</span>
            </Link>

            <Link
              href="/lo/cbf/products"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-gray-50/80 px-6 py-3 text-gray-700 text-sm font-medium hover:bg-gray-100 hover:text-gray-900 active:scale-[0.98] transition-all"
            >
              <Package size={17} />
              <span>ເບິ່ງສິນຄ້າ (Products)</span>
            </Link>
          </div>

          {/* Helpful Quick Links */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 font-medium mb-3">
              ລິ້ງທີ່ເປັນປະໂຫຍດ (Quick Links)
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-emerald-800">
              <Link
                href="/lo/cbf/articles/news"
                className="inline-flex items-center gap-1 hover:underline hover:text-primary-600"
              >
                <Newspaper size={13} />
                ຂ່າວສານ & ກິດຈະກຳ
              </Link>
              <span className="text-gray-300">•</span>
              <Link
                href="/lo/cbf/about"
                className="inline-flex items-center gap-1 hover:underline hover:text-primary-600"
              >
                <HelpCircle size={13} />
                ກ່ຽວກັບພວກເຮົາ
              </Link>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} CBF Pharma Co., Ltd. All rights reserved.
        </p>
      </div>
    </div>
  );
}
