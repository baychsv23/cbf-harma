"use client";

import { useEffect, useState, useRef, Fragment } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Parallax } from "swiper/modules";
import { Dialog, Transition } from "@headlessui/react";
import { X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import { useApiWithAlert } from "@/app/hooks/useApiWithAlert";

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

  // ✅ ปรับความสูง Loading ให้ตรงกับ Banner ใหม่ (ประมาณ 450px)
  if (isLoading) {
    return (
      <div className="w-full h-[250px] md:h-[450px] bg-gray-100 animate-pulse rounded-2xl mx-auto max-w-[1400px] mt-6" />
    );
  }

  if (!isLoading && banners.length === 0) return null;

  return (
    <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 group">
      <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/60 transform transition-all hover:scale-[1.005] duration-500">
        {!isLoading && banners.length > 0 && (
          <Swiper
            key={banners.length}
            modules={[Autoplay, Pagination, Navigation, Parallax]}
            parallax={true}
            speed={1000}
            spaceBetween={0}
            slidesPerView={1}
            loop={banners.length > 1}
            autoplay={{
              delay: 3000,
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
            // ✅ แก้ไขจุดที่ 1: เอา aspect-video ออก แล้วกำหนดความสูงแบบ Responsive
            // Mobile: 280px, Tablet: 380px, Desktop: 450px (ไม่ใหญ่เกินไป)
            className="w-full h-[280px] sm:h-[380px] md:h-[450px] banner-swiper relative bg-slate-900"
          >
            {/* Background Gradient Overlay */}
            <div
              slot="container-start"
              className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"
            />

            {banners.map((banner) => (
              <SwiperSlide
                key={banner.id}
                className="relative w-full h-full overflow-hidden bg-slate-900"
              >
                {/* Image Container */}
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={banner.image}
                    alt={banner.title || "Banner"}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    // ✅ แก้ไขจุดที่ 2: ใช้ object-contain เพื่อให้เห็น "รูปเต็ม" โดยไม่โดนตัด
                    // (ถ้าอยากให้เต็มกรอบโดยยอมตัดขอบภาพบ้าง ให้เปลี่ยนเป็น object-cover)
                    className="object-contain animate-ken-burns"
                    priority={true}
                    loading="eager"
                  />
                  {/* เพิ่ม Blur Background ซ้อนด้านหลังเพื่อให้สวยงามเวลารูปไม่เต็มจอ (Optional) */}
                  <div className="absolute inset-0 -z-10 blur-xl opacity-50">
                    <Image
                      src={banner.image}
                      alt="bg-blur"
                      loading="eager"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* Text Content */}
                {(banner.title || banner.description) && (
                  <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-10 flex flex-col justify-end h-full pointer-events-none">
                    <div className="max-w-3xl space-y-2 md:space-y-4 pointer-events-auto">
                      <h2
                        className="text-xl md:text-4xl font-extrabold text-white leading-tight drop-shadow-lg opacity-0 translate-y-8 transition-all duration-700 delay-300 slide-content-title"
                        data-swiper-parallax="-300"
                      >
                        {banner.title}
                      </h2>
                      <p
                        className="text-xs md:text-base text-gray-200 opacity-0 translate-y-8 transition-all duration-700 delay-500 slide-content-desc line-clamp-2 font-light"
                        data-swiper-parallax="-200"
                      >
                        {banner.description}
                      </p>

                      <div className="pt-1 opacity-0 translate-y-8 transition-all duration-700 delay-700 slide-content-btn">
                        <button className="inline-flex items-center gap-2 px-5 py-2 bg-white/20 hover:bg-white text-white hover:text-primary rounded-full backdrop-blur-md border border-white/30 transition-all font-semibold text-xs md:text-sm group/btn">
                          Explore More
                          <ArrowRight
                            size={16}
                            className="group-hover/btn:translate-x-1 transition-transform"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </SwiperSlide>
            ))}

            {/* --- Controls --- */}
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="custom-prev w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-primary transition-all active:scale-95 shadow-lg">
                <ChevronLeft size={20} />
              </button>
            </div>
            <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="custom-next w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-primary transition-all active:scale-95 shadow-lg">
                <ChevronRight size={20} />
              </button>
            </div>

            <div className="custom-pagination absolute bottom-4 right-4 md:right-auto md:left-10 z-30 flex gap-2 !w-auto"></div>
          </Swiper>
        )}
      </div>

      {/* --- Modal Section (คงเดิมไว้) --- */}
      <Transition appear show={isModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-[999]"
          onClose={closeAnnouncement}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95 translate-y-4"
                enterTo="opacity-100 scale-100 translate-y-0"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100 translate-y-0"
                leaveTo="opacity-0 scale-95 translate-y-4"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-1 text-left align-middle shadow-2xl transition-all relative">
                  <button
                    onClick={closeAnnouncement}
                    className="absolute top-3 right-3 z-10 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md"
                  >
                    <X size={24} />
                  </button>
                  <div className="relative w-full aspect-square">
                    {announcement && (
                      <Image
                        src={announcement.image}
                        alt="Announcement"
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
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <style jsx global>{`
        @keyframes ken-burns {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          } /* ลด Zoom ลงหน่อยให้ภาพไม่ล้น */
        }
        .animate-ken-burns {
          animation: ken-burns 15s ease-out infinite alternate; /* ช้าลงให้ดูนุ่ม */
        }
        .swiper-slide-active .slide-content-title,
        .swiper-slide-active .slide-content-desc,
        .swiper-slide-active .slide-content-btn {
          opacity: 1;
          transform: translateY(0);
        }
        .custom-pagination .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.4);
          width: 32px;
          height: 4px;
          border-radius: 2px;
          transition: all 0.3s;
          opacity: 1;
        }
        .custom-pagination .swiper-pagination-bullet-active {
          background: #fff;
          width: 48px;
          box-shadow: 0 0 10px rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
