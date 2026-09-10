import Link from "next/link";
import { Store, ShieldCheck, Star, MapPin, Phone, ArrowRight } from "lucide-react";
import { api } from "@/lib/api";

export const metadata = {
  title: "Verified Sellers & Shops | Shop Genie",
  description: "Browse all certified merchant stores and vendors across Bangladesh.",
};

export default async function SellersPage() {
  const vendors = await api.getVendors();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-[#303d6e] flex items-center justify-center mx-auto shadow-xs">
          <Store size={28} />
        </div>
        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
          ভেরিফাইড মার্চেন্ট ও স্টোরসমূহ
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          আমাদের প্ল্যাটফর্মের শতভাগ আসল পণ্য বিক্রেতাদের তালিকা থেকে সরাসরি কেনাকাটা করুন
        </p>
      </div>

      {/* Sellers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.map((v) => (
          <div
            key={v._id}
            className="bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
          >
            {/* Banner */}
            <div
              className="h-32 bg-cover bg-center relative"
              style={{ backgroundImage: `url(${v.banner})` }}
            >
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" />
            </div>

            {/* Content */}
            <div className="px-6 pb-6 pt-0 relative flex-1 flex flex-col justify-between">
              <div className="flex items-end justify-between -mt-10 mb-3">
                <img
                  src={v.logo}
                  alt={v.shopName}
                  className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-md bg-white shrink-0"
                />
                <span className="bg-emerald-50 text-emerald-700 text-xs font-black px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1 shadow-xs">
                  <ShieldCheck size={13} /> Verified
                </span>
              </div>

              <div>
                <h3 className="text-lg font-black text-slate-900 mb-1 group-hover:text-[#303d6e] transition-colors">
                  {v.shopName}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed mb-4">
                  {v.description}
                </p>

                <div className="space-y-1.5 text-xs text-slate-500 border-t border-slate-50 pt-3 mb-4">
                  <p className="flex items-center gap-2">
                    <MapPin size={13} className="text-indigo-600 shrink-0" />
                    <span className="truncate">{v.address}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone size={13} className="text-indigo-600 shrink-0" />
                    <span>{v.phone}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
                <div className="flex items-center gap-1 text-amber-500 font-bold">
                  <Star size={13} className="fill-amber-500" />
                  <span className="text-slate-900">{v.rating}</span>
                  <span className="text-slate-400 font-normal">({v.reviewCount} reviews)</span>
                </div>

                <Link
                  href={`/shop/${v.slug}`}
                  className="bg-[#303d6e] hover:bg-indigo-900 text-white font-bold px-4 py-2 rounded-xl transition-all text-xs flex items-center gap-1 shadow-sm"
                >
                  ভিজিট শপ <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
