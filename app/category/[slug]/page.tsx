import { use } from "react";
import Link from "next/link";
import { ArrowLeft, Layers } from "lucide-react";
import { api, fallbackCategories } from "@/lib/api";
import ProductCard from "@/components/product/ProductCard";

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const isAll = resolvedParams.slug === "all";
  const category = isAll
    ? { name: "সকল প্রোডাক্ট (All Products)", slug: "all" }
    : fallbackCategories.find((c) => c.slug === resolvedParams.slug) || {
        name: resolvedParams.slug.toUpperCase(),
        slug: resolvedParams.slug,
      };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs font-bold text-[#303d6e] hover:underline"
      >
        <ArrowLeft size={14} /> হোমপেজে ফিরুন
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#303d6e] flex items-center justify-center font-bold">
            <Layers size={22} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              {category.name}
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {isAll
                ? "ওল্ড র‍্যাংক-এর সমস্ত এক্সক্লুসিভ কালেকশন ও লেটেস্ট আইটেম"
                : "এই ক্যাটাগরির সকল সেরা অফার ও কালেকশন"}
            </p>
          </div>
        </div>
      </div>

      <CategoryProducts categorySlug={resolvedParams.slug} />
    </div>
  );
}

async function CategoryProducts({ categorySlug }: { categorySlug: string }) {
  const products = await api.getProducts({ category: categorySlug });

  const currentCat = fallbackCategories.find((c) => c.slug === categorySlug);
  if (currentCat?.isComingSoon || products.length === 0) {
    return (
      <div className="text-center py-20 px-4 bg-white rounded-3xl border border-slate-100 shadow-sm max-w-xl mx-auto space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto text-2xl font-black">
          ⏳
        </div>
        <h3 className="text-xl font-bold text-slate-900">শীঘ্রই আসছে (Coming Soon)</h3>
        <p className="text-sm text-slate-500">
          এই ক্যাটাগরির প্রিমিয়াম কালেকশন খুব শীঘ্রই যুক্ত করা হচ্ছে। আমাদের জুয়েলারি কালেকশন দেখতে ঘুরে আসুন!
        </p>
        <Link
          href="/category/jewelry"
          className="inline-flex items-center gap-2 bg-[#303d6e] hover:bg-indigo-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md"
        >
          জুয়েলারি কালেকশন দেখুন
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
