"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";
import { FB_LINK, WA_LINK } from "@/lib/constant";

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

export default function Footer() {
    const t = useTranslations(); // เดี๋ยวเราไปเพิ่ม key ใน json กัน
    const currentYear = new Date().getFullYear();

    return (
        // ✅ เพิ่ม lg:ml-64 เพื่อให้ Footer ขยับหลบ Sidebar เหมือนกับ Main Content
        <footer className="bg-primary text-white transition-all duration-300 lg:ml-64 border-t-4 border-accent">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {/* Column 1: Brand Info */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            {/* ใส่ Logo ของคุณตรงนี้ */}
                            <div className="w-10 h-10 relative bg-white rounded-lg flex items-center justify-center">
                                <Image
                                    src="/images/logo.svg"
                                    alt="About CBF"
                                    fill
                                    loading="eager"
                                    className="object-contain"
                                    priority
                                />
                            </div>
                            <span className="text-2xl font-bold text-accent">CBF Pharma Co., Ltd</span>
                        </div>
                        <p className="text-primary-100 text-sm leading-relaxed">
                            {t("description")}
                        </p>
                        <div className="flex gap-4 pt-2">
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
                    </div>

                    {/* Column 2: Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold text-accent mb-4 uppercase tracking-wide">
                            {t("quickLinks")}
                        </h3>
                        <ul className="space-y-2">
                            <FooterLink href="/" label={t("home")} />
                            <FooterLink href="/public/products" label={t("products")} />
                            <FooterLink href="/cbf/articles" label={t("articles")} />
                            <FooterLink href="/cbf/service" label={t("service")} />
                            <FooterLink href="/cbf/about" label={t("about")} />
                        </ul>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold text-accent mb-4 uppercase tracking-wide">
                            {t("contactUs")}
                        </h3>
                        <ul className="space-y-4 text-sm text-primary-50">
                            <li className="flex items-start gap-3">
                                <MapPin className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                                <span>
                                    {t('addressCompany')}

                                </span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="w-5 h-5 text-accent shrink-0" />
                                <a href="tel:+8562098989689" className="hover:text-accent transition-colors">
                                    +856 20 9898 9689
                                </a>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="w-5 h-5 text-accent shrink-0" />
                                <a href="mailto:info@cbfpharma.la" className="hover:text-accent transition-colors">
                                    info@cbfpharma.la
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-primary-900 py-4 border-t border-primary-800">
                <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-primary-200">
                    <p>&copy; {currentYear} CBF. All rights reserved.</p>
                    <div className="flex gap-6 mt-2 md:mt-0">
                        <Link href="#" className="hover:text-accent transition-colors">
                            {t("privacyPolicy")}
                        </Link>
                        <Link href="#" className="hover:text-accent transition-colors">
                            {t("termsOfService")}
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}

// Sub-components เพื่อลด code ซ้ำ
function FooterLink({ href, label }: { href: string; label: string }) {
    return (
        <li>
            <Link
                href={href}
                className="text-primary-100 hover:text-accent hover:pl-2 transition-all duration-300 block text-sm"
            >
                {label}
            </Link>
        </li>
    );
}

