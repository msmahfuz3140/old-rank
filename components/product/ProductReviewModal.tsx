"use client";

import { useState, useEffect } from "react";
import { X, Star, CheckCircle, ShieldCheck, AlertCircle, Sparkles } from "lucide-react";
import { api } from "@/lib/api";
import { IReview } from "@/lib/types";

interface ProductReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: {
    _id?: string;
    name: string;
    slug: string;
    image?: string;
  };
  defaultCustomerName?: string;
  defaultCustomerPhone?: string;
  defaultCustomerCity?: string;
  defaultInvoiceId?: string;
  onReviewSubmitted: (newReview: IReview, updatedStats?: { rating: number; reviewCount: number }) => void;
}

const RATING_LABELS: Record<number, { text: string; color: string }> = {
  1: { text: "খুব খারাপ (Terrible)", color: "text-rose-600" },
  2: { text: "চলনসই (Fair)", color: "text-orange-500" },
  3: { text: "মোটামুটি (Average)", color: "text-amber-500" },
  4: { text: "খুব ভালো (Good)", color: "text-emerald-500" },
  5: { text: "অসাধারণ! (Excellent)", color: "text-amber-500 font-black" },
};

export default function ProductReviewModal({
  isOpen,
  onClose,
  product,
  defaultCustomerName = "",
  defaultCustomerPhone = "",
  defaultCustomerCity = "",
  defaultInvoiceId = "",
  onReviewSubmitted,
}: ProductReviewModalProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [customerName, setCustomerName] = useState(defaultCustomerName);
  const [customerPhone, setCustomerPhone] = useState(defaultCustomerPhone);
  const [customerCity, setCustomerCity] = useState(defaultCustomerCity);
  const [orderInvoiceId, setOrderInvoiceId] = useState(defaultInvoiceId);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Load from localStorage if available
  useEffect(() => {
    if (isOpen) {
      setErrorMsg("");
      setSuccessMsg("");
      try {
        const savedOrderStr = localStorage.getItem("oldrank_recent_order");
        if (savedOrderStr) {
          const saved = JSON.parse(savedOrderStr);
          if (!customerName && saved.name) setCustomerName(saved.name);
          if (!customerPhone && saved.phone) setCustomerPhone(saved.phone);
          if (!customerCity && (saved.district || saved.division)) {
            setCustomerCity(saved.district || saved.division);
          }
          if (!orderInvoiceId && saved.invoiceId) setOrderInvoiceId(saved.invoiceId);
        }
      } catch {}
    }
  }, [isOpen, defaultCustomerName, defaultCustomerPhone, defaultCustomerCity, defaultInvoiceId]);

  if (!isOpen) return null;

  const activeStar = hoverRating || rating;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!customerName.trim()) {
      setErrorMsg("অনুগ্রহ করে আপনার নাম প্রদান করুন।");
      return;
    }

    if (!comment.trim() || comment.trim().length < 5) {
      setErrorMsg("পণ্যটি সম্পর্কে অন্তত কয়েকটি শব্দে আপনার রিভিউ লিখুন (কমপক্ষে ৫ অক্ষর)।");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await api.submitReview({
        productId: product._id,
        productSlug: product.slug,
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerCity: customerCity.trim(),
        orderInvoiceId: orderInvoiceId.trim(),
        rating,
        comment: comment.trim(),
      });

      if (res.success && res.data) {
        setSuccessMsg(res.message || "ধন্যবাদ! আপনার রিভিউ সফলভাবে গৃহীত হয়েছে।");
        onReviewSubmitted(res.data, res.productStats);
        setTimeout(() => {
          onClose();
        }, 1800);
      } else {
        setErrorMsg(res.message || "রিভিউ জমা দিতে সমস্যা হয়েছে। পুনরায় চেষ্টা করুন।");
      }
    } catch {
      setErrorMsg("সার্ভার সমস্যা। অনুগ্রহ করে কিছুক্ষণ পর আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 shadow-2xl border border-slate-100 relative my-auto animate-scaleUp">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div className="border-b border-slate-100 pb-3.5 mb-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-amber-100 text-amber-800">
              <Sparkles size={16} />
            </span>
            <h3 className="text-base sm:text-lg font-black text-slate-900">
              কাস্টমার রিভিউ প্রদান করুন
            </h3>
          </div>
          <p className="text-xs text-slate-500 line-clamp-1 font-medium">
            প্রোডাক্ট: <strong className="text-slate-800">{product.name}</strong>
          </p>
        </div>

        {successMsg ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle size={32} />
            </div>
            <h4 className="text-base font-black text-slate-900">রিভিউ গৃহীত হয়েছে!</h4>
            <p className="text-xs text-emerald-700 font-semibold max-w-xs mx-auto">
              {successMsg}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Interactive Star Rating Selector */}
            <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200/80 text-center space-y-1.5">
              <label className="block text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                আপনার রেটিং নির্বাচন করুন:
              </label>
              <div className="flex items-center justify-center gap-1.5 py-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 transition-transform hover:scale-125 focus:outline-none cursor-pointer"
                    aria-label={`${star} star`}
                  >
                    <Star
                      size={28}
                      className={
                        star <= activeStar
                          ? "fill-amber-400 text-amber-400 drop-shadow-xs"
                          : "text-slate-300"
                      }
                    />
                  </button>
                ))}
              </div>
              <div className={`text-xs font-bold ${RATING_LABELS[activeStar]?.color || "text-amber-600"}`}>
                {RATING_LABELS[activeStar]?.text}
              </div>
            </div>

            {/* Customer Name & City */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  আপনার নাম *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: নুসরাত জাহান"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-[#303d6e]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  শহর / এলাকা (ঐচ্ছিক)
                </label>
                <input
                  type="text"
                  placeholder="যেমন: ঢাকা / চট্টগ্রাম"
                  value={customerCity}
                  onChange={(e) => setCustomerCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-[#303d6e]"
                />
              </div>
            </div>

            {/* Phone & Order Invoice (For Verified Purchase Badge) */}
            <div className="p-3 bg-indigo-50/50 rounded-2xl border border-indigo-100/80 space-y-2">
              <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-[11px]">
                <ShieldCheck size={14} className="text-emerald-600" />
                <span>যাচাইকৃত ক্রেতা ব্যাজ (Verified Purchase):</span>
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                আপনি যদি ইতিমধ্যে পণ্যটি অর্ডার করে থাকেন, তবে মোবাইল নম্বর বা ইনভয়েস আইডি দিন। আপনার রিভিউতে ভেরিফাইড ব্যাজ যুক্ত হবে।
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <input
                  type="text"
                  placeholder="অর্ডারের মোবাইল (017...)"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800"
                />
                <input
                  type="text"
                  placeholder="ইনভয়েস আইডি (SG-...)"
                  value={orderInvoiceId}
                  onChange={(e) => setOrderInvoiceId(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono text-[11px] text-slate-800"
                />
              </div>
            </div>

            {/* Review Comment */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                আপনার রিভিউ মন্তব্য লিখুন *
              </label>
              <textarea
                required
                rows={3}
                placeholder="পণ্যটির কোয়ালিটি, ফিনিশিং, ডেলিভারি ও প্যাকেজিং কেমন লেগেছে সংক্ষেপে লিখুন..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900 focus:ring-2 focus:ring-[#303d6e] resize-none"
              />
            </div>

            {errorMsg && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 font-semibold text-xs flex items-center gap-1.5">
                <AlertCircle size={14} />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#303d6e] hover:bg-indigo-900 text-white font-black px-6 py-2.5 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? "জমা হচ্ছে..." : "রিভিউ সাবমিট করুন"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
