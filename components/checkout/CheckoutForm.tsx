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
} from "lucide-react";
import { useCartStore } from "@/lib/store";
import { api } from "@/lib/api";
import { IDeliveryZone } from "@/lib/types";
import MfsPaymentModal from "@/components/popups/MfsPaymentModal";
import ProductImage from "@/components/product/ProductImage";

export default function CheckoutForm() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();

  // MFS Payment Gateway Modal State
  const [isMfsModalOpen, setIsMfsModalOpen] = useState(false);
  const [mfsGateway, setMfsGateway] = useState<"bkash" | "nagad">("bkash");


  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [division, setDivision] = useState("Dhaka");
  const [district, setDistrict] = useState("Dhaka City");
  const [orderNote, setOrderNote] = useState("");

  // Delivery & Zones
  const [deliveryZones, setDeliveryZones] = useState<IDeliveryZone[]>([]);
  const [deliveryCharge, setDeliveryCharge] = useState(60);

  // Payment Selection
  const [paymentMethod, setPaymentMethod] = useState<
    "cod" | "bkash_manual" | "nagad_manual" | "rocket_manual" | "bkash_auto" | "nagad_auto" | "card_auto"
  >("cod");
  const [manualTrxId, setManualTrxId] = useState("");
  const [manualSenderNumber, setManualSenderNumber] = useState("");

  // Coupon
  const [couponInput, setCouponInput] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load Delivery Zones
  useEffect(() => {
    api.getDeliveryZones().then((zones) => {
      setDeliveryZones(zones);
    });
  }, []);

  // Recalculate shipping charge when district changes
  useEffect(() => {
    const matchedZone = deliveryZones.find((z) => z.district === district);
    if (matchedZone) {
      setDeliveryCharge(matchedZone.deliveryCharge);
    } else {
      setDeliveryCharge(division === "Dhaka" ? 60 : 120);
    }
  }, [district, division, deliveryZones]);

  // Debounced Auto-Save Incomplete Order Lead (Abandoned Cart recovery)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (phone.length >= 10 && items.length > 0) {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = setTimeout(() => {
        api.saveIncompleteOrder({
          phone,
          name,
          address,
          division,
          district,
          items: items.map((i) => ({
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
  }, [phone, name, address, division, district, items, subtotal, deliveryCharge]);

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
      const finalPhone = phone.trim() || mfsPaymentData?.senderPhone || "01712345678";
      const finalName = name.trim() || (mfsPaymentData ? "bKash Customer" : "সম্মানিত গ্রাহক");
      const finalAddress = address.trim() || "মিরপুর ১০, ঢাকা ১২১৬ (অনলাইন অর্ডার)";

      const orderData = {
        name: finalName,
        phone: finalPhone,
        address: finalAddress,
        division,
        district,
        note: orderNote,
        items: items.map((i) => ({
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
        paymentMethod: mfsPaymentData?.method || paymentMethod,
        manualTrxId: mfsPaymentData?.trxId || manualTrxId,
        manualSenderNumber: mfsPaymentData?.senderPhone || manualSenderNumber,
        couponCode: appliedCoupon || "",
      };

      const result = await api.submitOrder(orderData);

      if (result.success) {
        clearCart();
        const invoiceId = result.data?.order?.invoiceId || "SG-ORDER";
        const isPaid = mfsPaymentData ? "paid" : "pending";
        const trxQuery = mfsPaymentData?.trxId ? `&trxId=${mfsPaymentData.trxId}` : "";
        router.push(`/order-success?invoiceId=${invoiceId}&phone=${finalPhone}&paymentStatus=${isPaid}${trxQuery}`);
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

    if (items.length === 0) {
      setErrorMessage("আপনার কার্টে কোনো পণ্য নেই। অনুগ্রহ করে পণ্য যোগ করুন।");
      return;
    }

    // 🎯 If Automated bKash is selected: open authentic bKash PGW Modal directly!
    if (paymentMethod === "bkash_auto") {
      setMfsGateway("bkash");
      setIsMfsModalOpen(true);
      return;
    }

    // 🎯 If Automated Nagad is selected: open authentic Nagad PGW Modal directly!
    if (paymentMethod === "nagad_auto") {
      setMfsGateway("nagad");
      setIsMfsModalOpen(true);
      return;
    }

    if (!/^01[3-9]\d{8}$/.test(phone.replace(/\s+/g, ""))) {
      setErrorMessage("অনুগ্রহ করে সঠিক ১১ ডিজিটের মোবাইল নম্বর দিন (যেমন: 017xxxxxxxx)");
      return;
    }

    if (!address.trim() || address.trim().length < 5) {
      setErrorMessage("অনুগ্রহ করে আপনার সম্পূর্ণ ডেলিভারি ঠিকানা প্রদান করুন।");
      return;
    }

    // If Manual bKash/Nagad/Rocket is selected: check TrxID
    if (["bkash_manual", "nagad_manual", "rocket_manual"].includes(paymentMethod)) {
      if (!manualTrxId.trim() || manualTrxId.trim().length < 5) {
        setErrorMessage("ম্যানুয়াল পেমেন্টের ট্রানজেকশন আইডি (TrxID) আবশ্যক।");
        return;
      }
    }

    // Proceed for COD or Manual Payment
    await finalizeOrder();
  };


  const availableDistricts = deliveryZones
    .filter((z) => z.division === division)
    .map((z) => z.district);

  return (
    <>
      <form onSubmit={handleSubmitOrder} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Customer & Shipping Information */}
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

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase">
                  আপনার সম্পূর্ণ নাম <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: মো: কামরুল হাসান"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#303d6e] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase">
                  মোবাইল নম্বর <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  maxLength={11}
                  placeholder="017xxxxxxxx"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#303d6e] focus:bg-white transition-all font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase">
                    বিভাগ (Division) <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={division}
                    onChange={(e) => {
                      setDivision(e.target.value);
                      setDistrict(e.target.value === "Dhaka" ? "Dhaka City" : "Chittagong City");
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#303d6e] focus:bg-white"
                  >
                    <option value="Dhaka">Dhaka (ঢাকা)</option>
                    <option value="Chittagong">Chittagong (চট্টগ্রাম)</option>
                    <option value="Sylhet">Sylhet (সিলেট)</option>
                    <option value="Rajshahi">Rajshahi (রাজশাহী)</option>
                    <option value="Khulna">Khulna (খুলনা)</option>
                    <option value="Barisal">Barisal (বরিশাল)</option>
                    <option value="Rangpur">Rangpur (রংপুর)</option>
                    <option value="Mymensingh">Mymensingh (ময়মনসিংহ)</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase">
                    জেলা / এলাকা <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#303d6e] focus:bg-white"
                  >
                    {availableDistricts.length > 0 ? (
                      availableDistricts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Dhaka City">Dhaka City (৳60)</option>
                        <option value="Outside Dhaka">Outside Dhaka (৳120)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase">
                  সম্পূর্ণ ঠিকানা (বাসা নং, রোড, এলাকা) <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="যেমন: বাসা ১২, রোড ৪, ব্লক সি, ধানমন্ডি"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#303d6e] focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase">
                  ডেলিভারি নোট (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="ডেলিভারি সম্পর্কে বিশেষ কিছু বলার থাকলে লিখুন..."
                  value={orderNote}
                  onChange={(e) => setOrderNote(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#303d6e]"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Payment Method Selection */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 pb-4 mb-6 border-b border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 text-[#303d6e] flex items-center justify-center font-bold">
                <Wallet size={20} />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-extrabold text-slate-900">
                  পেমেন্ট মেথড নির্বাচন করুন
                </h2>
                <p className="text-xs text-slate-400">
                  নিরাপদ ও সহজ উপায়ে মূল্য পরিশোধ করুন
                </p>
              </div>
            </div>

            {/* Radio Options Grid */}
            <div className="space-y-3">
              {/* Option: COD */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "cod"
                    ? "border-[#303d6e] bg-indigo-50/30 shadow-sm"
                    : "border-slate-100 bg-slate-50/60 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    value="cod"
                    checked={paymentMethod === "cod"}
                    onChange={() => setPaymentMethod("cod")}
                    className="accent-[#303d6e] w-4 h-4"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      Cash on Delivery (ক্যাশ অন ডেলিভারি)
                    </span>
                    <span className="text-xs text-slate-500">
                      পণ্য হাতে পেয়ে সম্পূর্ণ মূল্য পরিশোধ করুন
                    </span>
                  </div>
                </div>
                <Truck size={22} className="text-emerald-600 shrink-0" />
              </label>

              {/* Option: Automated bKash */}
              <div className="space-y-2">
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "bkash_auto"
                      ? "border-[#E2136E] bg-pink-50/40 shadow-sm"
                      : "border-slate-100 bg-slate-50/60 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="bkash_auto"
                      checked={paymentMethod === "bkash_auto"}
                      onChange={() => setPaymentMethod("bkash_auto")}
                      className="accent-[#E2136E] w-4 h-4"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">
                        bKash Gateway (অটোমেটিক বিকাশ)
                      </span>
                      <span className="text-xs text-slate-500">
                        বিকাশ নম্বর, SMS ওটিপি ও পিন দিয়ে সরাসরি অনলাইন পে করুন
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-pink-600 bg-pink-50 px-2.5 py-1 rounded">
                    bKash
                  </span>
                </label>

                {paymentMethod === "bkash_auto" && (
                  <div className="p-3.5 rounded-2xl bg-pink-50/90 border border-pink-200 flex flex-col sm:flex-row items-center justify-between gap-3 animate-slide-up">
                    <div className="text-xs text-pink-900 font-medium">
                      বিকাশ একাউন্ট নম্বর, SMS ওটিপি ও পিন দিয়ে পেমেন্ট করুন:
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMfsGateway("bkash");
                        setIsMfsModalOpen(true);
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-[#E2136E] hover:bg-[#c90f60] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap transition-transform active:scale-98"
                    >
                      <span>বিকাশ পেমেন্ট স্ক্রিন ওপেন করুন</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Option: Automated Nagad */}
              <div className="space-y-2">
                <label
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === "nagad_auto"
                      ? "border-[#F7941D] bg-orange-50/40 shadow-sm"
                      : "border-slate-100 bg-slate-50/60 hover:border-slate-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment_method"
                      value="nagad_auto"
                      checked={paymentMethod === "nagad_auto"}
                      onChange={() => setPaymentMethod("nagad_auto")}
                      className="accent-[#F7941D] w-4 h-4"
                    />
                    <div>
                      <span className="text-sm font-bold text-slate-900 block">
                        Nagad Gateway (অটোমেটিক নগদ)
                      </span>
                      <span className="text-xs text-slate-500">
                        নগদ অনলাইন পেমেন্ট গেটওয়ে দিয়ে পে করুন
                      </span>
                    </div>
                  </div>
                  <span className="text-xs font-black text-orange-600 bg-orange-50 px-2.5 py-1 rounded">
                    Nagad
                  </span>
                </label>

                {paymentMethod === "nagad_auto" && (
                  <div className="p-3.5 rounded-2xl bg-orange-50/90 border border-orange-200 flex flex-col sm:flex-row items-center justify-between gap-3 animate-slide-up">
                    <div className="text-xs text-orange-900 font-medium">
                      নগদ একাউন্ট নম্বর, SMS ওটিপি ও পিন দিয়ে পেমেন্ট করুন:
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setMfsGateway("nagad");
                        setIsMfsModalOpen(true);
                      }}
                      className="w-full sm:w-auto px-4 py-2 bg-[#F7941D] hover:bg-orange-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow-sm cursor-pointer whitespace-nowrap transition-transform active:scale-98"
                    >
                      <span>নগদ পেমেন্ট স্ক্রিন ওপেন করুন</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* Option: Automated Card Payment */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "card_auto"
                    ? "border-[#303d6e] bg-indigo-50/30 shadow-sm"
                    : "border-slate-100 bg-slate-50/60 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    value="card_auto"
                    checked={paymentMethod === "card_auto"}
                    onChange={() => setPaymentMethod("card_auto")}
                    className="accent-[#303d6e] w-4 h-4"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      Debit / Credit Card & Banking
                    </span>
                    <span className="text-xs text-slate-500">
                      Visa, Mastercard, Amex ও অনলাইন ব্যাংকিং
                    </span>
                  </div>
                </div>
                <CreditCard size={22} className="text-indigo-600 shrink-0" />
              </label>

              {/* Option: Manual bKash */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "bkash_manual"
                    ? "border-[#303d6e] bg-indigo-50/30 shadow-sm"
                    : "border-slate-100 bg-slate-50/60 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    value="bkash_manual"
                    checked={paymentMethod === "bkash_manual"}
                    onChange={() => setPaymentMethod("bkash_manual")}
                    className="accent-[#303d6e] w-4 h-4"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      Manual bKash (বিকাশ পার্সোনাল)
                    </span>
                    <span className="text-xs text-slate-500">
                      পার্সোনাল নম্বরে Send Money করে TrxID দিন
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-pink-700 bg-pink-100 px-2 py-0.5 rounded">
                  Send Money
                </span>
              </label>

              {/* Option: Manual Nagad */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "nagad_manual"
                    ? "border-[#303d6e] bg-indigo-50/30 shadow-sm"
                    : "border-slate-100 bg-slate-50/60 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    value="nagad_manual"
                    checked={paymentMethod === "nagad_manual"}
                    onChange={() => setPaymentMethod("nagad_manual")}
                    className="accent-[#303d6e] w-4 h-4"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      Manual Nagad (নগদ পার্সোনাল)
                    </span>
                    <span className="text-xs text-slate-500">
                      পার্সোনাল নম্বরে Send Money করে TrxID দিন
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                  Send Money
                </span>
              </label>

              {/* Option: Manual Rocket */}
              <label
                className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                  paymentMethod === "rocket_manual"
                    ? "border-[#303d6e] bg-indigo-50/30 shadow-sm"
                    : "border-slate-100 bg-slate-50/60 hover:border-slate-200"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment_method"
                    value="rocket_manual"
                    checked={paymentMethod === "rocket_manual"}
                    onChange={() => setPaymentMethod("rocket_manual")}
                    className="accent-[#303d6e] w-4 h-4"
                  />
                  <div>
                    <span className="text-sm font-bold text-slate-900 block">
                      Manual Rocket (রকেট পার্সোনাল)
                    </span>
                    <span className="text-xs text-slate-500">
                      রকেট নম্বরে টাকা পাঠিয়ে TrxID প্রদান করুন
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  Send Money
                </span>
              </label>
            </div>

            {/* Dynamic Manual Payment Instructions Box */}
            {["bkash_manual", "nagad_manual", "rocket_manual"].includes(paymentMethod) && (
              <div className="mt-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 animate-slide-up">
                <div className="flex items-center gap-2 text-amber-800 font-bold text-sm mb-2">
                  <AlertCircle size={17} />
                  <span>ম্যানুয়াল পেমেন্ট নির্দেশিকা</span>
                </div>
                <p className="text-xs text-amber-900 leading-relaxed mb-3">
                  নিচের পার্সোনাল নম্বরে <strong className="font-extrabold">৳ {grandTotal.toLocaleString()}</strong> টাকা সেন্ড মানি করুন:
                </p>
                <div className="p-3 bg-white rounded-xl border border-amber-300 flex items-center justify-between mb-4 shadow-inner">
                  <div>
                    <span className="text-[11px] text-slate-400 block font-semibold uppercase">
                      {paymentMethod.replace("_manual", "").toUpperCase()} Personal Number:
                    </span>
                    <span className="text-base sm:text-lg font-black text-slate-900 font-mono tracking-wider">
                      01849832178
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText("01849832178");
                      alert("নম্বর কপি হয়েছে: 01849832178");
                    }}
                    className="bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs"
                  >
                    কপি করুন
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      ট্রানজেকশন আইডি (TrxID) <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: 9J4K2L8M"
                      value={manualTrxId}
                      onChange={(e) => setManualTrxId(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-mono font-bold text-slate-900 uppercase focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-800 block mb-1">
                      যে নম্বর থেকে পাঠিয়েছেন (ঐচ্ছিক)
                    </label>
                    <input
                      type="tel"
                      placeholder="01xxxxxxxxx"
                      value={manualSenderNumber}
                      onChange={(e) => setManualSenderNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-white border border-amber-300 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Placement */}
        <div className="lg:col-span-5 sticky top-24 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
            <h3 className="text-lg font-extrabold text-slate-900 pb-3 mb-4 border-b border-slate-100">
              অর্ডার সামারি ({items.length} টি পণ্য)
            </h3>

            {/* Cart Item Previews */}
            <div className="max-h-64 overflow-y-auto space-y-3 mb-6 pr-1">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantInfo || ""}`}
                  className="flex items-center justify-between text-xs gap-3 py-1.5"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 shrink-0 bg-white">
                      <ProductImage
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        showText={false}
                        iconSize={14}
                      />
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 truncate">{item.name}</p>
                      <p className="text-slate-400 font-medium">
                        Qty: {item.quantity} {item.variantInfo ? `• ${item.variantInfo}` : ""}
                      </p>
                    </div>
                  </div>
                  <span className="font-extrabold text-slate-900 shrink-0">
                    ৳ {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Coupon Code Section */}
            <div className="mb-6 pt-4 border-t border-slate-100">
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
                <span>ডেলিভারি চার্জ ({district})</span>
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
                <span className="text-[#303d6e]">৳ {grandTotal.toLocaleString()}</span>
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
              className={`w-full mt-6 text-white font-black py-4 px-6 rounded-2xl text-base flex items-center justify-center gap-2 shadow-xl transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50 ${
                paymentMethod === "bkash_auto"
                  ? "bg-[#E2136E] hover:bg-[#c90f60] shadow-pink-900/20"
                  : paymentMethod === "nagad_auto"
                  ? "bg-[#F7941D] hover:bg-orange-600 shadow-orange-900/20"
                  : "bg-[#303d6e] hover:bg-indigo-900 shadow-indigo-950/20"
              }`}
            >
              {isSubmitting ? (
                <span>প্রসেসিং হচ্ছে...</span>
              ) : (
                <>
                  <span>
                    {paymentMethod === "bkash_auto"
                      ? "বিকাশ দিয়ে সরাসরি পে করুন (Pay with bKash)"
                      : paymentMethod === "nagad_auto"
                      ? "নগদ দিয়ে সরাসরি পে করুন (Pay with Nagad)"
                      : "অর্ডার নিশ্চিত করুন"}
                  </span>
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

      {/* 💳 Authentic bKash & Nagad Payment Gateway Modal (Phone -> OTP -> PIN -> Auto Pay) */}
      <MfsPaymentModal
        isOpen={isMfsModalOpen}
        gateway={mfsGateway}
        amount={grandTotal}
        customerPhone={phone}
        onClose={() => setIsMfsModalOpen(false)}
        onSuccess={async (paymentData) => {
          setIsMfsModalOpen(false);
          await finalizeOrder(paymentData);
        }}
      />
    </>
  );
}

