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

  if (products.length === 0) {
    return (
      <div className="text-center py-20 text-slate-400 text-sm">
        এই ক্যাটাগরিতে বর্তমানে কোনো পণ্য পাওয়া যায়নি।
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
