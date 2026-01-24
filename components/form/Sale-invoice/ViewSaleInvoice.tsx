"use client";

import { Package, User, DollarSign } from "lucide-react";
import { use, useEffect, useRef, useState } from "react";
import { useAuth } from "@/app/hooks/useAuth";
import { formatCurrency } from "@/lib/getCurrencySymbol";

import { formatDate } from "@/lib/formateTime";

import Loader from "@/components/Loader";
import { Group, InvoiceType } from "@/app/generated/prisma/enums";
import { useApiWithAlert } from "@/app/hooks/useApiWithAlert";
import { translations } from "@/lib/translation";
import { useTranslations } from "next-intl";
import { useReactToPrint } from "react-to-print";
import { useAlert } from "@/app/hooks/useAlert";
// Define the Group enum

interface ViewInvoiceFormProps {
  invoiceId: number;
  onClose: () => void;
  onSuccess?: () => void;
  type: InvoiceType;
}

export default function ViewSaleInvoice({
  invoiceId,
  onClose,
  onSuccess,
  type,
}: ViewInvoiceFormProps) {
  const { user } = useAuth();
  const api = useApiWithAlert();
  const t = useTranslations();
  const date = new Date();
  const [invoice, setInvoice] = useState<any>(null);
  const [selectedGroup, setSelectedGroup] = useState<Group | "all">("all");
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const { showProcessing, closeProcessing } = useAlert();

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
  }, [invoiceId]);

  const loadInvoiceData = async () => {
    if (!invoiceId) return;

    try {
      showProcessing();
      const { data: invoiceResponse } = await api.get(
        `/api/sale-invoices/${invoiceId}`
      );
      setInvoice(invoiceResponse.data);
    } catch (error: any) {
      onClose();
    } finally {
      closeProcessing();
    }
  };

  // Filter services based on selected group
  const getFilteredServices = () => {
    if (!invoice?.saleInvoiceServices) return [];

    if (selectedGroup === "all") {
      return invoice.saleInvoiceServices;
    }

    return invoice.saleInvoiceServices.filter(
      (item: any) => item.service.group === selectedGroup
    );
  };

  // Calculate total amount for filtered services
  const getFilteredTotal = () => {
    const filteredServices = getFilteredServices();
    return filteredServices.reduce(
      (sum: number, item: any) => sum + item.price * item.quantity,
      0
    );
  };

  if (!invoice) return

  const filteredServices = getFilteredServices();
  const filteredTotal = getFilteredTotal();

  const renderServicesTable = (services: any[], total: number) => (
    <div className="overflow-x-auto">
      <div className="overflow-x-auto rounded-lg border border-gray-100">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t(translations.stt)}
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t(translations.service)}
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t(translations.group)}
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t(translations.details)}
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t(translations.cost)}
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t(translations.price)}
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t(translations.quantity)}
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t(translations.total)}
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {services && services.length > 0 ? (
              services.map((item: any, index: any) => {
                const subtotal = item.price * item.quantity;
                return (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm text-gray-500">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-sm">
                      <div className="font-semibold text-gray-900">
                        {item.service.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {t(item.service.group)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-left text-sm text-gray-600">
                      <div className="max-w-[200px] truncate text-xs space-y-0.5">
                        {Array.isArray(item.details) ? (
                          item.details.length > 0 ? (
                            item.details.map((detail: string, i: number) => (
                              <div key={i}>• {detail.trim()}</div>
                            ))
                          ) : (
                            <span className="text-gray-400 italic">No details</span>
                          )
                        ) : item.details?.trim() ? (
                          item.details.split(",").map((detail: string, i: number) => (
                            <div key={i}>• {detail.trim()}</div>
                          ))
                        ) : (
                          <span className="text-gray-400 italic">No details</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 font-mono">
                      {formatCurrency(item.cost)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900 font-mono">
                      {formatCurrency(item.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-700">
                      <span className="font-medium">{item.quantity}</span>{" "}
                      <span className="text-gray-400 text-xs">{t(item.service.unit)}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-blue-600 font-bold font-mono">
                      {formatCurrency(subtotal)}
                    </td>
                  </tr>
                );
              })
            ) : (
              /* --- Case: No Data --- */
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="bg-gray-50 p-4 rounded-full">
                      <Package className="h-8 w-8 text-gray-300" />
                    </div>
                    <div className="text-gray-500 font-medium">
                      {t(translations.noData)}
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
          {services && services.length > 0 && (
            <tfoot className="bg-gray-50/80 border-t-2 border-gray-100">
              <tr>
                <td colSpan={7} className="px-6 py-5 text-right font-bold text-gray-600 uppercase tracking-wider text-xs">
                  {t(translations.totalAmount)}:
                </td>
                <td className="px-6 py-5 text-right font-black text-blue-700 text-xl font-mono">
                  {formatCurrency(total)}
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>
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
              <h1 className="text-3xl font-bold text-gray-800">
                {t(
                  type === InvoiceType.INVOICE
                    ? translations.invoice
                    : translations.quotation
                )}
              </h1>
              {t(invoice.set)}
              <p className="text-gray-600 mt-1">
                {t(translations.No, {
                  name: t(
                    type === InvoiceType.INVOICE
                      ? translations.invoice
                      : translations.quotation
                  ),
                })}
                : {invoice.invoice ? invoice.invoice.saleInvoiceNo : invoice.saleInvoiceNo}
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
              onClick={() => setSelectedGroup("all")}
              className={`px-4 py-2 rounded transition ${selectedGroup === "all"
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              {t(translations.All, { name: t(translations.group) })}
            </button>
            {Object.values(Group).map((group) => (
              <button
                key={group}
                onClick={() => setSelectedGroup(group)}
                className={`px-4 py-2 rounded transition capitalize ${selectedGroup === group
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
              >
                {t(group)}
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
                <p className="font-semibold">{invoice.customer.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <DollarSign className="text-blue-600" size={20} />
              <div>
                <p className="text-sm text-gray-500">
                  {selectedGroup === "all" ? "Total Amount" : "Filtered Total"}
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
              Invoice Items
              {selectedGroup !== "all" && (
                <span className="text-sm font-normal text-gray-600">
                  (Filtered: {selectedGroup})
                </span>
              )}
            </h2>
          </div>

          {renderServicesTable(filteredServices, filteredTotal)}
        </div>

        <div className="hidden print:block" ref={contentRef}>
          {/* Header */}
          <div className=" bg-white rounded-lg shadow-md p-6 mb-6">
            {/* customer Info */}
            <div className="border-b pb-4 mb-4">
              <div className="flex justify-between items-start">
                {/* Left section (Logo + customer Info) */}
                <div>
                  <div className="flex items-center gap-4 mb-2">
                    <h1 className="text-3xl font-bold text-gray-800">
                      {"P&Safe CO.,LTD"}
                    </h1>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {t(translations.address)} / Address: ບ.ສວນສະຫວັນ ມ.ປາກເຊ
                    ຂ.ຈຳປາສັກ
                  </p>
                  <p className="text-sm text-gray-600">
                    {t(translations.contact)} / Tel: 020 56628998 / 020 55351234
                    / 020 99954456
                  </p>
                  <p className="text-sm text-gray-600">
                    {t(translations.taxNumber)} / Tax ID : 227085846-9-00
                  </p>
                </div>

                {/* Right section (Invoice title) */}
                <div className="text-right">
                  <h1 className="text-xl font-semibold text-gray-700">
                    {t(
                      type === InvoiceType.INVOICE
                        ? translations.invoice
                        : translations.quotation
                    )}
                  </h1>
                  {t(invoice.set)}
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

            {/* customer & Warehouse Info */}
            <div className="grid grid-cols-2 gap-6 mt-6 pt-4 border-t">
              <div>
                <h3 className="font-semibold text-gray-700 mb-2">
                  {t(translations.customer)}/Customer : {invoice.customer.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {t(translations.address)}/Address:{" "}
                  {invoice.customer.address || ""}
                </p>
                <p className="text-sm text-gray-600">
                  {t(translations.contact)}/Tel: {invoice.customer.phone || ""}
                </p>
                <p className="text-sm text-gray-600">
                  {t(translations.taxNumber)} /Tax ID:{" "}
                  {invoice.customer.taxNumber || ""}
                </p>
              </div>

              <div>
                <p className="text-gray-600">
                  <span className="font-semibold">
                    {type === InvoiceType.INVOICE
                      ? `${t(translations.No, {
                        name: t(translations.invoice),
                      })} / Invoice No: `
                      : ` ${t(translations.No, {
                        name: t(translations.quotation),
                      })} / Quotation No: `}
                  </span>
                  {invoice.invoice ? invoice.invoice.saleInvoiceNo : invoice.saleInvoiceNo}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">
                    {" "}
                    {t(translations.date)} / Date:
                  </span>
                  {formatDate(date)}
                </p>
              </div>
            </div>
          </div>

          {/* Items Table */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase">
                      {t(translations.stt)} / Stt
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      {t(translations.service)} / Service
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      {t(translations.details)} / Details
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      {t(translations.price)} / Price
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      {t(translations.quantity)} / Qty
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-700 uppercase">
                      {t(translations.total)} / Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredServices.map((item: any, index: number) => {
                    const subtotal = item.price * item.quantity;

                    return (
                      <tr key={item.id}>
                        <td className="px-4 py-3 text-left text-sm text-gray-900">
                          {index + 1}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          <div className="font-medium text-gray-900">
                            {item.service.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <div className="font-medium text-gray-900 text-xs">
                            {Array.isArray(item.details) ? (
                              item.details.length > 0 ? (
                                item.details.map(
                                  (detail: string, index: number) => (
                                    <div key={index}>{detail.trim()}</div>
                                  )
                                )
                              ) : (
                                <div>N/A</div>
                              )
                            ) : item.details && item.details.trim() !== "" ? (
                              item.details
                                .split(",")
                                .map((detail: string, index: number) => (
                                  <div key={index}>{detail.trim()}</div>
                                ))
                            ) : (
                              <div>N/A</div>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900">
                          {item.quantity} {t(item.service.unit)}
                        </td>
                        <td className="px-4 py-3 text-right text-sm text-gray-900 font-medium">
                          {formatCurrency(subtotal)}
                        </td>
                      </tr>
                    );
                  })}
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
            <div className="grid grid-cols-3 gap-8 mt-1">
              <div className="text-center">
                <div className="border-b-2 border-gray-300 pb-2 mb-12">
                  <p className="font-medium">customer Signature</p>
                  <p className="text-sm text-gray-600">
                    {t(translations.Signature, {
                      name: t(translations.customer),
                    })}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-b-2 border-gray-300 pb-2 mb-12">
                  <p className="font-medium">Staff Signature</p>
                  <p className="text-sm text-gray-600">
                    {t(translations.Signature, {
                      name: t(translations.EMPLOYEE),
                    })}
                  </p>
                </div>
              </div>
              <div className="text-center">
                <div className="border-b-2 border-gray-300 pb-2 mb-12">
                  <p className="font-medium">Manager Signature</p>
                  <p className="text-sm text-gray-600">
                    {t(translations.Signature, {
                      name: t(translations.MANAGER),
                    })}
                  </p>
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
