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
    href: "/cbf/products",
  },
  { title: translations.service, href: "/cbf/service" },
  {
    title: translations.about,
    children: [
      { title: translations.about, href: "/cbf/about" },
      {
        title: translations.organizationalChart,
        href: "/cbf/organizational-chart",
      },
      {
        title: translations.applyForWork,
        href: "https://www.facebook.com/cbfhrdept",
      },
    ],
  },
];

// Role-based menu configurations
export const ROLE_MENUS = {
  ADMIN: [
    {
      title: translations.dashboard,
      children: [
        {
          title: translations.articleDashboard,
          href: "/back-office/admin/article-dashboard",
        },
        {
          title: translations.productDashboard,
          href: "/back-office/admin/product-dashboard",
        },
      ],
    },
    { title: translations.account, href: "/back-office/accounts" },
    { title: translations.product, href: "/back-office/products" },
    { title: translations.symptom, href: "/back-office/symptoms" },
    { title: translations.article, href: "/back-office/articles" },
    { title: translations.announcement, href: "/back-office/announcements" },
  ],
};

// Permission-based menu configurations
export const PERMISSION_MENUS: Record<string, MenuItem[]> = {
  [Permission.ARTICLE_VIEW]: [
    { title: translations.article, href: "/back-office/articles" },
  ],
  [Permission.SYMPTOM_VIEW]: [
    { title: translations.symptom, href: "/back-office/symptoms" },
  ],
  [Permission.PRODUCT_VIEW]: [
    { title: translations.product, href: "/back-office/products" },
  ],
  [Permission.ANNOUNCEMENT_VIEW]: [
    { title: translations.announcement, href: "/back-office/announcements" },
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
