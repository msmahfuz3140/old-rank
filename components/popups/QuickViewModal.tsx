"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Check, Star, ShoppingCart, ArrowRight } from "lucide-react";
import { useQuickViewStore, useCartStore } from "@/lib/store";
import ProductImage from "@/components/product/ProductImage";

export default function QuickViewModal() {
  const router = useRouter();
  const { isOpen, product, closeQuickView } = useQuickViewStore();
  const addItem = useCartStore((state) => state.addItem);

  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const activeVariant =
    product.variants && product.variants.length > 0
      ? product.variants[selectedVariantIndex]
      : null;

  const currentPrice = activeVariant ? activeVariant.price : product.basePrice;

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
    closeQuickView();
  };

  const handleOrderNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-100 p-6 sm:p-8 animate-scale-up max-h-[90vh] overflow-y-auto">
        <button
          onClick={closeQuickView}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Image */}
          <div className="rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 shadow-sm aspect-square sm:aspect-auto">
            <ProductImage
              src={product.mainImage}
              alt={product.name}
              className="w-full h-64 sm:h-80 object-cover"
              showText={true}
              iconSize={32}
            />
          </div>

          {/* Info */}
          <div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {typeof product.category === "object" ? product.category.name : "Exclusive"}
            </span>

            <h3 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-2 mb-1.5 leading-snug">
              {product.name}
            </h3>

            {/* Rating & Stock */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center text-amber-400 text-xs">
                <Star size={14} className="fill-amber-400" />
                <span className="font-bold text-slate-700 ml-1">{product.rating}</span>
                <span className="text-slate-400 ml-1">({product.reviewCount})</span>
              </div>
              <span className="text-xs text-slate-300">|</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                <Check size={13} /> {product.stock > 0 ? "স্টকে আছে" : "স্টক শেষ"}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-4">
              <span className="text-2xl sm:text-3xl font-black text-[#303d6e]">
                ৳ {currentPrice.toLocaleString()}
              </span>
              {product.oldPrice && product.oldPrice > currentPrice && (
                <span className="text-sm text-slate-400 line-through">
                  ৳ {product.oldPrice.toLocaleString()}
                </span>
              )}
            </div>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-5">
                <label className="text-xs font-bold text-slate-700 block mb-2 uppercase tracking-wide">
                  ভ্যারিয়েন্ট / সাইজ নির্বাচন করুন:
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((v, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedVariantIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                        selectedVariantIndex === idx
                          ? "border-[#303d6e] bg-[#303d6e] text-white shadow"
                          : "border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300"
                      }`}
                    >
                      {v.colorHex && (
                        <span
                          className="w-3 h-3 rounded-full border border-white/40 shadow-inner"
                          style={{ backgroundColor: v.colorHex }}
                        />
                      )}
                      <span>{v.sizeName || v.colorName}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="flex items-center gap-3 mb-6">
              <span className="text-xs font-bold text-slate-700 uppercase">পরিমাণ:</span>
              <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden bg-slate-50">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-1 text-xs font-bold text-slate-900 bg-white">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-1 text-slate-600 hover:bg-slate-200 font-bold transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-slate-900 hover:bg-black text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-transform active:scale-95"
              >
                <ShoppingCart size={16} /> কার্টে যোগ করুন
              </button>
              <button
                onClick={handleOrderNow}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-red-600/20 transition-transform active:scale-95"
              >
                অর্ডার করুন <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
