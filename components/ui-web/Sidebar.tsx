"use client";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ChevronDown, FileText, Menu, X } from "lucide-react";
import { translations } from "@/lib/translation";
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

// 1. Add onNavigate prop to the interface
function SidebarItem({
  item,
  pathname,
  onNavigate,
}: {
  item: MenuItem;
  pathname: string;
  onNavigate?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const t = useTranslations();

  const hasActiveChild = item.children?.some(
    (child) => pathname === child.href,
  );
  const isActive = pathname === item.href || hasActiveChild;

  const Icon = ICON_MAP[item.title] || ICON_MAP.home;
  const colorTheme = COLOR_THEMES[item.title] || COLOR_THEMES.default;

  if (item.children) {
    return (
      <div>
        <button
          // 2. ONLY toggle state here, do NOT call onNavigate
          onClick={(e) => {
            e.stopPropagation(); // Good practice to prevent bubbling
            setIsOpen(!isOpen);
          }}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
            isActive
              ? `bg-gradient-to-r ${colorTheme.gradient} text-white shadow-md ${colorTheme.shadow}`
              : `text-slate-700 hover:bg-gradient-to-r ${colorTheme.hover}`
          }`}
        >
          <Icon
            className={`w-5 h-5 ${
              isActive ? "text-white" : `text-slate-500 ${colorTheme.icon}`
            }`}
          />
          <span className="flex-1 text-left text-sm font-medium">
            {t(item.title)}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>
        {isOpen && (
          <div
            className={`mt-1 ml-4 space-y-0.5 border-l-2 border-opacity-50 pl-3`}
            style={{
              borderColor: isActive ? "rgb(203 213 225)" : "rgb(226 232 240)",
            }}
          >
            {item.children.map((child) => {
              const childIsActive = pathname === child.href;
              const ChildIcon = ICON_MAP[child.title] || FileText;
              return (
                <div key={child.href} onClick={onNavigate}>
                  {/* 3. Wrap child link in a div or pass onClick to Link to close menu */}
                  <AntiSpamLink
                    href={child.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 group ${
                      childIsActive
                        ? `bg-gradient-to-r ${colorTheme.gradient} text-white shadow-sm`
                        : `text-slate-600 hover:bg-gradient-to-r ${colorTheme.hover}`
                    }`}
                  >
                    <ChildIcon
                      className={`w-4 h-4 ${
                        childIsActive
                          ? "text-white"
                          : `text-slate-400 ${colorTheme.icon}`
                      }`}
                    />
                    <span className="text-sm font-medium">
                      {t(child.title)}
                    </span>
                  </AntiSpamLink>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // 4. Single items (no children) SHOULD close the menu
  return (
    <div onClick={onNavigate}>
      <AntiSpamLink
        href={item.href!}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group ${
          isActive
            ? `bg-gradient-to-r ${colorTheme.gradient} text-white shadow-md ${colorTheme.shadow}`
            : `text-slate-700 hover:bg-gradient-to-r ${colorTheme.hover}`
        }`}
      >
        <Icon
          className={`w-5 h-5 ${
            isActive ? "text-white" : `text-slate-500 ${colorTheme.icon}`
          }`}
        />
        <span className="text-sm font-medium">{t(item.title)}</span>
      </AntiSpamLink>
    </div>
  );
}

export default function Sidebar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (status === "loading") return null;

  const { user } = session || {};
  const userRole = user?.role as string;
  const userPermissions: string[] = (user?.permissions || []) as string[];

  let menuItems: MenuItem[] = [...COMMON_PUBLIC];

  if (userRole === Role.ADMIN) {
    menuItems = [...ROLE_MENUS.ADMIN];
  } else if (userPermissions.length > 0) {
    const processedPermissions = new Set<string>();
    const finalMenus: MenuItem[] = [];

    // Object.values(DROPDOWN_GROUPS).forEach((group) => {
    //   const userHasGroupPermission = group.permissions.some((p) =>
    //     userPermissions.includes(p),
    //   );

    //   if (userHasGroupPermission) {
    //     const children = group.items
    //       .filter((item) =>
    //         item.permissions.some((p) => userPermissions.includes(p)),
    //       )
    //       .map((item) => ({
    //         title: item.title,
    //         href: item.href,
    //       }));

    //     if (children.length > 0) {
    //       finalMenus.push({
    //         title: group.title,
    //         children: children,
    //       });
    //       group.permissions.forEach((p) => processedPermissions.add(p));
    //     }
    //   }
    // });

    userPermissions.forEach((permission) => {
      if (
        !processedPermissions.has(permission) &&
        PERMISSION_MENUS[permission]
      ) {
        const menus = PERMISSION_MENUS[permission];
        if (menus.length > 0) {
          finalMenus.push(...menus);
        }
      }
    });

    menuItems = finalMenus;
  }

  if (user) {
    const baseMenus = [{ title: translations.home, href: "/back-office" }];
    const existing = new Set(
      menuItems.flatMap((m) =>
        m.href ? [m.href] : m.children?.map((c) => c.href) || [],
      ),
    );
    menuItems = [
      ...baseMenus.filter((m) => !existing.has(m.href!)),
      ...menuItems,
    ];
  }

  return (
    <>
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-primary-200 border-b border-slate-200 z-50 flex items-center justify-between px-4 md:px-6 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-white/50 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-slate-700" />
            ) : (
              <Menu className="w-6 h-6 text-slate-700" />
            )}
          </button>
          <div className="flex items-center gap-2">
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
            <span className="text-2xl font-bold text-green-900">
              CBF Pharma Co., Ltd
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 md:gap-4">
          <AuthButtons />
          <LanguageSwitcher />
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
                fixed top-16 left-0 bottom-0 w-64 
                bg-white
                border-r border-slate-200 z-40 overflow-hidden flex flex-col shadow-lg
                transition-transform duration-300 ease-in-out
                ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
                lg:translate-x-0
            `}
      >
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          {menuItems.map((item, index) => (
            // 5. REMOVE the onClick wrapper from here
            <SidebarItem
              key={index}
              item={item}
              pathname={pathname}
              // 6. Pass the close function down
              onNavigate={() => setIsMobileMenuOpen(false)}
            />
          ))}
        </div>
      </aside>

      <div className="lg:pl-64 lg:pt-16">{/* Main Content */}</div>
    </>
  );
}
