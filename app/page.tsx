import Link from "next/link";
import {
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  Headphones,
  ArrowRight,
  Store,
} from "lucide-react";
import ProductCard from "@/components/product/ProductCard";
import PromoAdBanners from "@/components/home/PromoAdBanners";
import HeroSlider from "@/components/home/HeroSlider";
import { api } from "@/lib/api";

export default async function HomePage() {
  const [products, categories, vendors] = await Promise.all([
    api.getProducts(),
    api.getCategories(),
    api.getVendors(),
  ]);

  const hotDeals = products.filter((p) => p.isHotDeal);
  const electronicsProducts = products.filter(
    (p) => (typeof p.category === "object" ? p.category.slug : p.category) === "electronics"
  );
  const womenProducts = products.filter((p) => {
    const slug = typeof p.category === "object" ? p.category.slug : p.category;
    return slug === "womens-fashion" || slug === "beauty-cosmetics";
  });
  const babyProducts = products.filter(
    (p) => (typeof p.category === "object" ? p.category.slug : p.category) === "baby-kids"
  );
  const homeElectricProducts = products.filter(
    (p) => (typeof p.category === "object" ? p.category.slug : p.category) === "home-appliances"
  );
  const fashionProducts = products.filter(
    (p) => (typeof p.category === "object" ? p.category.slug : p.category) === "fashion"
  );

  return (
    <div className="space-y-8 sm:space-y-12 pb-16 bg-[#f8fafc]">
      {/* 1. Ultra-Professional Animated Hero Slider */}
      <HeroSlider />

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
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">১০০% আসল পণ্য</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">অফিশিয়াল ব্র্যান্ড ওয়ারেন্টি</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5 p-1.5 sm:p-2">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
              <RotateCcw size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">৭ দিনের রিটার্ন</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">সহজ রিফান্ড ও রিটার্ন</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-3.5 p-1.5 sm:p-2">
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
              <Headphones size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <div>
              <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-tight">লাইভ সাপোর্ট</h4>
              <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium mt-0.5">২৪/৭ হেল্পলাইন সার্ভিস</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Top Categories */}
      <section id="categories" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              পপুলার ক্যাটাগরি
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
              আপনার পছন্দের ক্যাটাগরি থেকে ব্রাউজ করুন
            </p>
          </div>
          <Link
            href="/category/all"
            className="text-xs sm:text-sm font-bold text-[#303d6e] hover:underline flex items-center gap-1"
          >
            সব ক্যাটাগরি <ArrowRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2.5 sm:gap-4">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className="group bg-white rounded-xl sm:rounded-2xl p-2.5 sm:p-4 border border-slate-200/80 shadow-xs hover:shadow-lg hover:border-indigo-200 transition-all text-center flex flex-col items-center"
            >
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-50 mb-2 sm:mb-3 group-hover:scale-105 transition-transform border border-slate-100">
                <img
                  src={cat.image || "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60"}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-[11px] sm:text-xs md:text-sm font-bold text-slate-800 group-hover:text-[#303d6e] transition-colors line-clamp-1">
                {cat.name}
              </h3>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Promotional Advertisement Banners */}
      <PromoAdBanners />

      {/* 5. Hot Deals Section */}
      <section id="hot-deals" className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 rounded-2xl sm:rounded-3xl p-4 sm:p-7 shadow-xl text-white mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white text-red-600 flex items-center justify-center font-bold shadow shrink-0">
                <Zap size={22} className="fill-red-600 sm:w-[26px] sm:h-[26px]" />
              </div>
              <div>
                <h2 className="text-base sm:text-2xl font-black tracking-tight flex items-center gap-1.5 sm:gap-2">
                  হট ডিল কালেকশন <span className="text-[10px] sm:text-xs bg-amber-400 text-slate-900 font-bold px-2 py-0.5 rounded-full">সীমিত স্টক</span>
                </h2>
                <p className="text-[11px] sm:text-xs text-rose-100 font-medium mt-0.5">
                  সবচেয়ে বেশি বিক্রিত পণ্যগুলোতে বিশাল ডিসকাউন্ট অফার
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[11px] sm:text-xs font-black bg-black/30 backdrop-blur-md px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl sm:rounded-2xl border border-white/20 w-fit">
              <span>অফার বাকি:</span>
              <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded">12h</span> :
              <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded">35m</span> :
              <span className="bg-white text-slate-900 px-1.5 py-0.5 rounded">40s</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
          {(hotDeals.length > 0 ? hotDeals : products).slice(0, 4).map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      </section>

      {/* 6. Electronics Showcase */}
      {electronicsProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                Electronics & Gaming Setup
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                লেটেস্ট কম্পিউটার, এক্সেসরিজ ও মনিটর
              </p>
            </div>
            <Link
              href="/category/electronics"
              className="text-xs sm:text-sm font-bold text-[#303d6e] hover:underline flex items-center gap-1 shrink-0"
            >
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {electronicsProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 7. Women's Exclusive Fashion & Beauty */}
      {womenProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-pink-600 bg-pink-50 px-2 py-0.5 rounded-full">
                  Women's Exclusive
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                মেয়েদের ফ্যাশন ও রূপচর্চা কালেকশন
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 hidden xs:block">
                আসল ঐতিহ্যবাহী জামদানি শাড়ি, পার্টি থ্রি-পিস, হ্যান্ডব্যাগ ও ব্রাইটনিং সিরাম
              </p>
            </div>
            <Link
              href="/category/womens-fashion"
              className="text-xs sm:text-sm font-bold text-pink-600 hover:text-pink-700 flex items-center gap-1 shrink-0"
            >
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {womenProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 8. Baby & Kids Care Collection */}
      {babyProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Baby & Toddlers
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                বেবি ও বাচ্চাদের কালেকশন
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 hidden xs:block">
                ১০০% অর্গানিক নরম সুতি রম্পার, ফিডার সেট, ফোল্ডিং স্ট্রোলার ও শিক্ষণীয় খেলনা
              </p>
            </div>
            <Link
              href="/category/baby-kids"
              className="text-xs sm:text-sm font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1 shrink-0"
            >
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {babyProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 9. Smart Home & Kitchen Electric Appliances */}
      {homeElectricProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                  Smart Home
                </span>
              </div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight mt-1">
                হোম ও কিচেন ইলেকট্রনিক্স
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5 hidden xs:block">
                ডিজিটাল এয়ার ফ্রায়ার, মিক্সার ব্লেন্ডার, স্টিম আয়রন ও অটোমেটিক রোবট ক্লিনার
              </p>
            </div>
            <Link
              href="/category/home-appliances"
              className="text-xs sm:text-sm font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1 shrink-0"
            >
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {homeElectricProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 10. Men's Fashion Showcase */}
      {fashionProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div>
              <h2 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                Trendy Men's Fashion
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-500 font-medium mt-0.5">
                প্রিমিয়াম সুতি শার্ট ও স্ট্রেচ চিনো প্যান্ট কালেকশন
              </p>
            </div>
            <Link
              href="/category/fashion"
              className="text-xs sm:text-sm font-bold text-[#303d6e] hover:underline flex items-center gap-1 shrink-0"
            >
              সব দেখুন <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-6">
            {fashionProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* 11. Multi-Vendor / Verified Sellers Spotlight */}
      <section className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-4 sm:mb-6">
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
