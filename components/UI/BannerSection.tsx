"use client";

import { useEffect, useState, Fragment } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Parallax } from "swiper/modules";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useApiWithAlert } from "@/app/hooks/useApiWithAlert";
import cloudinaryLoader from "../cloudinary-loader";

interface Announcement {
  id: string;
  image: string;
  title?: string;
  description?: string;
}

export default function BannerSection() {
  const api = useApiWithAlert();
  const [banners, setBanners] = useState<Announcement[]>([]);
  const [announcement, setAnnouncement] = useState<Announcement | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get("/api/announcements/slide-show");
        setBanners(data.data.banners || []);

        if (data.data.announcement) {
          const hasSeen = sessionStorage.getItem(
            `seen_announcement_${data.data.announcement.id}`,
          );
          if (!hasSeen) {
            setAnnouncement(data.data.announcement);
            setIsModalOpen(true);
          }
        }
      } catch (error) {
        console.error("Failed to fetch banners:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const closeAnnouncement = () => {
    setIsModalOpen(false);
    if (announcement) {
      sessionStorage.setItem(`seen_announcement_${announcement.id}`, "true");
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-50 md:h-75 bg-gray-100 animate-pulse rounded-2xl mx-auto max-w-7xl mt-6 px-4" />
    );
  }

  if (!isLoading && banners.length === 0) return null;

  return (
    <div className="w-full max-w-6xl mx-auto mt-6 group">
      <div className="relative px-4 sm:px-6 lg:px-8">
        <Swiper
          key={banners.length}
          modules={[Autoplay, Pagination, Navigation, Parallax]}
          parallax={true}
          speed={800}
          centeredSlides={true}
          breakpoints={{
            // ✅ Mobile: slidesPerView=1 เต็มจอ ไม่มี peek ป้องกัน overflow
            320: { slidesPerView: 1, spaceBetween: 12 },
            // ✅ Tablet+: เริ่ม peek ซ้าย-ขวา
            640: { slidesPerView: 1.15, spaceBetween: 16 },
            1024: { slidesPerView: 1.4, spaceBetween: 24 },
          }}
          loop={banners.length > 1}
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          pagination={{
            clickable: true,
            el: ".custom-pagination",
          }}
          navigation={{
            nextEl: ".custom-next",
            prevEl: ".custom-prev",
          }}
          // ✅ KEY FIX: ลบ overflow:visible ออก — ใช้ hidden แทนเพื่อป้องกัน div ล้น mobile
          style={{ overflow: "hidden" }}
          className="w-full pb-10!"
        >
          {banners.map((banner) => (
            <SwiperSlide
              key={banner.id}
              className="transition-all duration-500"
            >
              {({ isActive }) => (
                <div
                  className={`relative aspect-video w-full overflow-hidden rounded-2xl shadow-md border border-gray-100 bg-white transition-all duration-500 ease-in-out ${
                    isActive ? "scale-100 opacity-100" : "scale-95 opacity-50"
                  }`}
                >
                  <Image
                    loader={cloudinaryLoader}
                    src={banner.image}
                    alt={banner.title || "Banner"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 70vw"
                    className="object-cover"
                    priority={true}
                  />

                  {(banner.title || banner.description) && isActive && (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
                      <h3 className="text-white font-bold text-base md:text-lg line-clamp-2 drop-shadow-md">
                        {banner.title}
                      </h3>
                    </div>
                  )}
                </div>
              )}
            </SwiperSlide>
          ))}

          {/* Pagination dots */}
          <div className="custom-pagination absolute bottom-0 left-1/2 -translate-x-1/2 z-30 flex gap-2" />

          {/* ✅ Navigation ซ่อนบน mobile (hidden sm:flex) เพราะพื้นที่แคบเกินไป */}
          <button className="custom-prev hidden sm:flex absolute top-1/2 -translate-y-[calc(50%+20px)] left-0 z-40 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50 cursor-pointer">
            <ChevronLeft size={22} className="text-gray-700" />
          </button>
          <button className="custom-next hidden sm:flex absolute top-1/2 -translate-y-[calc(50%+20px)] right-0 z-40 w-10 h-10 md:w-11 md:h-11 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50 cursor-pointer">
            <ChevronRight size={22} className="text-gray-700" />
          </button>
        </Swiper>
      </div>

      {/* --- Modal --- */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog as="div" className="relative z-999" onClose={closeAnnouncement}>
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95 translate-y-4"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-4"
              >
                <DialogPanel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-1 text-left align-middle shadow-2xl transition-all relative">
                  <button
                    onClick={closeAnnouncement}
                    className="absolute top-3 right-3 z-10 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md cursor-pointer"
                  >
                    <X size={24} />
                  </button>
                  <div className="relative w-full aspect-square">
                    {announcement && (
                      <Image
                        loader={cloudinaryLoader}
                        src={announcement.image}
                        alt="Announcement"
                        loading="eager"
                        fill
                        className="object-cover rounded-xl"
                      />
                    )}
                  </div>
                  {announcement?.title && (
                    <div className="p-6 text-center">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {announcement.title}
                      </h3>
                      <p className="text-base text-gray-500 mt-2">
                        {announcement.description}
                      </p>
                    </div>
                  )}
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>

      <style jsx global>{`
        .custom-pagination .swiper-pagination-bullet {
          background: #ccc;
          width: 8px;
          height: 8px;
          transition: all 0.3s;
          cursor: pointer;
          opacity: 1;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: #006b3d;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
