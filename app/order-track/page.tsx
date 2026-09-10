"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  AlertCircle,
} from "lucide-react";
import { api } from "@/lib/api";

function TrackContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);
  const [orders, setOrders] = useState<any[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (searchTarget?: string) => {
    const q = searchTarget || query;
    if (!q.trim()) return;

    setLoading(true);
    setError("");
    setOrders(null);

    const res = await api.trackOrder(q.trim());
    if (res.success && res.data && res.data.length > 0) {
      setOrders(res.data);
    } else {
      setError(res.message || "কোনো অর্ডার পাওয়া যায়নি। সঠিক তথ্য দিয়ে পুনরায় চেষ্টা করুন।");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (initialQuery) {
      handleTrack(initialQuery);
    }
  }, [initialQuery]);

  const milestones = [
    { key: "placed", label: "অর্ডার গৃহীত", desc: "Order Placed" },
    { key: "confirmed", label: "কনফার্মড", desc: "Processing" },
    { key: "shipped", label: "কুরিয়ারে হস্তান্তর", desc: "In Transit" },
    { key: "delivered", label: "ডেলিভারি সম্পন্ন", desc: "Delivered" },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#303d6e] flex items-center justify-center mx-auto mb-3 shadow-xs">
          <Truck size={28} />
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          অর্ডার ট্র্যাকিং সিস্টেম
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          আপনার মোবাইল নম্বর অথবা ইনভয়েস আইডি দিন
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleTrack();
          }}
          className="mt-6 flex gap-2"
        >
          <input
            type="text"
            required
            placeholder="যেমন: 017xxxxxxxx অথবা SG-10025"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#303d6e] shadow-xs"
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-[#303d6e] hover:bg-indigo-900 text-white font-bold px-6 py-3 rounded-2xl text-sm flex items-center gap-2 shadow-md transition-all active:scale-95 disabled:opacity-50"
          >
            {loading ? "খোঁজা হচ্ছে..." : <><Search size={16} /> ট্র্যাক করুন</>}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-center justify-center gap-2">
            <AlertCircle size={15} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Track Results */}
      {orders && (
        <div className="space-y-8 animate-fade-in">
          {orders.map((order, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xl space-y-6"
            >
              {/* Order Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-6 border-b border-slate-100">
                <div>
                  <span className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider block">
                    Invoice ID:
                  </span>
                  <h3 className="text-xl font-black text-slate-900 font-mono">
                    {order.invoiceId}
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-indigo-50 text-[#303d6e] text-xs font-black uppercase px-3 py-1.5 rounded-full border border-indigo-100">
                    স্ট্যাটাস: {order.status}
                  </span>
                  <span className="text-xs font-bold text-slate-900">
                    সর্বমোট: ৳ {order.grandTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Progress Milestones */}
              <div className="py-4">
                <div className="grid grid-cols-4 gap-2 text-center relative">
                  {/* Background progress bar */}
                  <div className="absolute top-4 left-6 right-6 h-1 bg-slate-100 -z-0" />

                  {milestones.map((step, sIdx) => {
                    const isPassed =
                      (order.status === "pending" && sIdx === 0) ||
                      (order.status === "processing" && sIdx <= 1) ||
                      (order.status === "shipped" && sIdx <= 2) ||
                      (order.status === "delivered" && sIdx <= 3);

                    return (
                      <div key={sIdx} className="flex flex-col items-center relative z-10">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                            isPassed
                              ? "bg-[#303d6e] text-white ring-4 ring-indigo-50"
                              : "bg-slate-200 text-slate-400"
                          }`}
                        >
                          {isPassed ? <CheckCircle2 size={16} /> : sIdx + 1}
                        </div>
                        <span className="text-xs font-bold text-slate-800 mt-2 block">
                          {step.label}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium block">
                          {step.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <p className="text-slate-400 font-semibold mb-0.5">গ্রাহকের তথ্য:</p>
                  <p className="font-bold text-slate-900">{order.customer?.name}</p>
                  <p className="text-slate-600 font-mono">{order.customer?.phone}</p>
                </div>
                <div>
                  <p className="text-slate-400 font-semibold mb-0.5">ডেলিভারি ঠিকানা:</p>
                  <p className="font-medium text-slate-800">
                    {order.customer?.address}, {order.customer?.district}
                  </p>
                  <p className="text-slate-500">পেমেন্ট মেথড: {order.paymentMethod?.toUpperCase()}</p>
                </div>
              </div>

              {/* Order Items */}
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase mb-3">
                  অর্ডারের পণ্যসমূহ ({order.items?.length || 0}):
                </h4>
                <div className="space-y-2">
                  {order.items?.map((item: any, iIdx: number) => (
                    <div
                      key={iIdx}
                      className="flex items-center justify-between text-xs p-2.5 rounded-xl border border-slate-100"
                    >
                      <span className="font-semibold text-slate-800">{item.name}</span>
                      <span className="font-black text-slate-900">
                        Qty: {item.quantity} • ৳ {item.price.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OrderTrackPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Suspense fallback={<div className="p-8 text-center text-sm">লোড হচ্ছে...</div>}>
        <TrackContent />
      </Suspense>
    </div>
  );
}
