"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Sparkles, ArrowRight, Tag } from "lucide-react";

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hoursToWait = 3;
    const timeLimit = hoursToWait * 60 * 60 * 1000;
    const lastShown = localStorage.getItem("shopgenie_promo_last_shown");
    const now = Date.now();

    if (!lastShown || now - Number(lastShown) > timeLimit) {
      const timer = setTimeout(() => {
        setIsOpen(true);
        localStorage.setItem("shopgenie_promo_last_shown", String(now));
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 animate-scale-up">
        {/* Close Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white flex items-center justify-center transition-colors shadow"
          aria-label="Close Promo"
        >
          <X size={18} />
        </button>

        {/* Banner Graphic Header */}
        <div className="relative h-48 bg-gradient-to-tr from-[#303d6e] via-indigo-700 to-indigo-950 p-6 flex flex-col justify-end text-white overflow-hidden">
          <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
          <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-full w-fit mb-2 shadow">
            <Sparkles size={13} className="fill-slate-900" /> বিশেষ মেগা অফার
          </span>
          <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
            প্রথম অর্ডারে পান ১০% ছাড়!
          </h3>
          <p className="text-xs text-indigo-200 mt-1">
            যেকোনো গ্যাজেট ও লাইফস্টাইল প্রডাক্টে সীমিত সময়ের ধামাকা ডিসকাউন্ট
          </p>
        </div>

        {/* Promo Body */}
        <div className="p-6">
          <div className="bg-slate-50 border border-dashed border-indigo-200 rounded-2xl p-4 flex items-center justify-between mb-5">
            <div>
              <span className="text-xs text-slate-500 font-medium block">কুপন কোড ব্যবহার করুন:</span>
              <span className="text-xl font-black text-[#303d6e] tracking-wider flex items-center gap-1 mt-0.5">
                <Tag size={16} /> SAVE10
              </span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText("SAVE10");
                alert("কুপন কোড SAVE10 কপি হয়েছে!");
              }}
              className="bg-[#303d6e] hover:bg-indigo-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm active:scale-95"
            >
              কপি করুন
            </button>
          </div>

          <div className="flex gap-3">
            <Link
              href="/checkout"
              onClick={() => setIsOpen(false)}
              className="flex-1 bg-[#303d6e] hover:bg-indigo-800 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-900/20 transition-all hover:scale-[1.02]"
            >
              অর্ডার করুন এখনই <ArrowRight size={16} />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-4 rounded-xl text-sm transition-colors"
            >
              পরে দেখব
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
