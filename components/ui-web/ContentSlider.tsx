"use client";

import { useRef, Children, ReactNode, isValidElement } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import { ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/pagination";

interface ContentSliderProps {
  children: ReactNode;
  breakpoints?: Record<number, { slidesPerView: number; spaceBetween: number }>;
}

export default function ContentSlider({ children, breakpoints }: ContentSliderProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  // default breakpoints for 5 items (Products)
  const defaultBreakpoints = {
    320: { slidesPerView: 1.15, spaceBetween: 12 },
    640: { slidesPerView: 2.2, spaceBetween: 16 },
    1024: { slidesPerView: 4, spaceBetween: 24 },
    1280: { slidesPerView: 5, spaceBetween: 24 },
  };

  const childArray = Children.toArray(children).filter(isValidElement);

  return (
    <div className="relative group w-full content-slider-wrapper">
      <Swiper
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        modules={[Pagination]}
        spaceBetween={16}
        slidesPerView={1.15}
        breakpoints={breakpoints || defaultBreakpoints}
        pagination={{
          clickable: true,
        }}
        className="w-full pb-10!"
      >
        {childArray.map((child, idx) => (
          <SwiperSlide key={idx} className="!h-auto flex flex-col stretch-slide">
            {child}
          </SwiperSlide>
        ))}

      </Swiper>

      {/* Navigation */}
      <button
        onClick={() => swiperRef.current?.slidePrev()}
        className="hidden sm:flex absolute top-1/2 -translate-y-1/2 -left-5 z-40 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50 cursor-pointer"
      >
        <ChevronLeft size={22} className="text-gray-700" />
      </button>
      <button
        onClick={() => swiperRef.current?.slideNext()}
        className="hidden sm:flex absolute top-1/2 -translate-y-1/2 -right-5 z-40 w-10 h-10 rounded-full bg-white shadow-lg border border-gray-100 items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-gray-50 cursor-pointer"
      >
        <ChevronRight size={22} className="text-gray-700" />
      </button>

      <style jsx global>{`
        .stretch-slide {
          height: auto !important;
          display: flex !important;
          flex-direction: column !important;
        }
        .content-slider-wrapper .swiper-pagination {
          bottom: 0px !important;
        }
        .content-slider-wrapper .swiper-pagination-bullet {
          background: #ccc;
          width: 8px;
          height: 8px;
          transition: all 0.3s;
          cursor: pointer;
          opacity: 1;
        }
        .content-slider-wrapper .swiper-pagination-bullet-active {
          background: #006b3d;
          width: 24px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
