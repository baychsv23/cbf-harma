import {
  Home,
  LayoutDashboard,
  Users,
  ShoppingBag,
  Stethoscope,
  FileText,
  Pill,
  Newspaper,
} from "lucide-react";
import { translations } from "./translation";
import { Permission } from "@/generated/prisma/enums";

// Icon mapping for menu items
export const ICON_MAP: Record<string, any> = {
  home: Home,
  dashboard: LayoutDashboard,
  account: Users,
  product: Pill, // Changed to Pill for pharma
  symptom: Stethoscope,
  article: FileText,
  news: Newspaper
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
    children:
      [{ title: translations.news, href: "/cbf/articles/news" },
      { title: translations.healthKnowLedge, href: "/cbf/articles/health-knowledge" },
      { title: translations.activity, href: "/cbf/articles/activities" }],
  },
  { title: translations.product, href: "/cbf/products" },
  { title: translations.service, href: "/cbf/service" },


  { title: translations.about, href: "/cbf/about" },
];

// Role-based menu configurations
export const ROLE_MENUS = {
  ADMIN: [
    {
      title: translations.dashboard,
      children: [{ title: translations.dashboard, href: "/admin" }],
    },
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
    { title: translations.account, href: "/accounts" },
  ],
  [Permission.SYMPTOM_VIEW]: [
    { title: translations.symptom, href: "/symptoms" },
  ],
  [Permission.PRODUCT_VIEW]: [
    { title: translations.product, href: "/products" },
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


