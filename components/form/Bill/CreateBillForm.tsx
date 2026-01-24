"use client";

import { useState, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Package,
  Check,
  ArrowLeft,
  User,
  ChevronDown,
} from "lucide-react";
import { useAlert } from "@/app/hooks/useAlert";
import { useApiWithAlert } from "@/app/hooks/useApiWithAlert";
import { createReceiptService } from "@/actions/bills";
import { BillType } from "@/app/generated/prisma/enums";
import { translations } from "@/lib/translation";
import { useTranslations } from "next-intl";
import { formatCurrency } from "@/lib/getCurrencySymbol";

interface CreateInvoiceFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  type: string;
}

interface CartItem {
  id: number;
  invoiceId: number;
  totalAmount: number;
  saleInvoiceNo: string;
}

export default function CreateBillForm({
  onCancel,
  onSuccess,
  type,
}: CreateInvoiceFormProps) {
  const t = useTranslations();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [searchTerm, setSearch] = useState("");
  const { showSuccess, showError, showProcessing, closeProcessing } =
    useAlert();
  const api = useApiWithAlert();
  // Load customers on mount
  useEffect(() => {
    loadCustomers();
  }, []);

  // Load invoices when customer changes
  useEffect(() => {
    if (selectedCustomer) {
      loadInvoices();
      setCart([]);
    }
  }, [selectedCustomer]);

  const loadCustomers = async () => {
    const { data } = await api.get("/api/customers");
    setCustomers(data?.data || []);
  };

  const loadInvoices = async () => {
    const { data } = await api.get(
      `/api/sale-invoices?type=INVOICE&billId=unlinked&customerId=${selectedCustomer}`
    );
    setInvoices(data.success ? data.data : []);
  };

  const addToCart = (invoice: any) => {
    const existingItem = cart.find((item) => item.invoiceId === invoice.id);

    if (!existingItem) {
      const newItem: CartItem = {
        id: Date.now(),
        invoiceId: invoice.id,
        totalAmount: invoice.totalAmount,
        saleInvoiceNo: invoice.saleInvoiceNo,
      };
      setCart([newItem, ...cart]);
    }
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + Number(item.totalAmount), 0);
  };

  const isInCart = (invoiceId: number) => {
    return cart.some((item) => item.invoiceId === invoiceId);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      return;
    }

    const billData = {
      customerId: parseInt(selectedCustomer),
      type: type as BillType,
      items: cart.map((item) => ({
        invoiceId: item.invoiceId,
        totalAmount: item.totalAmount,
      })),
    };

    showProcessing();
    const result = await createReceiptService(billData);
    closeProcessing();
    if (result?.success) {
      showSuccess(t(result?.message));
      // Reset form
      clearCart();
      setSelectedCustomer("");
      onSuccess?.();
      onCancel();
    } else {
      showError(t(result?.message));
    }

  };

  const filteredInvoices = invoices.filter((invoice) =>
    invoice.saleInvoiceNo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalAmount = calculateTotal();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Side - Invoice List */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b shadow-sm">
          <div className="p-6 max-w-7xl mx-auto">
            {/* Top Bar: Back Button & Title */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-4">
                <button
                  onClick={onCancel}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
                  title={t(translations.back)}
                >
                  <ArrowLeft size={20} />
                </button>
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-blue-50 rounded-xl">
                    <Package className="text-blue-600" size={24} />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-none">
                    {t(translations.Create, {
                      name: t(
                        type === BillType.BILL_SERVICE
                          ? translations.billService
                          : translations.receiptService
                      ),
                    })}
                  </h1>
                </div>
              </div>
            </div>

            {/* Form Section: Customer & Search */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
              {/* Customer Selection */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <User size={16} className="text-gray-400" />
                  {t(translations.customer)} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <select
                    value={selectedCustomer}
                    onChange={(e) => setSelectedCustomer(e.target.value)}
                    className="w-full appearance-none bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 pr-10 transition-all outline-none"
                  >
                    <option value="" disabled>
                      -- {t(translations.Select, { name: t(translations.customer) })} --
                    </option>
                    {customers.map((customer) => (
                      <option key={customer.id} value={customer.id}>
                        {customer.name}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <Search size={16} className="text-gray-400" />
                  {t(translations.search)}
                </label>
                <div className="relative group">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors"
                    size={18}
                  />
                  <input
                    type="text"
                    placeholder={t(translations.SearchBy, {
                      name: t(translations.invoice),
                    })}
                    value={searchTerm}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Invoice List */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-10 text-gray-500">
              {t(translations.noData)}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              {/* Table Header */}
              <div className="bg-gray-50 border-b border-gray-200 px-6 py-3">
                <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                  <div className="col-span-1 text-left">
                    {t(translations.stt)}
                  </div>
                  <div className="col-span-4 text-left">
                    {t(translations.No, { name: t(translations.invoice) })}
                  </div>
                  <div className="col-span-3 text-left">
                    {t(translations.total)}
                  </div>
                  <div className="col-span-2 text-left">
                    {t(translations.status)}
                  </div>
                  <div className="col-span-2 text-left">Action</div>
                </div>
              </div>

              {/* Table Body */}
              <div className="divide-y divide-gray-200 text-left">
                {filteredInvoices.map((invoice, index) => {
                  const inCart = isInCart(invoice.id);
                  return (
                    <div
                      key={invoice.id}
                      className={`px-6 py-4 hover:bg-gray-50 transition ${inCart ? "bg-blue-50" : ""
                        }`}
                    >
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-1 text-gray-600 font-medium">
                          #{cart.length - index}
                        </div>
                        <div className="col-span-4 text-left">
                          <div className="font-semibold text-gray-800">
                            {invoice.saleInvoiceNo}
                          </div>
                        </div>
                        <div className="col-span-3 text-left">
                          <span className="text-gray-900 font-semibold">
                            {formatCurrency(invoice.totalAmount)}
                          </span>
                        </div>
                        <div className="col-span-2 text-left">
                          {inCart ? (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              <Check size={14} />
                              {t(translations.added)}
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                              {t(translations.notAdded)}
                            </span>
                          )}
                        </div>
                        <div className="col-span-2 text-left">
                          {inCart ? (
                            <button
                              onClick={() =>
                                removeFromCart(
                                  cart.find(
                                    (item) => item.invoiceId === invoice.id
                                  )?.id || 0
                                )
                              }
                              className="inline-flex items-center gap-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition text-sm font-medium"
                            >
                              <X size={16} />
                              {t(translations.delete)}
                            </button>
                          ) : (
                            <button
                              onClick={() => addToCart(invoice)}
                              className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                            >
                              <Plus size={16} />
                              {t(translations.add)}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Cart Summary */}
      <div className="w-96 bg-white border-l flex flex-col shadow-lg">
        {/* Cart Header */}
        <div className="p-6 border-b bg-gradient-to-r from-blue-600 to-blue-700">
          <div className="flex items-center justify-between text-white mb-2">
            <div className="flex items-center gap-2">
              <ShoppingCart size={24} />
              <h2 className="text-xl font-bold">
                {t(translations.Select, { name: t(translations.list) })}
              </h2>
            </div>
            <span className="bg-white text-blue-600 px-3 py-1 rounded-full text-sm font-bold">
              {cart.length}
            </span>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-white hover:text-blue-100 text-sm font-medium underline"
            >
              {t(translations.clear)}
            </button>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart size={64} className="mb-4 opacity-50" />
              <p className="text-center">{t(translations.noData)}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div
                  key={item.id}
                  className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <div className="text-xs text-blue-600 font-semibold mb-1">
                        {t(translations.list)} {index + 1}
                      </div>
                      <h4 className="font-bold text-gray-800">
                        {item.saleInvoiceNo}
                      </h4>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1 rounded"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                    <span className="text-sm text-gray-600">
                      {t(translations.total)}
                    </span>
                    <span className="font-bold text-blue-700 text-lg">
                      {formatCurrency(item.totalAmount)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        <div className="border-t p-6 bg-gray-50">
          <div className="space-y-3 mb-6">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">{t(translations.list)}:</span>
              <span className="font-semibold text-gray-800">
                {cart.length} {t(translations.list)}
              </span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
              <span className="text-lg font-semibold text-gray-800">
                {t(translations.totalAmount)}:
              </span>
              <span className="text-2xl font-bold text-blue-600">
                {formatCurrency(totalAmount)}
              </span>
            </div>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-blue-800 transition disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed shadow-lg disabled:shadow-none"
          >
            {t(translations.create)}
          </button>
        </div>
      </div>
    </div>
  );
}
