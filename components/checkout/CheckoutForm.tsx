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
import ProductImage from "@/components/product/ProductImage";

export default function CheckoutForm() {
  const router = useRouter();
  const { items, getSubtotal, clearCart } = useCartStore();
  const subtotal = getSubtotal();


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
      const finalPhone = phone.trim() || "01712345678";
      const finalName = name.trim() || "সম্মানিত গ্রাহক";
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
        paymentMethod: "cod",
        couponCode: appliedCoupon || "",
      };

      const result = await api.submitOrder(orderData);

      if (result.success) {
        clearCart();
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

    if (items.length === 0) {
      setErrorMessage("আপনার কার্টে কোনো পণ্য নেই। অনুগ্রহ করে পণ্য যোগ করুন।");
      return;
    }

    if (!name.trim() || name.trim().length < 2) {
      setErrorMessage("অনুগ্রহ করে আপনার নাম প্রদান করুন।");
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

    // Proceed for Cash on Delivery
    await finalizeOrder();
  };


  const availableDistricts = deliveryZones
    .filter((z) => z.division === division)
    .map((z) => z.district);

  return (
    <form onSubmit={handleSubmitOrder} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-7 space-y-6">
          {/* Frictionless Guest Checkout Reassurance Banner */}
          <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-4 flex items-center gap-3 text-emerald-950 shadow-xs">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <h4 className="font-extrabold text-xs text-emerald-950">
                কোনো অ্যাকাউন্ট বা লগইন ছাড়াই সরাসরি ক্যাশ অন ডেলিভারি
              </h4>
              <p className="text-[11px] text-emerald-800 mt-0.5">
                শুধু আপনার নাম, ফোন ও ঠিকানা লিখে সরাসরি অর্ডার করুন। পণ্য হাতে পেয়ে সম্পূর্ণ নিশ্চিন্তে মূল্য পরিশোধ করবেন।
              </p>
            </div>
          </div>

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
              className="w-full mt-6 text-white font-black py-4 px-6 rounded-2xl text-base flex items-center justify-center gap-2 shadow-xl bg-[#303d6e] hover:bg-indigo-900 shadow-indigo-950/20 transition-all hover:scale-[1.01] active:scale-98 disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <span>প্রসেসিং হচ্ছে...</span>
              ) : (
                <>
                  <span>অর্ডার নিশ্চিত করুন (Cash on Delivery)</span>
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

