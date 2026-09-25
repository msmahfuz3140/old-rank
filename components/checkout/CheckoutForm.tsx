"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Truck,
  ShieldCheck,
  CreditCard,
  Wallet,
  Tag,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  Trash2,
} from "lucide-react";
import { useCartStore } from "@/lib/store";
import { api } from "@/lib/api";
import { IDeliveryZone } from "@/lib/types";
import ProductImage from "@/components/product/ProductImage";

export default function CheckoutForm() {
  const router = useRouter();
  const {
    items,
    directBuyItem,
    clearDirectBuyItem,
    updateDirectBuyQuantity,
    getSubtotal,
    clearCart,
    closeCartDrawer,
    updateQuantity,
    removeItem,
  } = useCartStore();

  const activeItems = directBuyItem ? [directBuyItem] : items;
  const subtotal = directBuyItem
    ? directBuyItem.price * directBuyItem.quantity
    : getSubtotal();

  useEffect(() => {
    closeCartDrawer();
  }, [closeCartDrawer]);

  const handleUpdateItemQuantity = (productId: string, newQty: number, variantInfo?: string) => {
    if (directBuyItem) {
      updateDirectBuyQuantity(newQty);
    } else {
      updateQuantity(productId, newQty, variantInfo);
    }
  };

  const handleRemoveItem = (productId: string, variantInfo?: string) => {
    if (directBuyItem) {
      clearDirectBuyItem();
    } else {
      removeItem(productId, variantInfo);
    }
  };

  // Form State - matching screenshot
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [altPhone, setAltPhone] = useState("");
  const [deliveryArea, setDeliveryArea] = useState<"inside" | "outside">("inside");
  const [address, setAddress] = useState("");
  const [orderNote, setOrderNote] = useState("");
  const [deliveryCharge, setDeliveryCharge] = useState(60);

  const handleDeliveryAreaChange = (area: "inside" | "outside") => {
    setDeliveryArea(area);
    setDeliveryCharge(area === "inside" ? 60 : 120);
  };

  // Payment Selection (Cash on Delivery Only)
  const paymentMethod = "cod";

  // Coupon
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Debounced Auto-Save Incomplete Order Lead (Abandoned Cart recovery)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    const cleanedPhone = phone.replace(/\s+/g, "").replace(/^\+88/, "");
    if (cleanedPhone.length >= 10 && activeItems.length > 0) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        api.saveIncompleteOrder({
          phone: cleanedPhone,
          name,
          address,
          division: deliveryArea === "inside" ? "Dhaka" : "Outside Dhaka",
          district: deliveryArea === "inside" ? "ঢাকার মধ্যে (Inside Dhaka)" : "ঢাকার বাইরে (Outside Dhaka)",
          items: activeItems.map((i) => ({
            productId: i.productId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
          subtotal,
          deliveryCharge,
        });
      }, 1500);
    }
    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [phone, name, address, deliveryArea, activeItems, subtotal, deliveryCharge]);

  // Coupon Submission
  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponMessage(null);
    const res = await api.validateCoupon(couponInput.trim(), subtotal);
    if (res.success) {
      setAppliedCoupon(couponInput.trim().toUpperCase());
      setDiscountAmount(res.discount);
      setCouponMessage({ text: res.message, isError: false });
    } else {
      setCouponMessage({ text: res.message, isError: true });
    }
  };

  const grandTotal = Math.max(0, subtotal + deliveryCharge - discountAmount);

  // Core Order Finalizer (Called directly or after MFS Gateway verification)
  const finalizeOrder = async (mfsPaymentData?: {
    method: string;
    trxId: string;
    senderPhone: string;
  }) => {
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const finalPhone = phone.trim().replace(/^\+88/, "") || "01712345678";
      const finalName = name.trim() || "সম্মানিত গ্রাহক";
      const finalAddress = address.trim() || "মিরপুর ১০, ঢাকা ১২১৬ (অনলাইন অর্ডার)";
      const finalDivision = deliveryArea === "inside" ? "Dhaka" : "Outside Dhaka";
      const finalDistrict =
        deliveryArea === "inside" ? "ঢাকার মধ্যে (Inside Dhaka)" : "ঢাকার বাইরে (Outside Dhaka)";
      const combinedNotes = [
        altPhone.trim() ? `বিকল্প ফোন: ${altPhone.trim()}` : "",
        orderNote.trim() ? orderNote.trim() : "",
      ]
        .filter(Boolean)
        .join(" | ");

      const orderData = {
        name: finalName,
        phone: finalPhone,
        address: finalAddress,
        division: finalDivision,
        district: finalDistrict,
        note: combinedNotes || undefined,
        items: activeItems.map((i) => ({
          productId: i.productId,
          name: i.name,
          image: i.image,
          variantInfo: i.variantInfo || "",
          price: i.price,
          quantity: i.quantity,
          total: i.price * i.quantity,
        })),
        subtotal,
        deliveryCharge,
        discount: discountAmount,
        grandTotal,
        paymentMethod: "cod",
        couponCode: appliedCoupon || "",
      };

      const result = await api.submitOrder(orderData);

      if (result.success) {
        if (directBuyItem) {
          clearDirectBuyItem();
        } else {
          clearCart();
        }
        const invoiceId = result.data?.order?.invoiceId || "OR-ORDER";
        router.push(`/order-success?invoiceId=${invoiceId}&phone=${finalPhone}&paymentStatus=pending`);
      } else {
        setErrorMessage(result.message || "অর্ডার সম্পন্ন হতে সমস্যা হয়েছে। আবার চেষ্টা করুন।");
      }
    } catch {
      setErrorMessage("সার্ভার সমস্যা। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Order Form Trigger
  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (activeItems.length === 0) {
      setErrorMessage("আপনার কার্টে কোনো পণ্য নেই। অনুগ্রহ করে পণ্য যোগ করুন।");
      return;
    }

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage("অনুগ্রহ করে আপনার নাম প্রদান করুন।");
      return;
    }

    const cleanedPhone = phone.replace(/\s+/g, "").replace(/^\+88/, "");
    if (!/^01[3-9]\d{8}$/.test(cleanedPhone)) {
      setErrorMessage("অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)");
      return;
    }

    if (!address.trim() || address.trim().length < 3) {
      setErrorMessage("অনুগ্রহ করে আপনার সম্পূর্ণ ডেলিভারি ঠিকানা প্রদান করুন।");
      return;
    }

    // Proceed for Cash on Delivery
    await finalizeOrder();
  };

  return (
    <form onSubmit={handleSubmitOrder} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Column: Order Summary (Top), Shipping & Billing (Under it), and Payment */}
        <div className="lg:col-span-7 space-y-6">

          {/* Card 1: অর্ডার সামারি (পণ্য তালিকা ও কোয়ান্টিটি) - উপরে প্রথম সেকশন */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#303d6e] flex items-center justify-center font-bold">
                  <Tag size={20} />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 flex items-center gap-2">
                    <span>অর্ডার সামারি ({activeItems.length} টি পণ্য)</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    নির্বাচিত পণ্যের তালিকা ও পরিমাণ যাচাই করুন
                  </p>
                </div>
              </div>
              {directBuyItem && (
                <span className="text-[11px] font-bold text-amber-800 bg-amber-100 px-3 py-1 rounded-full border border-amber-200">
                  সরাসরি বাই
                </span>
              )}
            </div>

            {/* Cart Item Previews with Quantity Controls */}
            <div className="space-y-3.5 divide-y divide-slate-100">
              {activeItems.length === 0 ? (
                <div className="text-center py-8 text-slate-400">
                  <p className="text-xs font-semibold">আপনার অর্ডার তালিকায় কোনো পণ্য নেই</p>
                  <button
                    type="button"
                    onClick={() => router.push("/shop")}
                    className="mt-2 text-xs font-bold text-[#303d6e] hover:underline"
                  >
                    শপ থেকে পণ্য নির্বাচন করুন →
                  </button>
                </div>
              ) : (
                activeItems.map((item) => (
                  <div
                    key={`${item.productId}-${item.variantInfo || ""}`}
                    className="pt-3.5 first:pt-0 flex items-center justify-between gap-3 text-xs sm:text-sm"
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-14 h-14 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-white shadow-2xs">
                        <ProductImage
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                          showText={false}
                          iconSize={16}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-slate-800 truncate leading-tight">
                          {item.name}
                        </p>
                        {item.variantInfo && (
                          <p className="text-[11px] text-slate-400 font-medium truncate mt-0.5">
                            {item.variantInfo}
                          </p>
                        )}
                        <div className="text-xs font-extrabold text-[#303d6e] mt-1">
                          ৳ {item.price.toLocaleString()} × {item.quantity} ={" "}
                          <span className="text-slate-900 font-black">
                            ৳ {(item.price * item.quantity).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Quantity Adjustment (+ / -) & Delete Button */}
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-slate-50 shadow-2xs">
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQuantity(item.productId, item.quantity - 1, item.variantInfo)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 font-black transition-colors cursor-pointer text-sm"
                          title="পরিমাণ কমান"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-7 text-center font-black text-slate-900 text-xs sm:text-sm">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleUpdateItemQuantity(item.productId, item.quantity + 1, item.variantInfo)}
                          className="w-7 h-7 flex items-center justify-center text-slate-600 hover:bg-slate-200 hover:text-slate-900 font-black transition-colors cursor-pointer text-sm"
                          title="পরিমাণ বাড়ান"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.productId, item.variantInfo)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="মুছে ফেলুন"
                        aria-label="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Card 2: শিপিং এবং বিলিং তথ্য - অর্ডার সামারির নিচে */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#303d6e] flex items-center justify-center font-bold">
                <Truck size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  শিপিং এবং বিলিং তথ্য
                </h2>
                <p className="text-xs text-slate-400">
                  অর্ডার পৌঁছানোর জন্য সঠিক তথ্য প্রদান করুন
                </p>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {/* ১. নাম */}
              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">
                  নাম <span className="text-[#e11d48] font-bold">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all"
                />
              </div>

              {/* ২. ফোন নম্বর */}
              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">
                  ফোন নম্বর <span className="text-[#e11d48] font-bold">*</span>
                </label>
                <div className="flex border border-slate-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-slate-400 focus-within:border-slate-400 transition-all bg-white">
                  <div className="flex items-center gap-1.5 px-3 py-3 bg-white border-r border-slate-200 text-slate-700 select-none text-xs sm:text-sm font-medium shrink-0">
                    <svg className="w-5 h-3.5 rounded-2xs" viewBox="0 0 20 12">
                      <rect width="20" height="12" fill="#006a4e" />
                      <circle cx="9" cy="6" r="4" fill="#f42a41" />
                    </svg>
                    <span>+88</span>
                    <span className="text-[10px] text-slate-400">▼</span>
                  </div>
                  <input
                    type="tel"
                    required
                    maxLength={11}
                    placeholder="01xxxxxxxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* ৩. বিকল্প ফোন নম্বর */}
              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">
                  বিকল্প ফোন নম্বর
                </label>
                <div className="flex border border-slate-200 rounded-lg overflow-hidden focus-within:ring-1 focus-within:ring-slate-400 focus-within:border-slate-400 transition-all bg-white">
                  <div className="flex items-center px-4 py-3 bg-slate-100/90 border-r border-slate-200 text-slate-700 select-none text-xs sm:text-sm font-semibold shrink-0">
                    +88
                  </div>
                  <input
                    type="tel"
                    maxLength={11}
                    placeholder="01XXXXXXXXX"
                    value={altPhone}
                    onChange={(e) => setAltPhone(e.target.value)}
                    className="flex-1 px-4 py-3 bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-mono"
                  />
                </div>
              </div>

              {/* ৪. ডেলিভারি এরিয়া সিলেক্ট করুন */}
              <div>
                <label className="text-sm font-bold text-slate-800 block mb-2">
                  ডেলিভারি এরিয়া সিলেক্ট করুন <span className="text-[#e11d48] font-bold">*</span>
                </label>
                <div className="space-y-3">
                  {/* ঢাকার মধ্যে */}
                  <div
                    onClick={() => handleDeliveryAreaChange("inside")}
                    className={`p-3.5 sm:p-4 rounded-lg border cursor-pointer transition-all flex items-center gap-3.5 select-none ${
                      deliveryArea === "inside"
                        ? "border-[#16a34a] bg-white ring-1 ring-[#16a34a]"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-center shrink-0">
                      {deliveryArea === "inside" ? (
                        <div className="w-5 h-5 rounded-full border-2 border-[#16a34a] flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm sm:text-base font-bold text-slate-900 block leading-tight">
                        ঢাকার মধ্যে
                      </span>
                      <span className="text-xs text-slate-500 mt-0.5 block">
                        (Inside Dhaka)
                      </span>
                    </div>
                  </div>

                  {/* ঢাকার বাইরে */}
                  <div
                    onClick={() => handleDeliveryAreaChange("outside")}
                    className={`p-3.5 sm:p-4 rounded-lg border cursor-pointer transition-all flex items-center gap-3.5 select-none ${
                      deliveryArea === "outside"
                        ? "border-[#16a34a] bg-white ring-1 ring-[#16a34a]"
                        : "border-slate-200 bg-white hover:border-slate-300"
                    }`}
                  >
                    <div className="flex items-center justify-center shrink-0">
                      {deliveryArea === "outside" ? (
                        <div className="w-5 h-5 rounded-full border-2 border-[#16a34a] flex items-center justify-center">
                          <div className="w-2.5 h-2.5 rounded-full bg-[#16a34a]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300" />
                      )}
                    </div>
                    <div>
                      <span className="text-sm sm:text-base font-bold text-slate-900 block leading-tight">
                        ঢাকার বাইরে
                      </span>
                      <span className="text-xs text-slate-500 mt-0.5 block">
                        (Outside Dhaka)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* ৫. ঠিকানা */}
              <div>
                <label className="text-sm font-bold text-slate-800 block mb-1.5">
                  ঠিকানা <span className="text-[#e11d48] font-bold">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Your Address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-400 focus:border-slate-400 transition-all"
                />
              </div>
            </div>
          </div>

          {/* Card 3: পেমেন্ট পদ্ধতি (Payment Method Selection) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <Truck size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  পেমেন্ট পদ্ধতি (Payment Method)
                </h2>
                <p className="text-xs text-slate-400">
                  সারা বাংলাদেশে সহজ ও বিশ্বস্ত ক্যাশ অন ডেলিভারি
                </p>
              </div>
            </div>

            {/* Option: Cash on Delivery Only */}
            <div className="p-4 sm:p-5 rounded-2xl border-2 border-emerald-500 bg-emerald-50/40 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-black shrink-0 shadow-sm">
                  ✓
                </div>
                <div>
                  <span className="text-sm sm:text-base font-extrabold text-slate-900 block">
                    Cash on Delivery (ক্যাশ অন ডেলিভারি)
                  </span>
                  <span className="text-xs text-slate-600 mt-0.5 block">
                    পণ্য হাতে পেয়ে চেক করে সম্পূর্ণ মূল্য ডেলিভারি ম্যানকে পরিশোধ করবেন। কোনো অগ্রিম পেমেন্টের প্রয়োজন নেই।
                  </span>
                </div>
              </div>
              <span className="text-[11px] sm:text-xs font-bold text-emerald-800 bg-emerald-100/90 px-3 py-1.5 rounded-xl shrink-0 border border-emerald-200 w-fit">
                ক্যাশ অন ডেলিভারি
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: মূল্য তালিকা ও অর্ডার নিশ্চিতকরণ বাটন */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900">
                মূল্য তালিকা ও অর্ডার নিশ্চিতকরণ
              </h3>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                {activeItems.length} টি পণ্য
              </span>
            </div>

            {/* Coupon Code Section */}
            <div className="mb-6 pt-1">
              <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase tracking-wide">
                কুপন কোড
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="কুপন কোড (যেমন: SAVE10)"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs uppercase font-bold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#303d6e]"
                />
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="bg-[#303d6e] hover:bg-indigo-800 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors shadow-sm"
                >
                  APPLY
                </button>
              </div>
              {couponMessage && (
                <p
                  className={`text-xs mt-2 flex items-center gap-1 ${
                    couponMessage.isError ? "text-red-500" : "text-emerald-600 font-semibold"
                  }`}
                >
                  {couponMessage.isError ? <AlertCircle size={13} /> : <CheckCircle2 size={13} />}
                  {couponMessage.text}
                </p>
              )}
            </div>

            {/* Totals Breakdown */}
            <div className="space-y-2.5 text-xs sm:text-sm pt-4 border-t border-slate-100">
              <div className="flex justify-between text-slate-600">
                <span>সাবটোটাল</span>
                <span className="font-bold text-slate-900">৳ {subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>ডেলিভারি চার্জ ({deliveryArea === "inside" ? "ঢাকার মধ্যে" : "ঢাকার বাইরে"})</span>
                <span className="font-bold text-slate-900">৳ {deliveryCharge.toLocaleString()}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>ডিসকাউন্ট ({appliedCoupon})</span>
                  <span>- ৳ {discountAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between text-base sm:text-lg font-black text-slate-900 pt-3 border-t border-slate-200">
                <span>সর্বমোট পরিশোধযোগ্য</span>
                <span className="text-[#e11d48]">৳ {grandTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Error Banner */}
            {errorMessage && (
              <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center gap-2">
                <AlertCircle size={16} className="shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Place Order Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-6 text-white font-black py-4 px-6 rounded-2xl text-base flex items-center justify-center gap-2 shadow-xl bg-[#e11d48] hover:bg-rose-700 shadow-rose-950/20 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>প্রসেসিং হচ্ছে...</span>
              ) : (
                <>
                  <span>প্রোডাক্টটি ক্রয় করুন (Cash on Delivery)</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <div className="mt-4 text-center text-slate-400 text-xs flex items-center justify-center gap-1.5 font-medium">
              <ShieldCheck size={16} className="text-emerald-500" />
              <span>১০০% নিরাপদ এবং সিকিউর চেকআউট</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

