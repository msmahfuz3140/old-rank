"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Star,
  Check,
  Truck,
  ShieldCheck,
  ShoppingCart,
  ArrowRight,
  Store,
  RotateCcw,
} from "lucide-react";
import { api } from "@/lib/api";
import { useCartStore } from "@/lib/store";
import { IProduct } from "@/lib/types";
import ProductCard from "@/components/product/ProductCard";
import ProductImage from "@/components/product/ProductImage";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "spec">("desc");

  useEffect(() => {
    api.getProductBySlug(resolvedParams.slug).then((data) => {
      if (data && data.product) {
        setProduct(data.product);
        setSelectedImage(data.product.mainImage);
        setRelatedProducts(data.relatedProducts || []);
      }
    });
  }, [resolvedParams.slug]);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-sm font-semibold text-slate-400">
        পণ্যটির বিবরণ লোড হচ্ছে...
      </div>
    );
  }

  const activeVariant =
    product.variants && product.variants.length > 0
      ? product.variants[selectedVariantIndex]
      : null;

  // Wholesale pricing override if quantity matches
  let currentPrice = activeVariant ? activeVariant.price : product.basePrice;
  if (product.wholesalePrices && product.wholesalePrices.length > 0) {
    const applicableTier = [...product.wholesalePrices]
      .sort((a, b) => b.minQuantity - a.minQuantity)
      .find((t) => quantity >= t.minQuantity);
    if (applicableTier) {
      currentPrice = applicableTier.price;
    }
  }

  const handleAddToCart = () => {
    addItem(
      {
        productId: product._id,
        name: product.name,
        image: product.mainImage,
        price: currentPrice,
        slug: product.slug,
        variantInfo: activeVariant
          ? `${activeVariant.colorName || ""} ${activeVariant.sizeName || ""}`.trim()
          : undefined,
        colorName: activeVariant?.colorName,
        sizeName: activeVariant?.sizeName,
      },
      quantity
    );
  };

  const handleOrderNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  const allImages = [product.mainImage, ...(product.galleryImages || [])];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-slate-400 flex items-center gap-2">
        <Link href="/" className="hover:text-slate-700">Home</Link>
        <span>›</span>
        <span>{typeof product.category === "object" ? product.category.name : "Category"}</span>
        <span>›</span>
        <span className="text-slate-800 font-bold truncate">{product.name}</span>
      </nav>

      {/* Main Product Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
        {/* Left: Product Images Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-md aspect-square flex items-center justify-center p-2">
            <ProductImage
              src={selectedImage || product.mainImage}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl"
              showText={true}
              iconSize={40}
            />
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all shrink-0 bg-white ${
                    selectedImage === img ? "border-[#303d6e] shadow-md" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <ProductImage
                    src={img}
                    alt=""
                    className="w-full h-full object-cover"
                    showText={false}
                    iconSize={16}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Actions & Specs */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
              {typeof product.category === "object" ? product.category.name : "Exclusive"}
            </span>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-2 mb-2 leading-snug">
              {product.name}
            </h1>

            {/* Rating & Stock */}
            <div className="flex items-center gap-3 text-xs">
              <div className="flex items-center text-amber-400">
                <Star size={15} className="fill-amber-400" />
                <span className="font-bold text-slate-700 ml-1">{product.rating}</span>
                <span className="text-slate-400 ml-1">({product.reviewCount} কাস্টমার রিভিউ)</span>
              </div>
              <span className="text-slate-300">|</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <Check size={14} /> {product.stock > 0 ? "স্টকে আছে" : "স্টক শেষ"}
              </span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-500 font-mono">SKU: {product.sku || "SG-SKU"}</span>
            </div>
          </div>

          {/* Pricing Banner */}
          <div className="p-4 rounded-2xl bg-slate-100/70 border border-slate-200/70 flex items-baseline gap-3">
            <span className="text-3xl sm:text-4xl font-black text-[#303d6e]">
              ৳ {currentPrice.toLocaleString()}
            </span>
            {product.oldPrice && product.oldPrice > currentPrice && (
              <span className="text-base sm:text-lg text-slate-400 line-through">
                ৳ {product.oldPrice.toLocaleString()}
              </span>
            )}
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="bg-red-600 text-white text-xs font-extrabold px-2 py-0.5 rounded-md shadow uppercase">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Wholesale Tiers if available */}
          {product.wholesalePrices && product.wholesalePrices.length > 0 && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs">
              <span className="font-bold text-amber-900 block mb-1">
                💡 পাইকারি মূল্য সুবিধা (Wholesale Price):
              </span>
              <div className="flex flex-wrap gap-2 text-slate-700">
                {product.wholesalePrices.map((tier, idx) => (
                  <span key={idx} className="bg-white px-2.5 py-1 rounded-lg border border-amber-200 font-semibold">
                    {tier.minQuantity}+ পিস: ৳ {tier.price}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Variants Selection */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block uppercase tracking-wide">
                সাইজ ও ভ্যারিয়েন্ট সিলেক্ট করুন:
              </label>
              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedVariantIndex(idx)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all flex items-center gap-2 ${
                      selectedVariantIndex === idx
                        ? "border-[#303d6e] bg-[#303d6e] text-white shadow-md scale-105"
                        : "border-slate-200 bg-white text-slate-800 hover:border-slate-300"
                    }`}
                  >
                    {v.colorHex && (
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/40 shadow-inner"
                        style={{ backgroundColor: v.colorHex }}
                      />
                    )}
                    <span>{v.sizeName || v.colorName}</span>
                    <span className="opacity-80">৳ {v.price}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Counter */}
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-700 uppercase">পরিমাণ:</span>
            <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-white shadow-xs">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 font-bold transition-colors"
              >
                -
              </button>
              <span className="px-4 py-1.5 text-sm font-black text-slate-900">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3.5 py-1.5 text-slate-600 hover:bg-slate-100 font-bold transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
            <button
              onClick={handleAddToCart}
              className="flex-1 bg-slate-900 hover:bg-black text-white font-extrabold py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow transition-transform active:scale-95"
            >
              <ShoppingCart size={18} /> কার্টে যোগ করুন
            </button>
            <button
              onClick={handleOrderNow}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-3.5 px-6 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-xl shadow-red-600/20 transition-transform active:scale-95"
            >
              সরাসরি অর্ডার করুন <ArrowRight size={18} />
            </button>
          </div>

          {/* Delivery & Trust Highlights */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-white border border-slate-100 text-xs text-slate-600 shadow-xs">
            <div className="flex items-center gap-2">
              <Truck size={17} className="text-indigo-600 shrink-0" />
              <span>সারা দেশে ক্যাশ অন ডেলিভারি</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-emerald-600 shrink-0" />
              <span>১০০% আসল প্রোডাক্ট গ্যারান্টি</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw size={17} className="text-amber-600 shrink-0" />
              <span>৭ দিনের রিটার্ন পলিসি</span>
            </div>
            <div className="flex items-center gap-2">
              <Store size={17} className="text-purple-600 shrink-0" />
              <span>ভেরিফাইড মার্চেন্ট সেলার</span>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Specifications Tabs */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm">
        <div className="flex gap-4 border-b border-slate-100 pb-3 mb-6">
          <button
            onClick={() => setActiveTab("desc")}
            className={`text-sm font-bold pb-2 border-b-2 transition-colors ${
              activeTab === "desc"
                ? "border-[#303d6e] text-[#303d6e]"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            পণ্যের বিবরণ (Description)
          </button>
          <button
            onClick={() => setActiveTab("spec")}
            className={`text-sm font-bold pb-2 border-b-2 transition-colors ${
              activeTab === "spec"
                ? "border-[#303d6e] text-[#303d6e]"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            কাস্টমার রিভিউ (Reviews)
          </button>
        </div>

        {activeTab === "desc" ? (
          <div className="text-slate-700 text-sm leading-relaxed space-y-4">
            <p>{product.description}</p>
            {product.shortDescription && (
              <p className="bg-slate-50 p-4 rounded-xl font-medium border border-slate-100">
                ✨ {product.shortDescription}
              </p>
            )}
          </div>
        ) : (
          <div className="space-y-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900">রফিকুল ইসলাম, ঢাকা</span>
                <span className="text-amber-400">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-slate-600">খুবই চমৎকার এবং ১০০% অরিজিনাল পণ্য। ১ দিনের মধ্যে ডেলিভারি পেয়েছি।</p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-slate-900">তানজিনা আহমেদ, চট্টগ্রাম</span>
                <span className="text-amber-400">⭐⭐⭐⭐⭐</span>
              </div>
              <p className="text-slate-600">প্যাকেজিং দারুণ ছিল। সেলারের রেসপন্সও খুব ভালো। Recommended!</p>
            </div>
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            সম্পর্কিত পণ্যসমূহ (Related Products)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
