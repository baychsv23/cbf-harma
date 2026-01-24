"use client";

import { Package, User, DollarSign } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { formatCurrency } from "@/lib/getCurrencySymbol";

import { formatDate } from "@/lib/formateTime";

import Loader from "@/components/Loader";

import { BillType, PaidType } from "@/app/generated/prisma/enums";
import { useApiWithAlert } from "@/app/hooks/useApiWithAlert";
import { useTranslations } from "next-intl";
import { translations } from "@/lib/translation";
import { useReactToPrint } from "react-to-print";
import { useAlert } from "@/app/hooks/useAlert";

interface ViewInvoiceFormProps {
  billId: number;
  onClose: () => void;
  onSuccess?: () => void;
  type: BillType;
}

export default function ViewBill({
  billId,
  onClose,
  onSuccess,
  type,
}: ViewInvoiceFormProps) {
  const t = useTranslations();
  const { user } = useAuth();
  const api = useApiWithAlert();
  const { showProcessing, closeProcessing } = useAlert()
  const [receiptService, setReceiptService] = useState<any>(null);
  const [selectedPaidStatus, setSelectedPaidStatus] = useState<
    PaidType | "all"
  >("all");
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);

  const reactToPrintFn = useReactToPrint({
    contentRef,
    pageStyle: `
    @page { 
      size: A4; 
      margin: 0mm 5mm 10mm 5mm !important; 
    }
  `,
    onBeforePrint: async () => {
      setIsPrinting(true);
    },
    onAfterPrint: () => {
      setTimeout(() => setIsPrinting(false), 1000);
    },
  });

  useEffect(() => {
    loadInvoiceData();
  }, [billId]);

  const loadInvoiceData = async () => {
    if (!billId) return;
    showProcessing()
    try {

      const { data: receiptServiceResponse } = await api.get(
        `/api/receipt-services/${billId}`
      );
      setReceiptService(receiptServiceResponse.data);
    } catch (error: any) {
      onClose();
    } finally {
      closeProcessing()
    }
  };

  // Filter invoices based on selected paid status
  const getFilteredInvoices = () => {
    if (!receiptService?.saleInvoices) return [];

    if (selectedPaidStatus === "all") {
      return receiptService.saleInvoices;
    }

    return receiptService.saleInvoices.filter(
      (invoice: any) => invoice.paidStatus === selectedPaidStatus
    );
  };

  // Calculate total amount for filtered invoices
  const getFilteredTotal = () => {
    const filteredInvoices = getFilteredInvoices();
    return filteredInvoices.reduce(
      (sum: number, invoice: any) => sum + Number(invoice.totalAmount),
      0
    );
  };

  if (!receiptService) return

  const filteredInvoices = getFilteredInvoices();
  const filteredTotal = getFilteredTotal();

  const renderInvoicesTable = (
    invoices: any[],
    total: number,
    showPaidStatus: boolean = true
  ) => (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t(translations.stt)}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t(translations.No, { name: t(translations.invoice) })}
            </th>
            {showPaidStatus && (
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                {t(translations.paymentStatus)}
              </th>
            )}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t(translations.category)}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t(translations.createdAt)}
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              {t(translations.totalAmount)}
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {invoices.map((item: any, index: any) => (
            <tr key={item.id}>
              <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-900">
                {index + 1}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                <div className="font-medium text-gray-900">
                  {item.saleInvoiceNo}
                </div>
              </td>
              {showPaidStatus && (
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-medium">
                  <span
                    className={`px-2 py-1 text-xs rounded ${item.paidStatus === PaidType.PAID
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                      }`}
                  >
                    {t(item.paidStatus)}
                  </span>
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                {t(item.set)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                {formatDate(item.createdAt)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-medium">
                {formatCurrency(item.totalAmount)}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot className="bg-gray-50">
          <tr>
            <td
              colSpan={5}
              className="px-6 py-4 text-right font-semibold text-gray-700"
            >
              {t(translations.totalAmount)}:
            </td>
            <td className="px-6 py-4 text-right font-bold text-gray-900 text-lg">
              {formatCurrency(total)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <button
                onClick={onClose}
                className="text-sm text-gray-600 hover:text-blue-600 mb-2 flex items-center gap-1"
              >
                ←{t(translations.back)}
              </button>
              <h1 className="text-3xl font-bold text-gray-800">{t(
                type === BillType.BILL_SERVICE
                  ? translations.billService
                  : translations.receiptService
              )}</h1>
              <p className="text-gray-600 mt-1">
                {t(translations.No, {
                  name: t(
                    type === BillType.BILL_SERVICE
                      ? translations.billService
                      : translations.receiptService
                  ),
                })}
                : {receiptService.subBill ? receiptService.subBill.invoiceNo : receiptService.invoiceNo}
              </p>
            </div>
            <button
              onClick={() => {
                reactToPrintFn();
              }}
              disabled={isPrinting}
              className="bg-gray-600 text-white px-4 py-2 rounded transition hover:bg-blue-600 disabled:bg-gray-400"
            >
              <span className="text-sm">🖨️</span>
              {t(isPrinting ? translations.printing : translations.print)} (A4)
            </button>
          </div>

          {/* Filter Buttons */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <button
              onClick={() => setSelectedPaidStatus("all")}
              className={`px-4 py-2 rounded transition ${selectedPaidStatus === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {t(translations.All, { name: t(translations.status) })}
            </button>
            {Object.values(PaidType).map((status) => (
              <button
                key={status}
                onClick={() => setSelectedPaidStatus(status)}
                className={`px-4 py-2 rounded transition ${selectedPaidStatus === status
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {t(status)}
              </button>
            ))}
          </div>

          {/* Invoice Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="flex items-center gap-3">
              <User className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-500">
                  {t(translations.customer)}
                </p>
                <p className="font-semibold">{receiptService.customer.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-500">
                  {t(translations.totalAmount)}
                </p>
                <p className="font-semibold">{formatCurrency(filteredTotal)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
              <Package size={20} />
              {t(translations.list)}
              {selectedPaidStatus !== "all" && (
                <span className="text-sm font-normal text-gray-600">
                  (Filtered: {t(selectedPaidStatus)})
                </span>
              )}
            </h2>
          </div>

          {renderInvoicesTable(filteredInvoices, filteredTotal, true)}
        </div>

        {/* Print Version */}
        <div className="hidden print:block" ref={contentRef}>
          {/* Header */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {/* Customer Info */}
            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl font-bold text-gray-800">
                      {"P&Safe CO.,LTD"}
                    </h1>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    ສະຖານທີ່ / Address: ບ.ສວນສະຫວັນ ມ.ປາກເຊ ຂ.ຈຳປາສັກ
                  </p>
                  <p className="text-sm text-gray-600">
                    ເບີ / Tel: 020 56628998 / 020 55351234 / 020 99954456
                  </p>
                  <p className="text-sm text-gray-600">
                    ເລກຜູ້ເສຍອາກອນ /Tax ID : 227085846-9-00
                  </p>
                </div>

                <div className="text-right">
                  <h1 className="text-xl font-semibold text-gray-700">
                    {type === BillType.BILL_SERVICE
                      ? `${t(translations.billService)} / Bill Service`
                      : `${t(translations.receiptService)} / Receipt Service`}
                  </h1>
                  {selectedPaidStatus !== "all" && (
                    <p className="text-sm text-gray-600 mt-1">
                      {t(translations.paymentStatus)}: {t(selectedPaidStatus)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-600">
                  <span className="font-semibold">
                    {t(translations.createdBy)} / Issued By :
                  </span>{" "}
                  {user?.fullName}
                </p>
              </div>
            </div>

            {/* Customer Info */}
            <div className="grid grid-cols-2 gap-6 mt-6 pt-4 border-t">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  {t(translations.customer)} / Customer :{" "}
                  {receiptService.customer.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {t(translations.address)} / Address:{" "}
                  {receiptService.customer.address || ""}
                </p>
                <p className="text-sm text-gray-600">
                  {t(translations.contact)} / Phone:{" "}
                  {receiptService.customer.phone || ""}
                </p>
                <p className="text-sm text-gray-600">
                  {t(translations.taxNumber)} / Tax ID:{" "}
                  {receiptService.customer.taxNumber || ""}
                </p>
              </div>

              <div>
                <p className="text-gray-600">
                  <span className="font-semibold">
                    {type === BillType.BILL_SERVICE
                      ? `${t(translations.No, {
                        name: t(translations.billService),
                      })} / Bill service No: `
                      : ` ${t(translations.No, {
                        name: t(translations.receiptService),
                      })} / Receipt service No: `}
                  </span>
                  {type === BillType.BILL_SERVICE ? receiptService.invoiceNo : receiptService.subBill.invoiceNo}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">
                    {" "}
                    {t(translations.date)} / Date:
                  </span>
                  {formatDate(receiptService.createdAt)}
                </p>
              </div>
            </div>
          </div>

          {/* Print Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      {t(translations.stt)} / Stt
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      {t(translations.No, { name: t(translations.invoice) })} /
                      Invoice No
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      {t(translations.category)} / Category
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      {t(translations.date)} / Date
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      {t(translations.total)} / Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInvoices.map((item: any, index: number) => (
                    <tr key={item.id}>
                      <td className="px-4 py-3 text-left text-sm text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        <div className="font-medium text-gray-900">
                          {item.saleInvoiceNo}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                        {t(item.set)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-right text-sm text-gray-900">
                        {formatCurrency(item.totalAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-3 print-footer">
            <table className="w-full">
              <tfoot className="bg-gray-50">
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-4 text-right font-semibold text-gray-700 text-base"
                  >
                    {t(translations.totalAmount)} / Total Amount:
                  </td>
                  <td className="px-4 py-4 text-right font-bold text-gray-900 text-lg">
                    {formatCurrency(filteredTotal)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Footer - Signatures */}
          <div className="bg-white rounded-lg shadow-md p-1">
            <div className="grid grid-cols-3 gap-8 mt-4">
              <div className="text-center">
                <div className="border-b-2 border-gray-300 pb-2 mb-12">
                  <p className="font-medium">Customer Signature</p>
                  <p className="text-sm text-gray-600">{t(translations.Signature, { name: t(translations.customer) })}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-b-2 border-gray-300 pb-2 mb-12">
                  <p className="font-medium">Staff Signature</p>
                  <p className="text-sm text-gray-600">{t(translations.Signature, { name: t(translations.EMPLOYEE) })}</p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-b-2 border-gray-300 pb-2 mb-12">
                  <p className="font-medium">Manager Signature</p>
                  <p className="text-sm text-gray-600">{t(translations.Signature, { name: t(translations.MANAGER) })}</p>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-4 border-t text-center text-sm text-gray-500">
              <p>Thank you for your business! / ຂອບໃຈທີ່ໃຊ້ບໍລິການ!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
