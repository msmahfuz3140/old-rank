import Link from "next/link";
import { ArrowRight, Sparkles, Zap } from "lucide-react";

export default function PromoAdBanners() {
  return (
    <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {/* Ad Banner 1: Tech & Gaming Megadeal */}
        <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-indigo-950 via-[#232d52] to-slate-900 text-white p-5 sm:p-8 shadow-lg flex flex-col justify-between border border-indigo-800/40">
          <div className="relative z-10 max-w-sm space-y-2.5 sm:space-y-3">
            <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider shadow">
              <Zap size={12} className="fill-slate-950" /> মেগা গ্যাজেট অফার
            </span>
            <h3 className="text-lg sm:text-2xl font-black tracking-tight leading-snug">
              Desktop PC & Smartwatch Setup
            </h3>
            <p className="text-xs sm:text-sm text-indigo-200 leading-relaxed font-medium">
              সবচেয়ে জনপ্রিয় গেমিং ফুল সেটআপ এবং স্মার্টওয়াচে পাচ্ছেন ২৫% পর্যন্ত স্পেশাল ছাড়!
            </p>
            <div className="pt-1.5 sm:pt-2">
              <Link
                href="/category/electronics"
                className="inline-flex items-center gap-2 bg-white text-[#303d6e] hover:bg-amber-400 hover:text-slate-950 font-black text-xs px-4 sm:px-5 py-2.5 rounded-xl shadow transition-all group-hover:scale-105 active:scale-95"
              >
                এখনই কিনুন <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Floating Product Cutout Graphic */}
          <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 w-32 sm:w-56 h-32 sm:h-56 opacity-40 sm:opacity-85 group-hover:scale-105 group-hover:rotate-2 transition-transform duration-500 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80"
              alt="Smartwatch Deal"
              className="w-full h-full object-contain rounded-2xl drop-shadow-2xl"
            />
          </div>

          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />
        </div>

        {/* Ad Banner 2: Fashion Trend */}
        <div className="group relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-br from-rose-950 via-pink-950 to-slate-900 text-white p-5 sm:p-8 shadow-lg flex flex-col justify-between border border-rose-800/40">
          <div className="relative z-10 max-w-sm space-y-2.5 sm:space-y-3">
            <span className="inline-flex items-center gap-1.5 bg-rose-400 text-slate-950 text-[10px] sm:text-xs font-black px-2.5 sm:px-3 py-1 rounded-full uppercase tracking-wider shadow">
              <Sparkles size={12} className="fill-slate-950" /> ট্রেন্ডি ফ্যাশন ডিল
            </span>
            <h3 className="text-lg sm:text-2xl font-black tracking-tight leading-snug">
              প্রিমিয়াম কটন শার্ট ও চিনো প্যান্ট
            </h3>
            <p className="text-xs sm:text-sm text-rose-200 leading-relaxed font-medium">
              ১০০% এক্সপোর্ট কোয়ালিটি ফ্যাশন কালেকশন। আরামদায়ক ফিটিং এবং দীর্ঘস্থায়ী রং।
            </p>
            <div className="pt-1.5 sm:pt-2">
              <Link
                href="/category/fashion"
                className="inline-flex items-center gap-2 bg-white text-rose-950 hover:bg-rose-400 hover:text-slate-950 font-black text-xs px-4 sm:px-5 py-2.5 rounded-xl shadow transition-all group-hover:scale-105 active:scale-95"
              >
                কালেকশন দেখুন <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Floating Product Cutout Graphic */}
          <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 w-32 sm:w-56 h-32 sm:h-56 opacity-40 sm:opacity-85 group-hover:scale-105 group-hover:-rotate-2 transition-transform duration-500 pointer-events-none">
            <img
              src="https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=80"
              alt="Fashion Deal"
              className="w-full h-full object-contain rounded-2xl drop-shadow-2xl"
            />
          </div>

          <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
