"use client";

import { useEffect, useState } from "react";
import { Zap, X } from "lucide-react";

export default function NewsTickerBar() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isClosed = sessionStorage.getItem("shopgenie_ticker_closed");
    if (!isClosed) {
      setIsVisible(true);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("shopgenie_ticker_closed", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="bg-[#303d6e] text-white text-xs sm:text-sm py-1.5 px-3 flex items-center justify-between overflow-hidden relative z-50 border-b border-indigo-900/40">
      <div className="flex items-center gap-2 max-w-7xl mx-auto w-full overflow-hidden">
        <span className="bg-red-600 text-white font-bold px-2 py-0.5 rounded text-[11px] flex items-center gap-1 uppercase tracking-wider shrink-0 animate-pulse">
          <Zap size={13} className="fill-white" /> Special Notice
        </span>
        <div className="marquee-track whitespace-nowrap overflow-hidden flex-1">
          <div className="inline-block animate-marquee font-medium text-slate-100">
            ⭐ Recommended 🚀 আপনার পছন্দের সব জেনুইন গ্যাজেট, স্মার্টওয়াচ এবং ফ্যাশন কালেকশন পেয়ে যাচ্ছেন সবচেয়ে সুলভ মূল্যে! • দ্রুততম হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি সুবিধা!
          </div>
        </div>
      </div>
      <button
        onClick={handleClose}
        className="p-1 hover:bg-white/10 rounded-full text-slate-300 hover:text-white transition-colors ml-2 shrink-0"
        title="Close Notice"
        aria-label="Close Notice"
      >
        <X size={15} />
      </button>
    </div>
  );
}
