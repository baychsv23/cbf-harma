import {
  Home,
  LayoutDashboard,
  Users,
  ShoppingBag,
  Stethoscope,
  FileText,
  Pill,
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
};

// Color themes for different menu categories
export const COLOR_THEMES: Record<
  string,
  { gradient: string; hover: string; shadow: string; icon: string }
> = {
  symptom: {
    gradient: "from-purple-600 to-purple-700",
    hover: "from-purple-50 to-purple-100 text-purple-700",
    shadow: "shadow-purple-200",
    icon: "group-hover:text-purple-600",
  },
  product: {
    // Added for your new Product Page
    gradient: "from-blue-600 to-blue-700",
    hover: "from-blue-50 to-blue-100 text-blue-700",
    shadow: "shadow-blue-200",
    icon: "group-hover:text-blue-600",
  },
  article: {
    gradient: "from-emerald-600 to-emerald-700",
    hover: "from-emerald-50 to-emerald-100 text-emerald-700",
    shadow: "shadow-emerald-200",
    icon: "group-hover:text-emerald-600",
  },
  account: {
    gradient: "from-indigo-600 to-indigo-700",
    hover: "from-indigo-50 to-indigo-100 text-indigo-700",
    shadow: "shadow-indigo-200",
    icon: "group-hover:text-indigo-600",
  },
  default: {
    gradient: "from-slate-600 to-slate-700",
    hover: "from-slate-50 to-slate-100 text-slate-700",
    shadow: "shadow-slate-200",
    icon: "group-hover:text-slate-600",
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
