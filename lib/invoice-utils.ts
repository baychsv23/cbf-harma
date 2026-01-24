import { BillType, InvoiceType, RunningType } from "@/app/generated/prisma/enums";

/**
 * Get invoice prefix based on type
 * 
 * @param type - Invoice type or Bill type
 * @returns Prefix string (e.g., "IN", "QU", "BL", "RC", "EX")
 */
export function getInvoicePrefix(
    type: RunningType
): string {
    switch (type) {
        case RunningType.SALE_INVOICE:
            return "IN";
        case RunningType.QUOTATION:
            return "QU";
        case RunningType.BILL_SERVICE:
            return "BL";
        case RunningType.RECEIPT_SERVICE:
            return "RC";
        case RunningType.EXPORT_INVOICE:
            return "EX";
        case RunningType.SHIPMENT_ONLINE_PACKAGE:
            return "SO"
        default:
            return "UN"; // Unknown
    }
}


export function formatDateString(date: Date): string {
    return date.toISOString().split("T")[0].replace(/-/g, "");
}

export function generateInvoiceNumber(
    type: RunningType,
    date: Date,
    runningNo: number
): string {
    const prefix = getInvoicePrefix(type);
    const dateStr = formatDateString(date);
    const paddedNo = String(runningNo).padStart(4, "0");
    return `${prefix}${dateStr}-${paddedNo}`;
}
