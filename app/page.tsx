import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ArrowRight,
  Sparkles,
  Gem,
  Clock,
} from "lucide-react";
import PopUpProductCard from "@/components/product/PopUpProductCard";
import HotDealsSection from "@/components/home/HotDealsSection";
import { api } from "@/lib/api";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    api.getProducts(),
    api.getCategories(),
  ]);

  // Ensure Jewelry is always strictly the FIRST category
  const sortedCategories = [
    ...categories.filter((c) => c.slug === "jewelry"),
    ...categories.filter((c) => c.slug !== "jewelry" && c.slug !== "all"),
  ];

  // All products directly from the database
  const allProducts = products;
  const hotDeals = allProducts.filter((p) => p.isHotDeal);

  return (
    <div className="space-y-8 sm:space-y-12 pb-16 bg-[#f8fafc] pt-4 sm:pt-6">
      {/* 1. Category Section FIRST (পছন্দের ক্যাটাগরি বেছে নিন) */}
      <section id="categories" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl p-6 sm:p-10 md:p-12 text-white shadow-2xl mb-6 overflow-hidden border border-slate-700/60 min-h-[260px] sm:min-h-[300px] flex items-center">
          {/* Responsive Background Image Layer */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/category-showcase-banner.jpg"
              alt="Old Rank Exclusive Showcase"
              className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-700 hover:scale-100"
            />
            {/* Elegant multi-layer dark gradient overlay so text remains 100% readable and luxury */}
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/80 to-slate-950/60 sm:from-slate-950/90 sm:via-slate-950/75 sm:to-slate-950/40" />
            <div className="absolute inset-0 bg-radial-at-c from-transparent via-slate-950/30 to-slate-950/70" />
          </div>

          <div className="relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="max-w-2xl">
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-xs font-black px-3.5 py-1.5 rounded-full uppercase tracking-wider mb-3 shadow-md border border-amber-300/60">
                <Sparkles size={14} className="fill-slate-950" /> এক্সক্লুসিভ কালেকশন
              </span>
              <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white drop-shadow-md">
                পছন্দের ক্যাটাগরি বেছে নিন
              </h1>
              <p className="text-xs sm:text-base text-slate-200 mt-2 font-medium leading-relaxed max-w-xl drop-shadow">
                আমাদের প্রিমিয়াম জুয়েলারি শপ এখন উন্মুক্ত! অন্যান্য ক্যাটাগরি শীঘ্রই আসছে।
              </p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/category/jewelry"
                className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-xl hover:shadow-amber-400/30 transition-all flex items-center gap-2 border border-amber-300/80 active:scale-95 group cursor-pointer"
              >
                <Gem size={17} className="group-hover:rotate-12 transition-transform" />
                <span>জুয়েলারি শপ ভিজিট করুন</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>

        {/* Categories Grid (Jewelry is First, Others Coming Soon with Inactive Buttons) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-5">
          {sortedCategories.map((cat, index) => {
            const isJewelry = cat.slug === "jewelry" || index === 0;
            const isComingSoon = !isJewelry;

            return (
              <div key={cat._id} className="relative">
                {isComingSoon ? (
                  <div className="group relative bg-white/95 rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs text-center flex flex-col items-center opacity-85 select-none cursor-not-allowed">
                    {/* Badge: Coming Soon */}
                    <span className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border border-amber-300 shadow-sm flex items-center gap-1">
                      <Clock size={11} className="stroke-[3]" /> Coming Soon
                    </span>

                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 mb-3 grayscale opacity-60 border border-slate-200">
                      <img
                        src={cat.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-700 line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-amber-700 font-semibold mt-1">
                      এই ক্যাটাগরি শীঘ্রই আসছে
                    </p>

                    {/* Inactive Disabled Button */}
                    <button
                      disabled
                      aria-disabled="true"
                      className="w-full mt-3 py-2 px-3 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs border border-slate-200 cursor-not-allowed select-none opacity-80 flex items-center justify-center gap-1.5 pointer-events-none"
                    >
                      বাটন নিষ্ক্রিয় (Inactive)
                    </button>
                  </div>
                ) : (
                  <Link
                    href={`/category/${cat.slug}`}
                    className="group block relative bg-gradient-to-b from-white to-amber-50/20 rounded-2xl p-4 sm:p-5 border-2 border-indigo-600 shadow-lg hover:shadow-2xl transition-all text-center flex flex-col items-center ring-4 ring-indigo-500/10"
                  >
                    {/* Active Badge */}
                    <span className="absolute top-2.5 right-2.5 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span> ওপেন (Active)
                    </span>

                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-indigo-50 mb-3 group-hover:scale-105 transition-transform border border-indigo-200 shadow-xs">
                      <img
                        src={cat.image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&auto=format&fit=crop&q=80"}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#303d6e] transition-colors line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-emerald-700 font-bold mt-1">
                      এক্সক্লুসিভ কালেকশন উন্মুক্ত
                    </p>

                    {/* Active Clickable Button */}
                    <span className="w-full mt-3 py-2 px-4 rounded-xl bg-[#303d6e] group-hover:bg-indigo-900 text-white font-black text-xs flex items-center justify-center gap-1.5 shadow-md transition-colors">
                      কালেকশন দেখুন <ArrowRight size={13} />
                    </span>
                  </Link>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Trust Badges / Value Proposition */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-4 p-3.5 sm:p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
          <div className="flex items-center gap-2.5 sm:gap-3.5 p-1.5 sm:p-2">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-indigo-50 text-[#303d6e] flex items-center justify-center shrink-0 border border-indigo-100">
              <Truck size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">দ্রুত ডেলিভারি</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">সারা দেশে ক্যাশ অন ডেলিভারি</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5 p-1.5 sm:p-2">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
              <ShieldCheck size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">১০০% আসল জুয়েলারি</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">প্রিমিয়াম ফিনিশ ও লং-লাস্টিং পলিশ</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5 p-1.5 sm:p-2">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <RotateCcw size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">৭ দিনের রিটার্ন</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">সহজ রিটার্ন সুবিধা</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5 p-1.5 sm:p-2">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
              <Headphones size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">লাইভ সাপোর্ট</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">২৪/৭ কাস্টমার সার্ভিস</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Exclusive Jewelry Collection Showcase (Active Main Category) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                <Gem size={12} /> রাজকীয় জুয়েলারি কালেকশন
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
              প্রিমিয়াম জুয়েলারি ও অলংকার (Exclusive Jewelry)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              ব্রাইডাল নেকলেস, পার্টি ইয়াররিংস, গোল্ড প্লেটেড চুড়ি, কুন্দন আংটি ও ডায়মন্ড-কাট ব্রেসলেটের এক্সক্লুসিভ কালেকশন
            </p>
          </div>
          <Link
            href="/category/jewelry"
            className="text-xs sm:text-sm font-bold text-[#303d6e] hover:text-indigo-900 flex items-center gap-1 shrink-0 self-start sm:self-auto bg-indigo-50 px-3.5 py-2 rounded-xl border border-indigo-100"
          >
            সব জুয়েলারি দেখুন <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {allProducts.map((p, idx) => (
            <PopUpProductCard key={p._id} product={p} index={idx} />
          ))}
        </div>
      </section>

      {/* 3. Hot Deals & Live Offer Section (Placed after Main Category Section) */}
      <HotDealsSection products={allProducts} hotDeals={hotDeals} />

      {/* 4. All Store Products Grid */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                All Products
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              শপের সমস্ত প্রোডাক্ট কালেকশন
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              আমাদের সমস্ত ট্রেন্ডিং প্রিমিয়াম প্রোডাক্ট ব্রাউজ করুন
            </p>
          </div>
          <Link
            href="/category/jewelry"
            className="text-xs sm:text-sm font-bold text-[#303d6e] hover:underline flex items-center gap-1 shrink-0"
          >
            সব দেখুন <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {allProducts.map((p, idx) => (
            <PopUpProductCard key={p._id} product={p} index={idx} />
          ))}
        </div>
      </section>
    </div>
  );
}

