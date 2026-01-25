import {
  Home,
  LayoutDashboard,
  Users,
  UserCircle,
  FileText,
  FileCheck,
  Receipt,
  FileSpreadsheet,
  Package,
  Tag,
  Box,
  ShoppingBag,
  Truck,
  DollarSign,
  PieChart,
  FileOutput,
  Warehouse,
  ShoppingCart,
} from "lucide-react";
import { translations } from "./translation";
import { Permission } from "@/generated/prisma/enums";

// Icon mapping for menu items
export const ICON_MAP: Record<string, any> = {
  home: Home,
  dashboard: LayoutDashboard,
  account: Users,
  product: ShoppingBag,
  productManagement: Package,
};

// Color themes for different menu categories
export const COLOR_THEMES: Record<
  string,
  { gradient: string; hover: string; shadow: string; icon: string }
> = {
  home: {
    gradient: "from-purple-600 to-purple-700",
    hover: "hover:from-purple-50 hover:to-purple-100 hover:text-purple-700",
    shadow: "shadow-purple-200",
    icon: "group-hover:text-purple-600",
  },
  admin: {
    gradient: "from-indigo-600 to-indigo-700",
    hover: "hover:from-indigo-50 hover:to-indigo-100 hover:text-indigo-700",
    shadow: "shadow-indigo-200",
    icon: "group-hover:text-indigo-600",
  },
  default: {
    gradient: "from-slate-600 to-slate-700",
    hover: "hover:from-slate-50 hover:to-slate-100 hover:text-slate-700",
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
    { title: translations.category, href: "/categories" },

    { title: translations.product, href: "/products" },
  ]
};

// Permission-based menu configurations
export const PERMISSION_MENUS: Record<string, MenuItem[]> = {
  [Permission.PRODUCT_VIEW]: [
    { title: translations.product, href: "/products" },
  ],
};

// Dropdown group configurations
export const DROPDOWN_GROUPS = {
  productManagement: {
    title: translations.product,
    permissions: ["BRAND_VIEW", "UNIT_PACK_VIEW", "PACK_VIEW", "PRODUCT_VIEW"],
    items: [
      {
        permissions: ["BRAND_VIEW"],
        title: translations.product,
        href: "/brands",
      },
      {
        permissions: ["UNIT_PACK_VIEW"],
        title: translations.product,
        href: "/",
      },
      {
        permissions: ["UNIT_PACK_VIEW"],
        title: translations.product,
        href: "/accounting",
      },
    ],
  },
};
