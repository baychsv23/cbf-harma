"use client";

import { useState, useEffect } from "react";
import { Search, ShoppingCart, Plus, Minus, X, Package } from "lucide-react";
import { useAlert } from "@/app/hooks/useAlert";
import { formatCurrency } from "@/lib/getCurrencySymbol";

import { createSaleInvoice } from "@/actions/saleInvoices";
import {
  Category,
  InvoiceType,
  PaidType,
  Set as SetPrisma,
} from "@/app/generated/prisma/enums";
import { useApiWithAlert } from "@/app/hooks/useApiWithAlert";
import { translations } from "@/lib/translation";
import { useTranslations } from "next-intl";

interface CreateInvoiceFormProps {
  onCancel: () => void;
  onSuccess?: () => void;
  type: InvoiceType;
}

interface CartItem {
  id: number;
  serviceId: number;
  name: string;
  cost: number;
  price: number;
  quantity: number;
  details?: string;
}

export default function CreateSaleInvoiceForm({
  onCancel,
  onSuccess,
  type,
}: CreateInvoiceFormProps) {
  const t = useTranslations();
  const {
    showError,
    showSuccess,
    showWarning,
    closeProcessing,
    showProcessing,
  } = useAlert();
  // States
  const [services, setServices] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<any>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const api = useApiWithAlert();
  const [deliveryPoint, setDeliveryPoint] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  const [selectedPaidStatus, setSelectedPaidStatus] = useState<PaidType>(
    PaidType.UNPAID
  );
  const [selectSetInvoice, setSelectSetInvoice] = useState<string>("");
  const [selectedSet, setSelectedSet] = useState<string>(""); // New state for selected set
  const [name, SetName] = useState<string>("")

  useEffect(() => {
    const customer = customers.find((c) => c.id === Number(selectedCustomer));
    if (customer) {
      setDeliveryPoint(customer.address);
    }
  }, [selectedCustomer]);

  useEffect(() => {
    loadServices();
    loadCustomers();
  }, []); // Add selectedSet to dependencies

  const loadServices = async () => {
    try {
      const { data } = await api.get(`/api/services`);

      setServices(data.success ? data.data : []);
    } catch (error) {
      setServices([]);
    }
  };
  const filteredServices = services.filter((service) => {
    // 1. ตรวจสอบหมวดหมู่ (มีอยู่แล้ว)
    const matchCategory = !selectedCategory || service.category === selectedCategory;

    // 2. ตรวจสอบชื่อบริการ (เพิ่มใหม่)
    // ใช้ .toLowerCase() เพื่อให้ค้นหาได้ทั้งตัวพิมพ์เล็กและตัวพิมพ์ใหญ่
    const matchName = !name || service.name.includes(name);

    // คืนค่าเฉพาะรายการที่ตรงกับทั้ง Category และ Name
    return matchCategory && matchName;
  });
  const loadCustomers = async () => {
    const { data: customers } = await api.get("/api/customers");
    const customersRes = customers?.data || [];
    setCustomers(customersRes);
  };

  // Get unique sets from all services
  const getAvailableSets = () => {
    const setsSet = new Set<string>();
    services.forEach((service) => {
      if (Array.isArray(service.sets)) {
        service.sets.forEach((set: string) => setsSet.add(set));
      }
    });
    return Array.from(setsSet).sort();
  };

  const addToCart = (service: any) => {
    const existingItem = cart.find((item) => item.serviceId === service.id);

    const newQuantity = existingItem ? existingItem.quantity + 1 : 1;

    if (existingItem) {
      updateQuantity(service.id, newQuantity);
    } else {
      const newItem: CartItem = {
        id: Date.now(),
        serviceId: service.id,
        name: service.name,
        price: service.price || 0,
        cost: service.cost || 0,
        quantity: 1,
        details: "",
      };
      setCart([newItem, ...cart]);
    }
  };

  // Add all services from selected set to cart
  const addSetToCart = () => {
    if (!selectedSet) {
      showWarning("Please select a set first");
      return;
    }

    const servicesInSet = services.filter(
      (service) =>
        Array.isArray(service.sets) && service.sets.includes(selectedSet)
    );

    if (servicesInSet.length === 0) {
      showWarning("No services found in this set");
      return;
    }

    // Create new cart items for services not already in cart
    const newItems: CartItem[] = [];
    const updatedCart = [...cart];

    servicesInSet.forEach((service, index) => {
      const existingItemIndex = updatedCart.findIndex(
        (item) => item.serviceId === service.id
      );

      if (existingItemIndex >= 0) {
        // If item exists, increment quantity
        updatedCart[existingItemIndex].quantity += 1;
      } else {
        // If item doesn't exist, create new item with unique ID
        newItems.push({
          id: Date.now() + index, // Add index to make IDs unique
          serviceId: service.id,
          name: service.name,
          price: service.price || 0,
          cost: service.cost || 0,
          quantity: 1,
          details: "",
        });
      }
    });

    // Combine updated cart with new items
    setCart([...updatedCart, ...newItems]);
  };

  const updateQuantity = (serviceId: number, newQuantity: number) => {
    if (newQuantity <= 0) return;

    setCart(
      cart.map((item) =>
        item.serviceId === serviceId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeFromCart = (id: number) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) {
      showWarning(t(translations.noItemsCart));
      return;
    }

    const saleData = {
      set: selectSetInvoice as SetPrisma,
      deliveryPoint: deliveryPoint.trim(),
      customerId: parseInt(selectedCustomer),
      status: selectedPaidStatus,
      type: type,
      items: cart.map((item) => ({
        serviceId: item.serviceId,
        quantity: item.quantity,
        price: item.price,
        cost: item.cost,
        details: item.details,
      })),
    };
    showProcessing();
    const result = await createSaleInvoice(saleData);
    closeProcessing();
    if (result?.success) {
      showSuccess(t(result?.message));
      clearCart();
      setSelectedCustomer("");
      onSuccess?.();
      onCancel();
    } else {
      showError(t(result?.message));
    }
  };
  const updateDetails = (id: number, details: string) => {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, details: details } : item
      )
    );
  };

  const updatePrice = (id: number, newPrice: number) => {
    setCart(
      cart.map((item) => (item.id === id ? { ...item, price: newPrice } : item))
    );
  };

  const updateCost = (id: number, newCost: number) => {
    setCart(
      cart.map((item) => (item.id === id ? { ...item, cost: newCost } : item))
    );
  };

  const totalAmount = calculateTotal();
  const availableSets = getAvailableSets();

  return (
    <div className="flex flex-col lg:flex-row h-screen overflow-hidden bg-gray-100">
      {/* Left Side - Products */}
      <div className="lg:w-[30%] flex flex-col border-r bg-white overflow-hidden">
        {/* Header with Filters */}
        <div className="bg-white border-b p-4">
          <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
            <button
              onClick={onCancel}
              className="text-sm text-gray-600 hover:text-blue-600 mb-2 flex items-center gap-1"
            >
              ← {t(translations.back)}
            </button>
            <Package className="text-blue-600" />
            {t(translations.Create, {
              name: t(
                type === InvoiceType.INVOICE
                  ? translations.invoice
                  : translations.quotation
              ),
            })}
          </h1>

          <div className="flex flex-col gap-y-4">
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                {t(translations.category)}
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
              >
                <option value="">
                  -- {t(translations.All, { name: t(translations.service) })} --
                </option>
                {Object.values(Category).map((c) => (
                  <option key={c} value={c}>
                    {t(c)}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                {t(translations.service)}
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t(translations.SearchBy, { name: t(translations.name) })}
                  value={name}
                  onChange={(e) => SetName(e.target.value)}
                  className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                />
                {/* ใส่ Icon แว่นขยายเล็กๆ เพื่อความสวยงาม */}
                <Search size={16} className="absolute right-3 top-2.5 text-gray-400" />
              </div>
            </div>
            <div className="flex flex-col border-t pt-2">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                {t(translations.set)}
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedSet}
                  onChange={(e) => setSelectedSet(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="">
                    -- {t(translations.All, { name: t(translations.set) })} --
                  </option>
                  {availableSets.map((set) => (
                    <option key={set} value={set}>
                      {t(set)}
                    </option>
                  ))}
                </select>

                {selectedSet && (
                  <button
                    onClick={addSetToCart}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition flex items-center justify-center shadow-sm"
                    title={t(translations.add)}
                  >
                    <Plus size={20} />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredServices.length === 0 ? (
            // ส่วนแสดงเมื่อไม่มีข้อมูล (No Data State)
            <div className="flex flex-col items-center justify-center h-full py-20 text-gray-400">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Package size={48} className="text-gray-300" />
              </div>
              <p className="text-lg font-medium">{t(translations.noData)}</p>
            </div>
          ) : (
            // ส่วนแสดงรายการข้อมูลปกติ
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredServices.map((service, index) => (
                <div
                  key={service.id}
                  onClick={() => addToCart(service)}
                  className="bg-white rounded-lg shadow-sm border-2 border-gray-200 p-4 cursor-pointer transition hover:shadow-md hover:border-blue-500"
                >
                  <div className="flex flex-col h-full">
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                      {index + 1}. {service.name}
                    </h3>

                    <div className="mt-auto">
                      <p className="text-sm text-gray-600 mb-1">
                        {t(translations.price)}: {formatCurrency(service.price)}
                      </p>
                      <div className="flex items-center justify-end">
                        <Plus size={16} className="text-blue-600" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Side - Cart */}
      <div className="lg:w-[70%] bg-white flex flex-col h-full overflow-hidden border-l">
        {/* Cart Header */}
        <div className="p-4 border-b bg-white shrink-0">
          {/* ส่วนหัวของตะกร้า */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <ShoppingCart size={24} className="text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">
                {t(translations.cart)} ({cart.length})
              </h2>
            </div>
            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
              >
                {t(translations.clear)}
              </button>
            )}
          </div>

          {/* ส่วนฟอร์มข้อมูลลูกค้าและสถานะ - ปรับเป็น Grid แนวนอน */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            {/* Customer Selection */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t(translations.customer)} *
              </label>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-gray-50"
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
            </div>

            {/* Delivery Point */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t(translations.deliveryPoint)} *
              </label>
              <input
                type="text"
                value={deliveryPoint}
                onChange={(e) => setDeliveryPoint(e.target.value)}
                className="w-full px-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-gray-50"
                placeholder={t(translations.placeholder)}
              />
            </div>

            {/* Paid Status (แสดงเฉพาะเมื่อเป็น Invoice) */}
            {type === InvoiceType.INVOICE && (
              <div className="space-y-1">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                  {t(translations.paymentStatus)} *
                </label>
                <select
                  value={selectedPaidStatus}
                  onChange={(e) => setSelectedPaidStatus(e.target.value as PaidType)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-gray-50 font-medium"
                  required
                >
                  <option value="" disabled>
                    -- {t(translations.Select, { name: t(translations.paymentStatus) })} --
                  </option>
                  {Object.values(PaidType).map((p) => (
                    <option key={p} value={p}>
                      {t(p)}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Invoice Category / Set */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">
                {t(translations.category)}
              </label>
              <select
                value={selectSetInvoice}
                onChange={(e) => setSelectSetInvoice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm bg-gray-50"
                required
              >
                <option value="" disabled>
                  -- {t(translations.Select, { name: t(translations.category) })} --
                </option>
                {Object.values(SetPrisma).map((s) => (
                  <option key={s} value={s}>
                    {t(s)}
                  </option>
                ))}
              </select>
            </div>

          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50/50">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <ShoppingCart size={64} className="mb-4 opacity-20" />
              <p className="text-lg font-medium">{t(translations.noData)}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {cart.map((item: any, index: number) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:border-blue-300 transition-all group"
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center gap-4">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-50 text-blue-600 text-xs font-bold">
                          #{cart.length - index}
                        </span>
                        <h4 className="font-bold text-gray-800 text-sm truncate">
                          {item.name}
                        </h4>
                      </div>
                    </div>
                    <div className="w-full lg:w-48">
                      <input
                        type="text"
                        value={item.details}
                        placeholder={t(translations.details)}
                        onChange={(e) => updateDetails(item.id, e.target.value)}
                        className="w-full px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                      />
                    </div>
                    <div className="flex items-center bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.serviceId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm hover:text-blue-600 disabled:opacity-50"
                        disabled={item.quantity <= 1}
                      >
                        <Minus size={14} />
                      </button>
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.serviceId, parseInt(e.target.value) || 1)}
                        className="w-12 text-center bg-transparent font-bold text-sm focus:outline-none"
                      />
                      <button
                        onClick={() => updateQuantity(item.serviceId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white rounded-md shadow-sm hover:text-blue-600"
                      >
                        <Plus size={14} />
                      </button>
                    </div>

                    {/* 4. ต้นทุน (Cost) & ราคา (Price) */}
                    <div className="flex items-center gap-2">
                      <div className="relative">
                        <span className="absolute -top-5 left-0 text-[10px] font-bold text-gray-400 uppercase">{t(translations.cost)}</span>
                        <input
                          type="number"
                          value={item.cost}
                          onChange={(e) => updateCost(item.id, parseFloat(e.target.value) || 0)}
                          className="w-24 px-2 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-orange-600 focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                      <div className="relative">
                        <span className="absolute -top-5 left-0 text-[10px] font-bold text-gray-400 uppercase">{t(translations.price)}</span>
                        <input
                          type="number"
                          value={item.price}
                          onChange={(e) => updatePrice(item.id, parseFloat(e.target.value) || 0)}
                          className="w-28 px-2 py-1.5 border border-gray-200 rounded-lg text-sm font-bold text-blue-700 focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="min-w-[120px] text-right">
                      <span className="block text-[10px] font-bold text-gray-400 uppercase mb-0.5">{t(translations.total)}</span>
                      <span className="text-base font-black text-blue-600">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>

                    {/* 6. ปุ่มลบ (X) */}
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                    >
                      <X size={20} />
                    </button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        <div className="border-t p-4 bg-white shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] shrink-0">
          <div className="flex justify-between items-center mb-4 px-2">
            <span className="text-gray-600 font-medium">{t(translations.totalAmount)}:</span>
            <span className="text-2xl font-black text-blue-600">
              {formatCurrency(totalAmount)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-all disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed shadow-lg active:scale-[0.98]"
          >
            {t(translations.create)}
          </button>
        </div>
      </div>
    </div>
  );
}
