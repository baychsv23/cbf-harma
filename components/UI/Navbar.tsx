"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  FileText,
  Menu,
  X,
  Home,
} from "lucide-react";
import AuthButtons from "./AuthButtons";
import LanguageSwitcher from "./LanguageSwitcher";
import AntiSpamLink from "../AntiSpamLink";
import {
  ICON_MAP,
  COLOR_THEMES,
  ROLE_MENUS,
  PERMISSION_MENUS,
  COMMON_PUBLIC,
  type MenuItem,
} from "@/lib/menu-config";
import { Role } from "@/generated/prisma/enums";
import { usePathname } from "@/i18n/routing";
import Image from "next/image";
import { translations } from "@/lib/translation";

// ─── Dropdown Item ─────────────────────────────────────────────────────────────
function NavDropdown({
  item,
  pathname,
  onClose,
}: {
  item: MenuItem;
  pathname: string;
  onClose: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const t = useTranslations();

  const hasActiveChild = item.children?.some((c) => pathname === c.href);
  const isActive = pathname === item.href || hasActiveChild;
  const Icon = ICON_MAP[item.title] || ICON_MAP.home;
  const colorTheme = COLOR_THEMES[item.title] || COLOR_THEMES.default;

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
         className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
          isActive
            ? `bg-gradient-to-r ${colorTheme.gradient} text-white shadow-md`
            : `text-black hover:bg-white/60`
        }`}
      >
        <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-black/60"}`} />
        {t(item.title)}
        <ChevronDown
          className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
          {item.children!.map((child) => {
            const childIsActive = pathname === child.href;
            const ChildIcon = ICON_MAP[child.title] || FileText;
            return (
              <AntiSpamLink
                key={child.href}
                href={child.href}
                onClick={() => {
                  setIsOpen(false);
                  onClose();
                }}
                className={`flex items-center gap-2.5 px-3 py-2 mx-1.5 rounded-lg text-sm transition-all duration-150 ${
                  childIsActive
                    ? `bg-gradient-to-r ${colorTheme.gradient} text-white`
                    : `text-black hover:bg-slate-50`
                }`}
              >
                <ChildIcon
                  className={`w-4 h-4 ${childIsActive ? "text-white" : "text-black/60"}`}
                />
                {t(child.title)}
              </AntiSpamLink>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Single Nav Item ────────────────────────────────────────────────────────────
function NavItem({
  item,
  pathname,
  onClose,
}: {
  item: MenuItem;
  pathname: string;
  onClose: () => void;
}) {
  const t = useTranslations();
  const isActive = pathname === item.href;
  const Icon = ICON_MAP[item.title] || Home;
  const colorTheme = COLOR_THEMES[item.title] || COLOR_THEMES.default;

  return (
    <AntiSpamLink
      href={item.href!}
      onClick={onClose}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? `bg-linear-to-r ${colorTheme.gradient} text-white shadow-md`
          : `text-black hover:bg-white/60`
      }`}
    >
      <Icon className={`w-4 h-4 ${isActive ? "text-white" : "text-black"}`} />
      {t(item.title)}
    </AntiSpamLink>
  );
}

// ─── Mobile Menu Item ───────────────────────────────────────────────────────────
function MobileMenuItem({
  item,
  pathname,
  onNavigate,
}: {
  item: MenuItem;
  pathname: string;
  onNavigate: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();
  const hasActiveChild = item.children?.some((c) => pathname === c.href);
  const isActive = pathname === item.href || hasActiveChild;
  const Icon = ICON_MAP[item.title] || Home;
  const colorTheme = COLOR_THEMES[item.title] || COLOR_THEMES.default;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            isActive
              ? `bg-linear-to-r ${colorTheme.gradient} text-white shadow-md`
              : `text-black hover:bg-slate-50`
          }`}
        >
          <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-black"}`} />
          <span className="flex-1 text-left">{t(item.title)}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>
        {isOpen && (
          <div className="mt-1 ml-4 space-y-0.5 border-l-2 border-slate-200 pl-3">
            {item.children.map((child) => {
              const childIsActive = pathname === child.href;
              const ChildIcon = ICON_MAP[child.title] || FileText;
              return (
                <AntiSpamLink
                  key={child.href}
                  href={child.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-extrabold transition-all duration-200 ${
                    childIsActive
                      ? `bg-linear-to-r ${colorTheme.gradient} text-white shadow-sm`
                      : `text-slate-600 hover:bg-slate-50`
                  }`}
                >
                  <ChildIcon
                    className={`w-4 h-4 ${childIsActive ? "text-white" : "text-black"}`}
                  />
                  {t(child.title)}
                </AntiSpamLink>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  return (
    <AntiSpamLink
      href={item.href!}
      onClick={onNavigate}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
        isActive
          ? `bg-linear-to-r ${colorTheme.gradient} text-white shadow-md`
          : `text-black hover:bg-slate-50`
      }`}
    >
      <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-black/60"}`} />
      {t(item.title)}
    </AntiSpamLink>
  );
}

// ─── Main Navbar ────────────────────────────────────────────────────────────────
export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Scroll shadow effect
  useEffect(() => {
    const handler = () => setIsScrolled(window.scrollY > 4);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  if (status === "loading") return null;

  const { user } = session || {};
  const userRole = user?.role as string;
  const userPermissions: string[] = (user?.permissions || []) as string[];

  // ── Build menu (same logic as Sidebar) ──────────────────────────────────────
  let menuItems: MenuItem[] = [...COMMON_PUBLIC];

  if (userRole === Role.ADMIN) {
    menuItems = [...ROLE_MENUS.ADMIN];
  } else if (userPermissions.length > 0) {
    const processedPermissions = new Set<string>();
    const finalMenus: MenuItem[] = [];

    userPermissions.forEach((permission) => {
      if (!processedPermissions.has(permission) && PERMISSION_MENUS[permission]) {
        const menus = PERMISSION_MENUS[permission];
        if (menus.length > 0) finalMenus.push(...menus);
      }
    });

    menuItems = finalMenus;
  }

  if (user) {
    const baseMenus = [{ title: translations.home, href: "/" }];
    const existing = new Set(
      menuItems.flatMap((m) =>
        m.href ? [m.href] : m.children?.map((c) => c.href) || []
      )
    );
    menuItems = [
      ...baseMenus.filter((m) => !existing.has(m.href!)),
      ...menuItems,
    ];
  }
  // ────────────────────────────────────────────────────────────────────────────

  return (
    <>
      {/* ── Top Bar ─────────────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 bg-white transition-shadow duration-300 ${
          isScrolled ? "shadow-lg" : "shadow-sm border-b border-slate-200/60"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center h-16 gap-4">

            {/* Logo */}
            <AntiSpamLink
              href="/"
              className="flex items-center gap-2.5 shrink-0 group"
            >
              <div className="w-16 h-16 relative bg-white rounded-lg flex items-center justify-center ">
                <Image
                  src="/images/logo.svg"
                  alt="CBF Logo"
                  fill
                  loading="eager"
                  className="object-contain p-1"
                  priority
                />
              </div>
              {/* Desktop & tablet title */}
              <span className="text-sm font-bold text-black leading-tight">
ບໍລິສັດ ຊີບີເອຟ ຟາຣມາ ຈຳກັດ
                <span className="block text-xs font-normal text-black/80 tracking-wide">
                              CBF Pharma  Co., Ltd
                </span>
              </span>
            </AntiSpamLink>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center gap-1 flex-1 mx-4">
              {menuItems.map((item, index) =>
                item.children ? (
                  <NavDropdown
                    key={index}
                    item={item}
                    pathname={pathname}
                    onClose={() => {}}
                  />
                ) : (
                  <NavItem
                    key={index}
                    item={item}
                    pathname={pathname}
                    onClose={() => {}}
                  />
                )
              )}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 ml-auto">
              <div className="hidden md:flex items-center gap-2">
                <AuthButtons />
                <LanguageSwitcher />
              </div>

              {/* Mobile Hamburger */}
              <button
                onClick={() => setIsMobileOpen(!isMobileOpen)}
                className="lg:hidden p-2 hover:bg-white/50 rounded-lg transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileOpen ? (
                  <X className="w-5 h-5 text-slate-700" />
                ) : (
                  <Menu className="w-5 h-5 text-slate-700" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile Dropdown Panel ──────────────────────────────────────────── */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            isMobileOpen ? "max-h-[80vh] opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-white border-t border-slate-100 shadow-xl">
            {/* Auth & Language on mobile */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 md:hidden">
              <AuthButtons />
              <LanguageSwitcher />
            </div>

            {/* Menu Items */}
            <nav className="p-3 space-y-0.5 overflow-y-auto max-h-[60vh]">
              {menuItems.map((item, index) => (
                <MobileMenuItem
                  key={index}
                  item={item}
                  pathname={pathname}
                  onNavigate={() => setIsMobileOpen(false)}
                />
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Spacer ── push content below fixed navbar */}
      <div className="h-16" />
    </>
  );
}