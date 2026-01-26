"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, Parallax } from "swiper/modules";
import { Dialog, Transition } from "@headlessui/react";
import { X, ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Fragment } from "react";

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

    // Ref for custom navigation & progress
    const progressCircle = useRef<SVGSVGElement>(null);
    const progressContent = useRef<HTMLSpanElement>(null);

    // ฟังก์ชันสำหรับ Progress Ring (วงกลมจับเวลา)
    const onAutoplayTimeLeft = (s: any, time: number, progress: number) => {
        if (progressCircle.current) {
            progressCircle.current.style.setProperty("--progress", `${1 - progress}`);
        }
        if (progressContent.current) {
            progressContent.current.textContent = `${Math.ceil(time / 1000)}s`;
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await api.get("/api/announcements/slide-show");
                setBanners(data.data.banners || []);

                if (data.data.announcement) {
                    const hasSeen = sessionStorage.getItem(
                        `seen_announcement_${data.data.announcement.id}`
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
            <div className="w-full h-[180px] md:h-[420px] bg-gray-100 animate-pulse rounded-2xl mx-auto max-w-[1400px] mt-6" />
        );
    }

    if (!isLoading && banners.length === 0) return null;

    return (
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-6 group">
            <div className="relative rounded-[2rem] overflow-hidden shadow-2xl shadow-blue-900/20 border border-white/60 transform transition-all hover:scale-[1.01] duration-500">
                {!isLoading && banners.length > 0 && (
                    <Swiper
                        key={banners.length}
                        modules={[Autoplay, Pagination, Navigation, Parallax]}
                        parallax={true} // ✅ เปิด Parallax Effect
                        speed={1000} // ✅ เปลี่ยนรูปช้าลงหน่อยให้ดูแพง (1 วินาที)
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
                            el: ".custom-pagination", // ใช้ Custom Pagination
                        }}
                        navigation={{
                            nextEl: ".custom-next", // ใช้ปุ่ม Next ที่เราสร้างเอง
                            prevEl: ".custom-prev", // ใช้ปุ่ม Prev ที่เราสร้างเอง
                        }}
                        onAutoplayTimeLeft={onAutoplayTimeLeft}
                        className="w-full h-[180px] sm:h-[280px] md:h-[350px] lg:h-[450px] banner-swiper relative"
                    >
                        {/* Background Gradient Overlay (Global) */}
                        <div
                            slot="container-start"
                            className="absolute inset-0 z-10 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80"
                        />

                        {banners.map((banner) => (
                            <SwiperSlide
                                key={banner.id}
                                className="relative w-full h-full overflow-hidden bg-slate-900"
                            >
                                {/* Image Container with Parallax & Ken Burns Zoom */}
                                <div
                                    className="absolute inset-0 w-full h-full"
                                    data-swiper-parallax="50%" // ✅ ภาพขยับช้ากว่า Slide จริง 50%
                                >
                                    <Image
                                        src={banner.image}
                                        alt={banner.title || "Banner"}
                                        fill
                                        className="object-cover object-center animate-ken-burns" // ✅ ใส่ Animation Zoom
                                        priority={true}
                                    />
                                </div>

                                {/* Text Content with Animation */}
                                {(banner.title || banner.description) && (
                                    <div className="absolute bottom-0 left-0 w-full z-20 p-6 md:p-12 lg:p-16 flex flex-col justify-end h-full">
                                        <div className="max-w-3xl space-y-3 md:space-y-5">
                                            <h2
                                                className="text-2xl md:text-5xl font-extrabold text-white leading-tight drop-shadow-lg opacity-0 translate-y-8 transition-all duration-700 delay-300 slide-content-title"
                                                data-swiper-parallax="-300" // ✅ ตัวหนังสือพุ่งสวนทางกับภาพ
                                            >
                                                {banner.title}
                                            </h2>
                                            <p
                                                className="text-sm md:text-lg text-gray-200 opacity-0 translate-y-8 transition-all duration-700 delay-500 slide-content-desc line-clamp-2 md:line-clamp-none font-light"
                                                data-swiper-parallax="-200"
                                            >
                                                {banner.description}
                                            </p>

                                            {/* Optional Call to Action Button */}
                                            <div className="pt-2 opacity-0 translate-y-8 transition-all duration-700 delay-700 slide-content-btn">
                                                <button className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/20 hover:bg-white text-white hover:text-blue-900 rounded-full backdrop-blur-md border border-white/30 transition-all font-semibold text-sm md:text-base group/btn">
                                                    Explore More
                                                    <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </SwiperSlide>
                        ))}

                        {/* --- Custom Controls (UI แก้วใส) --- */}

                        {/* 1. Navigation Buttons (ซ่อนใน Mobile โชว์ใน PC ตอน Hover) */}
                        <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button className="custom-prev w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-blue-900 transition-all active:scale-95 shadow-lg">
                                <ChevronLeft size={24} />
                            </button>
                        </div>
                        <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 right-4 z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button className="custom-next w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center hover:bg-white hover:text-blue-900 transition-all active:scale-95 shadow-lg">
                                <ChevronRight size={24} />
                            </button>
                        </div>

                        {/* 2. Pagination Dots (วางไว้ด้านล่างซ้าย) */}
                        <div className="custom-pagination absolute bottom-6 right-6 md:right-auto md:left-12 z-30 flex gap-2 !w-auto"></div>

                        {/* 3. Autoplay Progress Ring (วงกลมจับเวลาขวาล่าง) */}
                        <div className="autoplay-progress absolute top-6 right-6 z-30 w-10 h-10 flex items-center justify-center font-bold text-white bg-black/20 backdrop-blur-sm rounded-full border border-white/10">
                            <svg viewBox="0 0 48 48" ref={progressCircle} className="w-full h-full absolute top-0 left-0 rotate-[-90deg]">
                                <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="opacity-30" />
                                <circle
                                    cx="24"
                                    cy="24"
                                    r="20"
                                    fill="none"
                                    stroke="#fff"
                                    strokeWidth="4"
                                    className="stroke-dashoffset"
                                    style={{
                                        strokeDasharray: 125.6,
                                        strokeDashoffset: "calc(125.6px * (1 - var(--progress)))",
                                    }}
                                />
                            </svg>
                            <span ref={progressContent} className="text-[10px] relative z-10"></span>
                        </div>

                    </Swiper>
                )}
            </div>

            {/* --- Announcement Modal (อันเดิมแต่ขยายใหญ่) --- */}
            <Transition appear show={isModalOpen} as={Fragment}>
                <Dialog as="div" className="relative z-[999]" onClose={closeAnnouncement}>
                    <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0 scale-95 translate-y-4" enterTo="opacity-100 scale-100 translate-y-0" leave="ease-in duration-200" leaveFrom="opacity-100 scale-100 translate-y-0" leaveTo="opacity-0 scale-95 translate-y-4">
                                <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-2xl bg-white p-1 text-left align-middle shadow-2xl transition-all relative">
                                    <button onClick={closeAnnouncement} className="absolute top-3 right-3 z-10 p-1.5 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors backdrop-blur-md">
                                        <X size={24} />
                                    </button>
                                    <div className="relative w-full aspect-[4/3] md:aspect-[16/9]">
                                        {announcement && (
                                            <Image src={announcement.image} alt="Announcement" fill className="object-cover rounded-xl" />
                                        )}
                                    </div>
                                    {announcement?.title && (
                                        <div className="p-6 text-center">
                                            <h3 className="text-2xl font-bold text-gray-900">{announcement.title}</h3>
                                            <p className="text-base text-gray-500 mt-2">{announcement.description}</p>
                                        </div>
                                    )}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>

            {/* --- CSS Animations & Styles --- */}
            <style jsx global>{`
        /* Ken Burns Effect (Zoom ช้าๆ) */
        @keyframes ken-burns {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        .animate-ken-burns {
          animation: ken-burns 10s ease-out infinite alternate;
        }

        /* Text Reveal Logic */
        .swiper-slide-active .slide-content-title,
        .swiper-slide-active .slide-content-desc,
        .swiper-slide-active .slide-content-btn {
          opacity: 1;
          transform: translateY(0);
        }

        /* Pagination Styles */
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
          box-shadow: 0 0 10px rgba(255,255,255,0.5);
        }
      `}</style>
        </div>
    );
}