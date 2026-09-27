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
  ZoomIn,
  MessageSquarePlus,
} from "lucide-react";
import { api } from "@/lib/api";
import { useCartStore } from "@/lib/store";
import { IProduct, IReview } from "@/lib/types";
import PopUpProductCard from "@/components/product/PopUpProductCard";
import ProductImage from "@/components/product/ProductImage";
import ProductImageZoomModal from "@/components/product/ProductImageZoomModal";
import ProductReviewModal from "@/components/product/ProductReviewModal";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const setDirectBuyItem = useCartStore((state) => state.setDirectBuyItem);
  const closeCartDrawer = useCartStore((state) => state.closeCartDrawer);

  const [product, setProduct] = useState<IProduct | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<IProduct[]>([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<"desc" | "spec">("desc");
  const [isZoomOpen, setIsZoomOpen] = useState(false);

  // Real Customer Reviews State
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [reviewStats, setReviewStats] = useState<{
    averageRating: number;
    totalReviews: number;
    breakdown: Record<number, number>;
  }>({
    averageRating: 0,
    totalReviews: 0,
    breakdown: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
  });
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  useEffect(() => {
    setIsLoadingReviews(true);
    api.getProductBySlug(resolvedParams.slug).then((data) => {
      if (data && data.product) {
        setProduct(data.product);
        setSelectedImage(data.product.mainImage);
        setRelatedProducts(data.relatedProducts || []);
      }
    });

    api
      .getProductReviews(resolvedParams.slug)
      .then((res) => {
        if (res && res.success && Array.isArray(res.data)) {
          setReviews(res.data);
          const bd: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
          if (res.stats?.breakdown) {
            Object.entries(res.stats.breakdown).forEach(([k, v]) => {
              bd[Number(k)] = Number(v);
            });
          }
          setReviewStats({
            averageRating: res.stats?.rating || 0,
            totalReviews: res.stats?.reviewCount || res.data.length,
            breakdown: bd,
          });
        }
        setIsLoadingReviews(false);
      })
      .catch(() => {
        setIsLoadingReviews(false);
      });
  }, [resolvedParams.slug]);

  const handleReviewSubmitted = (
    newReview: IReview,
    updatedStats?: { rating: number; reviewCount: number }
  ) => {
    setReviews((prev) => [newReview, ...prev.filter((r) => r._id !== newReview._id)]);
    if (updatedStats) {
      setProduct((prev) =>
        prev
          ? {
              ...prev,
              rating: updatedStats.rating,
              reviewCount: updatedStats.reviewCount,
            }
          : prev
      );
      setReviewStats((prev) => ({
        ...prev,
        averageRating: updatedStats.rating,
        totalReviews: updatedStats.reviewCount,
      }));
    }
  };

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
      quantity,
      false,
      true
    );
  };

  const handleOrderNow = () => {
    closeCartDrawer();
    setDirectBuyItem(
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
          {/* Main Product Image (Click to Zoom) */}
          <div
            onClick={() => setIsZoomOpen(true)}
            className="group relative rounded-3xl overflow-hidden bg-white border border-slate-100 shadow-md aspect-square flex items-center justify-center p-2 cursor-zoom-in hover:shadow-xl transition-all"
            title="ছবি বড় করে জুম করে দেখুন"
          >
            <ProductImage
              src={selectedImage || product.mainImage}
              alt={product.name}
              className="w-full h-full object-cover rounded-2xl group-hover:scale-102 transition-transform duration-300"
              showText={true}
              iconSize={40}
            />

            {/* Hover Floating Zoom Pill */}
            <div className="absolute bottom-4 right-4 z-10 flex items-center gap-1.5 bg-slate-900/85 hover:bg-slate-900 text-white backdrop-blur-md text-xs font-bold px-3 py-1.5 rounded-full shadow-lg transition-transform group-hover:scale-105 pointer-events-none">
              <ZoomIn size={14} className="text-amber-400" />
              <span>বড় করে দেখুন (Zoom)</span>
            </div>
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

            {/* Rating & Verification */}
            <div className="flex items-center gap-3 text-xs">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("spec");
                  const el = document.getElementById("product-tabs-section");
                  if (el) el.scrollIntoView({ behavior: "smooth" });
                }}
                className="flex items-center text-amber-400 hover:opacity-80 transition-opacity"
              >
                <Star size={15} className="fill-amber-400" />
                <span className="font-bold text-slate-700 ml-1">
                  {reviews.length > 0
                    ? reviewStats.averageRating.toFixed(1)
                    : (product.rating ? Number(product.rating).toFixed(1) : "5.0")}
                </span>
                <span className="text-slate-400 ml-1">
                  ({reviews.length} কাস্টমার রিভিউ)
                </span>
              </button>
              <span className="text-slate-300">|</span>
              <span className="font-bold text-emerald-600 flex items-center gap-1">
                <Check size={14} /> ১০০% আসল পণ্য
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

      {/* Description & Customer Reviews Tabs */}
      <div id="product-tabs-section" className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm scroll-mt-24">
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
            className={`text-sm font-bold pb-2 border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === "spec"
                ? "border-[#303d6e] text-[#303d6e]"
                : "border-transparent text-slate-400 hover:text-slate-700"
            }`}
          >
            <span>কাস্টমার রিভিউ</span>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                activeTab === "spec"
                  ? "bg-[#303d6e] text-white"
                  : "bg-slate-100 text-slate-500"
              }`}
            >
              {reviews.length}
            </span>
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
          <div className="space-y-6">
            {/* Reviews Summary Header Card */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-indigo-50/40 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="text-center sm:text-left">
                  <div className="text-4xl sm:text-5xl font-black text-slate-900 leading-none">
                    {reviews.length > 0 ? (reviewStats.averageRating || 5).toFixed(1) : "5.0"}
                  </div>
                  <div className="flex items-center justify-center sm:justify-start gap-1 mt-2 text-amber-400">
                    {[1, 2, 3, 4, 5].map((s) => {
                      const avg = reviews.length > 0 ? reviewStats.averageRating : 5;
                      return (
                        <Star
                          key={s}
                          size={18}
                          className={s <= Math.round(avg) ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                        />
                      );
                    })}
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    {reviews.length > 0
                      ? `${reviews.length} টি ভেরিফাইড রিভিউ এর ভিত্তিতে`
                      : "১০০% বিশ্বস্ত ও আসল কাস্টমার রিভিউ"}
                  </p>
                </div>
              </div>

              {/* Rating Bars */}
              <div className="w-full md:w-64 space-y-1.5 text-xs">
                {[5, 4, 3, 2, 1].map((num) => {
                  const count = reviewStats.breakdown?.[num] || 0;
                  const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
                  return (
                    <div key={num} className="flex items-center gap-2">
                      <span className="w-4 font-bold text-slate-600">{num}★</span>
                      <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-400 rounded-full transition-all duration-500"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-slate-400 text-[11px] font-mono">{count}</span>
                    </div>
                  );
                })}
              </div>

              {/* Action Button */}
              <div>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#303d6e] hover:bg-indigo-900 text-white font-bold text-xs sm:text-sm px-6 py-3 rounded-2xl shadow-md transition-all active:scale-95"
                >
                  <MessageSquarePlus size={16} />
                  রিভিউ লিখুন (Write Review)
                </button>
              </div>
            </div>

            {/* Reviews List */}
            {isLoadingReviews ? (
              <div className="p-8 text-center text-sm font-semibold text-slate-400">
                রিভিউ লোড হচ্ছে...
              </div>
            ) : reviews.length === 0 ? (
              <div className="text-center py-10 px-4 bg-slate-50/70 border border-dashed border-slate-200 rounded-2xl">
                <div className="w-12 h-12 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <Star size={24} className="fill-amber-400" />
                </div>
                <h4 className="text-base font-bold text-slate-800">এখনও কোনো কাস্টমার রিভিউ নেই</h4>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mt-1 mb-5">
                  আপনি কি এই পণ্যটি অর্ডার করেছিলেন? আপনার সৎ ও মূল্যবান মতামত সবার সাথে শেয়ার করতে প্রথম রিভিউটি দিন!
                </p>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(true)}
                  className="inline-flex items-center gap-2 bg-[#303d6e] hover:bg-indigo-900 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition-all active:scale-95"
                >
                  <MessageSquarePlus size={16} />
                  প্রথম রিভিউ দিন (Write First Review)
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-5 rounded-2xl bg-white border border-slate-100 shadow-xs hover:border-slate-200 transition-all"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#303d6e] to-indigo-600 text-white font-bold text-sm flex items-center justify-center shadow-xs">
                          {rev.customerName ? rev.customerName.charAt(0).toUpperCase() : "U"}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-slate-900 text-sm">
                              {rev.customerName}
                            </span>
                            {rev.customerCity && (
                              <span className="text-xs text-slate-400 font-medium">
                                • {rev.customerCity}
                              </span>
                            )}
                            {rev.isVerifiedPurchase && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
                                <ShieldCheck size={12} className="text-emerald-600" />
                                যাচাইকৃত ক্রেতা (Verified)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              className={s <= rev.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"}
                            />
                          ))}
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {new Date(rev.createdAt).toLocaleDateString("bn-BD", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-700 text-xs sm:text-sm leading-relaxed mt-2 pl-0 sm:pl-12">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            সম্পর্কিত পণ্যসমূহ (Related Products)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
            {relatedProducts.map((p, idx) => (
              <PopUpProductCard
                key={p._id}
                product={p}
                index={idx}
                isPopHighlight={p.isHotDeal}
              />
            ))}
          </div>
        </section>
      )}

      {/* Product Image Full-Screen Zoom & Lightbox Modal */}
      <ProductImageZoomModal
        isOpen={isZoomOpen}
        onClose={() => setIsZoomOpen(false)}
        images={allImages}
        initialIndex={Math.max(allImages.indexOf(selectedImage || product.mainImage), 0)}
        productName={product.name}
      />

      {/* Real Customer Review Modal */}
      <ProductReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        product={{
          _id: product._id,
          name: product.name,
          slug: product.slug,
          image: product.mainImage,
        }}
        onReviewSubmitted={handleReviewSubmitted}
      />
    </div>
  );
}
