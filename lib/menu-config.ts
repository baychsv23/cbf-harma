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
} from "lucide-react";
import { translations } from "./translation";

// Icon mapping for menu items
export const ICON_MAP: Record<string, any> = {
    home: Home,
    dashboard: LayoutDashboard,
    taxFinancial: DollarSign,
    exportFinance: Truck,
    account: Users,
    customer: UserCircle,
    saleInvoice: FileText,
    invoice: FileCheck,
    quotation: FileSpreadsheet,
    bill: Receipt,
    billService: Receipt,
    receiptService: FileOutput,
    productManagement: Package,
    brand: Tag,
    unitPack: Box,
    product: ShoppingBag,
    service: PieChart,
    supplier: Truck,
    exchangeRate: DollarSign,
    pricingRule: PieChart,
    goodsReceipt: FileText,
    export: FileOutput,
    onlinePackage: Package
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
    dashboard: {
        gradient: "from-blue-600 to-blue-700",
        hover: "hover:from-blue-50 hover:to-blue-100 hover:text-blue-700",
        shadow: "shadow-blue-200",
        icon: "group-hover:text-blue-600",
    },
    account: {
        gradient: "from-indigo-600 to-indigo-700",
        hover: "hover:from-indigo-50 hover:to-indigo-100 hover:text-indigo-700",
        shadow: "shadow-indigo-200",
        icon: "group-hover:text-indigo-600",
    },
    customer: {
        gradient: "from-cyan-600 to-cyan-700",
        hover: "hover:from-cyan-50 hover:to-cyan-100 hover:text-cyan-700",
        shadow: "shadow-cyan-200",
        icon: "group-hover:text-cyan-600",
    },
    saleInvoice: {
        gradient: "from-emerald-600 to-emerald-700",
        hover: "hover:from-emerald-50 hover:to-emerald-100 hover:text-emerald-700",
        shadow: "shadow-emerald-200",
        icon: "group-hover:text-emerald-600",
    },
    bill: {
        gradient: "from-amber-600 to-amber-700",
        hover: "hover:from-amber-50 hover:to-amber-100 hover:text-amber-700",
        shadow: "shadow-amber-200",
        icon: "group-hover:text-amber-600",
    },
    productManagement: {
        gradient: "from-pink-600 to-pink-700",
        hover: "hover:from-pink-50 hover:to-pink-100 hover:text-pink-700",
        shadow: "shadow-pink-200",
        icon: "group-hover:text-pink-600",
    },
    service: {
        gradient: "from-violet-600 to-violet-700",
        hover: "hover:from-violet-50 hover:to-violet-100 hover:text-violet-700",
        shadow: "shadow-violet-200",
        icon: "group-hover:text-violet-600",
    },
    supplier: {
        gradient: "from-orange-600 to-orange-700",
        hover: "hover:from-orange-50 hover:to-orange-100 hover:text-orange-700",
        shadow: "shadow-orange-200",
        icon: "group-hover:text-orange-600",
    },
    exchangeRate: {
        gradient: "from-teal-600 to-teal-700",
        hover: "hover:from-teal-50 hover:to-teal-100 hover:text-teal-700",
        shadow: "shadow-teal-200",
        icon: "group-hover:text-teal-600",
    },
    pricingRule: {
        gradient: "from-rose-600 to-rose-700",
        hover: "hover:from-rose-50 hover:to-rose-100 hover:text-rose-700",
        shadow: "shadow-rose-200",
        icon: "group-hover:text-rose-600",
    },
    goodsReceipt: {
        gradient: "from-sky-600 to-sky-700",
        hover: "hover:from-sky-50 hover:to-sky-100 hover:text-sky-700",
        shadow: "shadow-sky-200",
        icon: "group-hover:text-sky-600",
    },
    export: {
        gradient: "from-fuchsia-600 to-fuchsia-700",
        hover: "hover:from-fuchsia-50 hover:to-fuchsia-100 hover:text-fuchsia-700",
        shadow: "shadow-fuchsia-200",
        icon: "group-hover:text-fuchsia-600",
    },
    onlinePackage: {
        gradient: "from-sky-600 to-sky-700",
        hover: "hover:from-sky-50 hover:to-sky-100 hover:text-sky-700",
        shadow: "shadow-sky-200",
        icon: "group-hover:text-sky-600",
    }
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
            children: [
                { title: translations.taxFinancial, href: `/admin/tax-financial` },
                { title: translations.exportFinance, href: `/admin/export-finance` },
                { title: translations.shipmentFinance, href: `/admin/shipment-finance` },
            ],
        },
        { title: translations.account, href: "/accounts" },
        { title: translations.customer, href: "/customers" },
        { title: translations.supplier, href: "/suppliers" },
        { title: translations.service, href: "/services" },
        {
            title: translations.saleInvoice,
            children: [
                { title: translations.invoice, href: `/invoices` },
                { title: translations.quotation, href: `/quotations` },
            ],
        },
        {
            title: translations.bill,
            children: [
                { title: translations.billService, href: `/bill-services` },
                { title: translations.receiptService, href: `/receipt-services` },
            ],
        },

        {
            title: translations.productManagement,
            children: [
                { title: translations.brand, href: "/brands" },
                { title: translations.unitPack, href: "/unit-packs" },
                { title: translations.product, href: "/products" },
            ],
        },


        { title: translations.exchangeRate, href: "/exchange-rates" },
        { title: translations.pricingRule, href: "/pricing-rules" },
        { title: translations.goodsReceipt, href: "/goods-receipts" },
        { title: translations.export, href: "/export-invoices" },
        { title: translations.onlinePackage, href: "/online-packages" },
        { title: translations.shipment, href: "/shipments" }
    ],
    USER: [{ title: translations.onlinePackage, href: "/shopping-online" },]
};

// Permission-based menu configurations
export const PERMISSION_MENUS: Record<string, MenuItem[]> = {
    CUSTOMER_VIEW: [{ title: translations.customer, href: "/customers" }],
    SUPPLIER_VIEW: [{ title: translations.supplier, href: "/suppliers" }],
    USER_VIEW: [{ title: translations.account, href: "/accounts" }],
    SERVICE_VIEW: [{ title: translations.service, href: "/services" }],

    EXCHANGE_RATE_VIEW: [
        { title: translations.exchangeRate, href: "/exchange-rates" },
    ],
    PRICING_RULE_VIEW: [
        { title: translations.pricingRule, href: "/pricing-rules" },
    ],
    ONLINE_PACKAGE_VIEW: [{ title: translations.onlinePackage, href: "/online-packages" }],
    SHIPMENT_VIEW: [{ title: translations.shipment, href: "/shipments" }],
    GOODS_RECEIPT_VIEW: [{ title: translations.goodsReceipt, href: "/goods-receipts" }],
    EXPORT_VIEW: [{ title: translations.export, href: "/export-invoices" }],
};

// Dropdown group configurations
export const DROPDOWN_GROUPS = {
    productManagement: {
        title: translations.productManagement,
        permissions: ["BRAND_VIEW", "UNIT_PACK_VIEW", "PACK_VIEW", "PRODUCT_VIEW"],
        items: [
            {
                permissions: ["BRAND_VIEW"],
                title: translations.brand,
                href: "/brands",
            },
            {
                permissions: ["UNIT_PACK_VIEW"],
                title: translations.unitPack,
                href: "/unit-packs",
            },
            {
                permissions: ["PRODUCT_VIEW"],
                title: translations.product,
                href: "/products",
            },
        ],
    },
    bill: {
        title: translations.bill,
        permissions: ["BILL_SERVICE_VIEW", "RECEIPT_SERVICE_VIEW"],
        items: [
            {
                permissions: ["BILL_SERVICE_VIEW"],
                title: translations.billService,
                href: "/bill-services",
            },
            {
                permissions: ["RECEIPT_SERVICE_VIEW"],
                title: translations.receiptService,
                href: "/receipt-services",
            },
        ],
    },
    saleInvoice: {
        title: translations.saleInvoice,
        permissions: ["INVOICE_VIEW", "QUOTATION_VIEW"],
        items: [
            {
                permissions: ["INVOICE_VIEW"],
                title: translations.invoice,
                href: "/invoices",
            },
            {
                permissions: ["QUOTATION_VIEW"],
                title: translations.quotation,
                href: "/quotations",
            },
        ],
    },
};
