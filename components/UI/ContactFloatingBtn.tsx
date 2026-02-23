"use client";

import { useState } from "react";
import { MessageCircleQuestion } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { FB_LINK, WA_LINK } from "@/lib/constant";

// --- Custom Brand Icons (SVGs) ---
const FacebookIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
);

const WhatsAppIcon = () => (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
);

export default function ContactFloatingBtn() {
    const t = useTranslations();
    const [isOpen, setIsOpen] = useState(false);



    // Mobile Logic: First click opens menu, Second click navigates to /contact
    const handleMainClick = (e: React.MouseEvent) => {
        if (!isOpen) {
            e.preventDefault(); // Stop navigation to open menu first
            setIsOpen(true);
        }
        // If isOpen is true, let the Link propagate naturally
    };

    return (
        <div
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            {/* --- Satellite Buttons --- */}
            {/* Using dynamic classes based on isOpen state instead of group-hover */}
            <div
                className={`flex flex-col gap-3 transition-all duration-300 ease-out origin-bottom pb-2 ${isOpen
                    ? "opacity-100 translate-y-0 visible"
                    : "opacity-0 translate-y-10 invisible pointer-events-none"
                    }`}
            >
                {/* WhatsApp */}
                <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 pl-4 pr-5 py-2.5 bg-secondary-500 text-white rounded-full shadow-lg shadow-secondary-500/30 hover:scale-105 transition-all origin-right"
                >
                    <WhatsAppIcon />
                    <span className="font-bold text-sm">WhatsApp</span>
                </a>

                {/* Facebook */}
                <a
                    href={FB_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 pl-4 pr-5 py-2.5 bg-[#1877F2] text-white rounded-full shadow-lg shadow-blue-500/30 hover:scale-105 transition-all origin-right"
                >
                    <FacebookIcon />
                    <span className="font-bold text-sm">Facebook</span>
                </a>
            </div>

            {/* --- Main Contact Button --- */}
            <div
                className="relative flex items-center gap-3 pl-4 pr-5 py-3.5 
                   bg-linear-to-r from-primary-600 to-secondary-600 text-white 
                   rounded-full shadow-lg shadow-primary-600/30 
                   hover:shadow-primary-600/50 hover:scale-105 active:scale-95 
                   transition-all duration-300 ease-out z-10"
            >
                {/* Pulse Animation Layer */}
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-secondary-500"></span>
                </span>

                {/* Icon */}
                <div className={`relative transition-transform duration-300 ${isOpen ? 'rotate-12' : ''}`}>
                    <MessageCircleQuestion size={24} />
                </div>

                {/* Text */}
                <div className="flex flex-col items-start leading-none">
                    <span className="text-[10px] font-medium text-secondary-100 uppercase tracking-wider opacity-80 mb-0.5">
                        Support
                    </span>
                    <span className="text-sm font-bold tracking-wide">
                        {t('contact') || "Contact Us"}
                    </span>
                </div>
            </div>
        </div>
    );
}