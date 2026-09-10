import { use } from "react";
import Link from "next/link";
import { ShieldCheck, Star, MapPin, Phone, ArrowLeft } from "lucide-react";
import { api, fallbackVendors } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

export default function ShopFrontPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const vendor =
    fallbackVendors.find((v) => v.slug === resolvedParams.slug) || fallbackVendors[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Back button */}
      <Link
        href="/sellers"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#303d6e] hover:underline"
      >
        <ArrowLeft size={14} /> সকল সেলার দেখুন
      </Link>

      {/* Shop Header Banner Card */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-md overflow-hidden">
        <div
          className="h-44 sm:h-56 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${vendor.banner})` }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
        </div>

        <div className="px-6 sm:px-8 pb-8 pt-0 relative">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-14 mb-4 gap-4">
            <div className="flex items-end gap-4">
              <img
                src={vendor.logo}
                alt={vendor.shopName}
                className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg bg-white shrink-0"
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                    {vendor.shopName}
                  </h1>
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-extrabold px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <ShieldCheck size={13} /> Verified
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">{vendor.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold bg-slate-50 p-3 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-1 text-amber-500">
                <Star size={15} className="fill-amber-500" />
                <span className="text-slate-900 font-extrabold">{vendor.rating}</span>
                <span className="text-slate-400 font-normal">({vendor.reviewCount})</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="text-slate-700">{vendor.totalProducts}+ পণ্য</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-4 border-t border-slate-100">
            <p className="flex items-center gap-1.5">
              <MapPin size={14} className="text-indigo-600" /> {vendor.address}
            </p>
            <p className="flex items-center gap-1.5">
              <Phone size={14} className="text-indigo-600" /> {vendor.phone}
            </p>
          </div>
        </div>
      </div>

      {/* Shop Products Listing */}
      <section className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          এই শপের পণ্যসমূহ
        </h2>
        {/* Render products */}
        <ShopProducts vendorSlug={resolvedParams.slug} />
      </section>
    </div>
  );
}

async function ShopProducts({ vendorSlug }: { vendorSlug: string }) {
  const products = await api.getProducts();
  const shopProducts = products.filter(
    (p) => (typeof p.vendor === "object" ? p.vendor?.slug : p.vendor) === vendorSlug
  );

  const displayList = shopProducts.length > 0 ? shopProducts : products.slice(0, 4);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {displayList.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
