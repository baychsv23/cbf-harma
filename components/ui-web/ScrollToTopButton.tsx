"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTopButton() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 300) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility, { passive: true });
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <button
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={`fixed bottom-6 left-6 z-40 flex items-center justify-center w-12 h-12 
                  bg-white text-primary-600 border border-primary-200
                  rounded-full shadow-lg hover:bg-primary-50 hover:scale-110 active:scale-95
                  transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
                  ${isVisible ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-10 invisible pointer-events-none"}`}
        >
            <ChevronUp size={24} strokeWidth={2.5} />
        </button>
    );
}
