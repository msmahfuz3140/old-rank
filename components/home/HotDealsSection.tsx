"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Zap, Clock, Sparkles, ArrowRight, Bell, Flame } from "lucide-react";
import { IProduct } from "@/lib/types";
import { api } from "@/lib/api";
import PopUpProductCard from "@/components/product/PopUpProductCard";

interface HotDealsSectionProps {
  products: IProduct[];
  hotDeals: IProduct[];
}

interface HotDealSettings {
  isOfferActive: boolean;
  offerTitle: string;
  offerSubtitle: string;
  offerEndTime: string;
  discountBadge: string;
}

export default function HotDealsSection({ products, hotDeals }: HotDealsSectionProps) {
  const [settings, setSettings] = useState<HotDealSettings>({
    isOfferActive: true,
    offerTitle: "হট ডিল কালেকশন",
    offerSubtitle: "সবচেয়ে বেশি বিক্রিত পণ্যগুলোতে বিশাল ডিসকাউন্ট অফার",
    offerEndTime: new Date(Date.now() + 14 * 3600 * 1000 + 35 * 60 * 1000).toISOString(),
    discountBadge: "সীমিত স্টক",
  });

  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalSeconds: number;
  }>({
    days: 0,
    hours: 12,
    minutes: 35,
    seconds: 40,
    totalSeconds: 45340,
  });

  const [isMounted, setIsMounted] = useState(false);

  // Load settings from backend and local cache
  useEffect(() => {
    setIsMounted(true);

    const loadSettings = async () => {
      try {
        const data = await api.getHotDealSettings();
        if (data) {
          setSettings(data);
        }
      } catch (err) {
        console.warn("Could not load hot deal settings:", err);
      }
    };

    loadSettings();

    // Listen for live update events from the Admin Panel
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setSettings(e.detail);
      }
    };

    window.addEventListener("hot-offer-updated", handleUpdate);
    window.addEventListener("storage", loadSettings);

    return () => {
      window.removeEventListener("hot-offer-updated", handleUpdate);
      window.removeEventListener("storage", loadSettings);
    };
  }, []);

  // Real-time 1-second countdown calculation
  useEffect(() => {
    const calculateTime = () => {
      if (!settings.offerEndTime) return;

      const target = new Date(settings.offerEndTime).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);
      const totalSeconds = Math.floor(diff / 1000);

      const days = Math.floor(totalSeconds / (3600 * 24));
      const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;

      setTimeLeft({ days, hours, minutes, seconds, totalSeconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.offerEndTime]);

  // Determine if offer is currently active and not expired
  const isOfferLive = settings.isOfferActive && timeLeft.totalSeconds > 0;
  const displayProducts = (hotDeals.length > 0 ? hotDeals : products).slice(0, 4);

  return (
    <section id="hot-deals" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      {isOfferLive ? (
        /* ================= ACTIVE LIVE OFFER BANNER ================= */
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl text-white mb-4 sm:mb-6 relative overflow-hidden">
          {/* Subtle decorative glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 relative z-10">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white text-red-600 flex items-center justify-center font-bold shadow shrink-0 animate-pulse">
                <Zap size={22} className="fill-red-600 sm:w-[26px] sm:h-[26px]" />
              </div>
              <div>
                <h2 className="text-base sm:text-2xl font-black tracking-tight flex items-center gap-1.5 sm:gap-2">
                  {settings.offerTitle || "হট ডিল কালেকশন"}
                  <span className="text-[10px] sm:text-xs bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded-full shadow-sm">
                    {settings.discountBadge || "সীমিত স্টক"}
                  </span>
                </h2>
                <p className="text-[11px] sm:text-xs text-rose-100 font-medium mt-0.5">
                  {settings.offerSubtitle || "সবচেয়ে বেশি বিক্রিত পণ্যগুলোতে বিশাল ডিসকাউন্ট অফার"}
                </p>
              </div>
            </div>

            {/* Live Real-Time Ticking Countdown Timer */}
            <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[11px] sm:text-xs font-black bg-black/35 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-white/20 w-fit self-start sm:self-auto shadow-inner">
              <div className="flex items-center gap-1 text-amber-300 font-sans text-[10px] sm:text-xs font-bold mr-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <span className="hidden xs:inline">অফার বাকি:</span>
              </div>

              {timeLeft.days > 0 && (
                <>
                  <div className="flex flex-col items-center">
                    <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded font-black shadow-sm">
                      {String(timeLeft.days).padStart(2, "0")}d
                    </span>
                  </div>
                  <span>:</span>
                </>
              )}

              <div className="flex flex-col items-center">
                <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded font-black shadow-sm">
                  {String(timeLeft.hours).padStart(2, "0")}h
                </span>
              </div>
              <span>:</span>

              <div className="flex flex-col items-center">
                <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded font-black shadow-sm">
                  {String(timeLeft.minutes).padStart(2, "0")}m
                </span>
              </div>
              <span>:</span>

              <div className="flex flex-col items-center">
                <span className="bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded font-black shadow-sm animate-pulse">
                  {String(timeLeft.seconds).padStart(2, "0")}s
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================= OFFER COMING SOON BANNER ================= */
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/30 rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl text-white mb-4 sm:mb-6 relative overflow-hidden">
          {/* Ambient Glows */}
          <div className="absolute -top-10 -right-10 w-60 h-60 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 relative z-10 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-3 sm:gap-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-amber-500/25 shrink-0">
                <Clock size={28} className="animate-spin duration-1000" style={{ animationDuration: "8s" }} />
              </div>
              <div>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2.5 py-0.5 rounded-full">
                    <Sparkles size={12} className="text-amber-300" /> Offer Coming Soon
                  </span>
                  <span className="text-[10px] sm:text-xs font-semibold text-slate-400">
                    ধামাকা ডিসকাউন্ট প্রস্তুতি চলছে
                  </span>
                </div>
                <h2 className="text-lg sm:text-2xl font-black text-white tracking-tight">
                  শীঘ্রই নতুন মেগা ধামাকা হট ডিল আসছে!
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 font-medium mt-1 max-w-xl">
                  আমাদের পরবর্তী এক্সক্লুসিভ অফার ও ফ্ল্যাশ সেলের প্রস্তুতি চলছে। নতুন অফারের আপডেট পেতে চোখ রাখুন অথবা এখনই আমাদের ট্রেন্ডিং কালেকশন এক্সপ্লোর করুন।
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/category/all"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm px-5 py-2.5 sm:py-3 rounded-xl shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition-all"
              >
                সব প্রোডাক্ট দেখুন <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hot Deals / Trending Products Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
        {displayProducts.map((p, idx) => (
          <PopUpProductCard key={p._id} product={p} index={idx} isPopHighlight={isOfferLive} />
        ))}
      </div>
    </section>
  );
}
