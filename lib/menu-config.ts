import {
  Home,
  LayoutDashboard,
  Users,
  Stethoscope,
  FileText,
  Pill,
  Newspaper,
  Server,
  LucideMove3d,
  Info,
} from "lucide-react";
import { translations } from "./translation";
import { Permission } from "@/generated/prisma/enums";

// Icon mapping for menu items
export const ICON_MAP: Record<string, any> = {
  home: Home,
  dashboard: LayoutDashboard,
  account: Users,
  product: Pill,
  symptom: Stethoscope,
  article: FileText,
  service: Server,
  about: Info,

  // --- Categories (Using Pill icon as requested) ---
  NUTRITION_ELECTROLYTE: Pill,
  ANTIBIOTICS: Pill,
  ANTI_PARASITIC: Pill,
  GASTROINTESTINAL: Pill,
  CARDIOVASCULAR: Pill,
  ANTI_DIABETIC: Pill,
  RESPIRATORY: Pill,
  ANTI_ALLERGIC: Pill,
  EFFECTIVE_TO_PSYCHOTIC: Pill,
  ANESTHETICS: Pill, // เพิ่มเติมจาก JSON แปลภาษา
  ANALGESIC_ANTIPYRETIC: Pill,
  VITAMINS_MINERALS: Pill,
  DISINFECTANTS_ANTISEPTIC: Pill,
  OTHERS: Pill,

  // --- Article Sub-categories ---
  NEWS: FileText,
  HEALTH_KNOWLEDGE: FileText,
  ACTIVITY: FileText,
};
// Color themes for different menu categories
export const COLOR_THEMES: Record<
  string,
  { gradient: string; hover: string; shadow: string; icon: string }
> = {
  symptom: {
    gradient: "from-primary-600 to-primary-700",
    hover: "from-primary-50 to-primary-100 text-primary-700",
    shadow: "shadow-primary-200",
    icon: "group-hover:text-primary-600",
  },
  product: {
    gradient: "from-secondary-500 to-secondary-600",
    hover: "from-secondary-50 to-secondary-100 text-secondary-700",
    shadow: "shadow-secondary-200",
    icon: "group-hover:text-secondary-600",
  },
  article: {
    gradient: "from-primary-500 to-secondary-600",
    hover: "from-secondary-50 to-secondary-100 text-primary-700",
    shadow: "shadow-secondary-200",
    icon: "group-hover:text-secondary-600",
  },
  account: {
    gradient: "from-primary-700 to-primary-800",
    hover: "from-primary-50 to-primary-100 text-primary-800",
    shadow: "shadow-primary-200",
    icon: "group-hover:text-primary-700",
  },
  default: {
    gradient: "from-primary-600 to-primary-700",
    hover: "from-primary-50 to-primary-100 text-primary-700",
    shadow: "shadow-primary-200",
    icon: "group-hover:text-primary-600",
  },
};
// Menu item type definition
export type MenuItem = {
  title: string;
  href?: string;
  children?: { title: string; href: string }[];
};

// Common public menu items
export const COMMON_PUBLIC: MenuItem[] = [
  { title: translations.home, href: "/" },
  {
    title: translations.article,
    children: [
      { title: "NEWS", href: "/cbf/articles/news" },
      {
        title: "HEALTH_KNOWLEDGE",
        href: "/cbf/articles/health-knowledge",
      },
      { title: "ACTIVITY", href: "/cbf/articles/activity" },
    ],
  },
  {
    title: translations.product,
    children: [
      {
        title: "NUTRITION_ELECTROLYTE",
        href: "/cbf/products/nutrition-electrolyte",
      },
      {
        title: "ANTIBIOTICS",
        href: "/cbf/products/antibiotics",
      },
      { title: "ANTI_PARASITIC", href: "/cbf/products/anti-parasitic" },
      { title: "GASTROINTESTINAL", href: "/cbf/products/gastrointestinal" },
      { title: "CARDIOVASCULAR", href: "/cbf/products/cardiovascular" },
      { title: "ANTI_DIABETIC", href: "/cbf/products/anti-diabetic" },
      { title: "RESPIRATORY", href: "/cbf/products/respiratory" },
      { title: "ANTI_ALLERGIC", href: "/cbf/products/anti-allergic" },
      {
        title: "EFFECTIVE_TO_PSYCHOTIC",
        href: "/cbf/products/effective-to-psychotic",
      },
      {
        title: "ANALGESIC_ANTIPYRETIC",
        href: "/cbf/products/analgesic-antipyretic",
      },
      { title: "VITAMINS_MINERALS", href: "/cbf/products/vitamins-minerals" },
      {
        title: "DISINFECTANTS_ANTISEPTIC",
        href: "/cbf/products/disinfectants-antiseptic",
      },
      { title: "OTHERS", href: "/cbf/products/others" },
    ],
  },
  { title: translations.service, href: "/cbf/service" },

  { title: translations.about, href: "/cbf/about" },
];

// Role-based menu configurations
export const ROLE_MENUS = {
  ADMIN: [
    { title: translations.dashboard, href: "/admin" },
    { title: translations.account, href: "/accounts" },
    { title: translations.product, href: "/products" },
    { title: translations.symptom, href: "/symptoms" },
    { title: translations.article, href: "/articles" },
    { title: translations.announcement, href: "/announcements" },
  ],
};

// Permission-based menu configurations
export const PERMISSION_MENUS: Record<string, MenuItem[]> = {
  [Permission.ARTICLE_VIEW]: [
    { title: translations.product, href: "/products" },
  ],
  [Permission.USER_VIEW]: [
    { title: translations.account, href: "/accounts" }
  ],
  [Permission.SYMPTOM_VIEW]: [
    { title: translations.symptom, href: "/symptoms" },
  ],
  [Permission.PRODUCT_VIEW]: [
    { title: translations.product, href: "/products" },
  ],
  [Permission.ANNOUNCEMENT_VIEW]: [
    { title: translations.announcement, href: "/announcements" },
  ],
};

// Dropdown group configurations
export const DROPDOWN_GROUPS = {
  // clinical: {
  //   title: translations.manage, // Or a new "Clinical" translation key
  //   permissions: [Permission.PRODUCT_VIEW, Permission.SYMPTOM_VIEW],
  //   items: [
  //     {
  //       permissions: [Permission.SYMPTOM_VIEW],
  //       title: translations.symptom, // Map to translations.symptom
  //       href: "/symptoms",
  //     },
  //     {
  //       permissions: [Permission.PRODUCT_VIEW],
  //       title: translations.article, // Map to translations.article
  //       href: "/products",
  //     },
  //   ],
  // },
};
