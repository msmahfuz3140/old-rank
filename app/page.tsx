import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ArrowRight,
  Store,
  Sparkles,
  Gem,
  Clock,
} from "lucide-react";
import PopUpProductCard from "@/components/product/PopUpProductCard";
import HotDealsSection from "@/components/home/HotDealsSection";
import { api } from "@/lib/api";

export default async function HomePage() {
  const [products, categories, vendors] = await Promise.all([
    api.getProducts(),
    api.getCategories(),
    api.getVendors(),
  ]);

  const hotDeals = products.filter((p) => p.isHotDeal);
  
  // Jewelry items
  const jewelryProducts = products.filter((p) => {
    const slug = typeof p.category === "object" ? p.category.slug : p.category;
    return slug === "jewelry" || slug === "womens-fashion";
  });

  const displayJewelry = jewelryProducts.length > 0 ? jewelryProducts : products;

  return (
    <div className="space-y-8 sm:space-y-12 pb-16 bg-[#f8fafc] pt-4 sm:pt-6">
      {/* 1. Category Section FIRST (As requested - Entering website shows Categories first) */}
      <section id="categories" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-5 sm:p-8 text-white shadow-xl mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider mb-2">
                <Sparkles size={13} /> এক্সক্লুসিভ কালেকশন
              </span>
              <h1 className="text-xl sm:text-3xl font-black tracking-tight leading-tight">
                পছন্দের ক্যাটাগরি বেছে নিন
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
                আমাদের প্রিমিয়াম জুয়েলারি কালেকশন এখন উন্মুক্ত! অন্যান্য ক্যাটাগরি শীঘ্রই আসছে।
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link
                href="/category/jewelry"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-lg transition-transform flex items-center gap-1.5"
              >
                <Gem size={15} /> জুয়েলারি শপ
              </Link>
              <Link
                href="/category/all"
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl transition-colors flex items-center gap-1"
              >
                সকল প্রোডাক্ট <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-5">
          {categories.map((cat) => {
            const isComingSoon = cat.isComingSoon;

            return (
              <div key={cat._id} className="relative">
                {isComingSoon ? (
                  <div className="group relative bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-slate-300 transition-all text-center flex flex-col items-center opacity-85 select-none">
                    <span className="absolute top-3 right-3 bg-amber-100 text-amber-800 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-200 shadow-2xs flex items-center gap-1">
                      <Clock size={10} /> শীঘ্রই আসছে
                    </span>

                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 mb-3 grayscale opacity-75 border border-slate-100">
                      <img
                        src={cat.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xs sm:text-sm font-bold text-slate-700 line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-amber-600 font-semibold mt-1">
                      শীঘ্রই উন্মুক্ত করা হবে
                    </p>
                  </div>
                ) : (
                  <Link
                    href={`/category/${cat.slug}`}
                    className="group block relative bg-white rounded-2xl p-4 sm:p-5 border-2 border-indigo-500/30 hover:border-indigo-600 shadow-md hover:shadow-xl transition-all text-center flex flex-col items-center ring-2 ring-indigo-500/10"
                  >
                    <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-xs flex items-center gap-1 animate-pulse">
                      <span className="w-1.5 h-1.5 rounded-full bg-white"></span> ওপেন
                    </span>

                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-indigo-50 mb-3 group-hover:scale-105 transition-transform border border-indigo-100">
                      <img
                        src={cat.image || "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&auto=format&fit=crop&q=80"}
                        alt={cat.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xs sm:text-sm font-black text-slate-900 group-hover:text-[#303d6e] transition-colors line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-[10px] text-emerald-600 font-bold mt-1 flex items-center gap-1">
                      কালেকশন দেখুন <ArrowRight size={10} />
                    </p>
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
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">১০০% প্রিমিয়াম পণ্য</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">গুণগত মানের নিশ্চয়তা</p>
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

      {/* 3. Exclusive Jewelry Collection Showcase (Active Main Category) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-amber-200">
                <Gem size={12} /> রাজকীয় জুয়েলারি কালেকশন
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1.5">
              প্রিমিয়াম জুয়েলারি ও অলংকার (Jewelry Collection)
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              ব্রাইডাল নেকলেস, পার্টি ইয়াররিংস, গোল্ড প্লেটেড চুড়ি ও কুন্দন আংটির এক্সক্লুসিভ কালেকশন
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
          {displayJewelry.map((p, idx) => (
            <PopUpProductCard key={p._id} product={p} index={idx} />
          ))}
        </div>
      </section>

      {/* 4. Hot Deals Section */}
      <HotDealsSection products={products} hotDeals={hotDeals} />

      {/* 5. All Products Section (সকল প্রোডাক্ট) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-100">
                All Items
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
              সকল প্রোডাক্ট (All Available Products)
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              স্টকের সমস্ত প্রিমিয়াম প্রোডাক্ট একসাথে ব্রাউজ করুন
            </p>
          </div>
          <Link
            href="/category/all"
            className="text-xs sm:text-sm font-bold text-[#303d6e] hover:underline flex items-center gap-1 shrink-0"
          >
            সব দেখুন <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
          {products.map((p, idx) => (
            <PopUpProductCard key={p._id} product={p} index={idx} />
          ))}
        </div>
      </section>

      {/* 6. Multi-Vendor / Verified Sellers Spotlight */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-50 text-[#303d6e] flex items-center justify-center font-bold border border-indigo-100 shrink-0">
              <Store size={17} />
            </div>
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                আমাদের ভেরিফাইড শপসমূহ
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
                টপ-রেটেড বিশ্বস্ত বিক্রেতাদের অফিশিয়াল স্টোর
              </p>
            </div>
          </div>
          <Link
            href="/sellers"
            className="text-xs sm:text-sm font-bold text-[#303d6e] hover:underline flex items-center gap-1 shrink-0"
          >
            সকল সেলার <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {vendors.map((v) => (
            <div
              key={v._id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all overflow-hidden flex flex-col justify-between"
            >
              <div
                className="h-24 sm:h-28 bg-cover bg-center relative"
                style={{ backgroundImage: `url(${v.banner})` }}
              >
                <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" />
              </div>

              <div className="px-4 pb-4 sm:px-6 sm:pb-6 pt-0 relative flex-1 flex flex-col justify-between">
                <div className="flex items-end justify-between -mt-8 sm:-mt-10 mb-2 sm:mb-3">
                  <img
                    src={v.logo}
                    alt={v.shopName}
                    className="w-14 h-14 sm:w-18 sm:h-18 rounded-xl sm:rounded-2xl object-cover border-3 sm:border-4 border-white shadow-md bg-white shrink-0"
                  />
                  <span className="bg-emerald-50 text-emerald-700 text-[10px] sm:text-xs font-extrabold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck size={12} /> Verified Shop
                  </span>
                </div>

                <div>
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mb-1">{v.shopName}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-3 sm:mb-4">
                    {v.description}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-2.5 sm:pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <span className="font-semibold text-[11px] sm:text-xs">⭐ {v.rating} ({v.reviewCount} রিভিউ)</span>
                  <Link
                    href={`/shop/${v.slug}`}
                    className="bg-[#303d6e] hover:bg-indigo-900 text-white font-bold px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-colors text-xs"
                  >
                    শপ ভিজিট করুন
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
