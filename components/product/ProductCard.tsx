"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, ShoppingCart, Star, Zap } from "lucide-react";
import { IProduct } from "@/lib/types";
import { useCartStore, useQuickViewStore } from "@/lib/store";
import ProductImage from "./ProductImage";

interface ProductCardProps {
  product: IProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);
  const openQuickView = useQuickViewStore((state) => state.openQuickView);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product._id,
      name: product.name,
      image: product.mainImage,
      price: product.basePrice,
      slug: product.slug,
      variantInfo: product.variants?.[0]
        ? `${product.variants[0].colorName || ""} ${product.variants[0].sizeName || ""}`.trim()
        : undefined,
    });
  };

  const handleOrderNow = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product._id,
      name: product.name,
      image: product.mainImage,
      price: product.basePrice,
      slug: product.slug,
      variantInfo: product.variants?.[0]
        ? `${product.variants[0].colorName || ""} ${product.variants[0].sizeName || ""}`.trim()
        : undefined,
    });
    router.push("/checkout");
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-100/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden relative">
      {/* Badges */}
      <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 z-10 flex flex-col gap-1">
        {product.discountPercentage && product.discountPercentage > 0 && (
          <span className="bg-red-600 text-white font-extrabold text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded shadow uppercase tracking-wide">
            {product.discountPercentage}% OFF
          </span>
        )}
        {product.isHotDeal && (
          <span className="bg-amber-500 text-slate-950 font-black text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5 rounded shadow flex items-center gap-0.5">
            <Zap size={10} className="fill-slate-950" /> HOT
          </span>
        )}
      </div>

      {/* Quick View Button on Hover */}
      <button
        onClick={() => openQuickView(product)}
        className="absolute top-2 right-2 sm:top-2.5 sm:right-2.5 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 hover:bg-white text-slate-700 hover:text-[#303d6e] shadow-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-y-1 group-hover:translate-y-0 cursor-pointer"
        title="কুইক ভিউ"
        aria-label="Quick View"
      >
        <Eye size={14} />
      </button>

      {/* Image Thumbnail */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-square overflow-hidden bg-slate-50">
        <ProductImage
          src={product.mainImage}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          showText={true}
          iconSize={24}
        />
      </Link>

      {/* Body Info */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Shop/Category Tag */}
          <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 block mb-0.5 sm:mb-1 truncate">
            {product.vendor?.shopName || (typeof product.category === "object" ? product.category.name : "Exclusive")}
          </span>

          {/* Title */}
          <Link
            href={`/product/${product.slug}`}
            className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-[#303d6e] transition-colors leading-snug min-h-[2rem] sm:min-h-[2.5rem]"
          >
            {product.name}
          </Link>

          {/* Rating */}
          <div className="flex items-center gap-1 mt-1 text-xs text-amber-400">
            <Star size={11} className="fill-amber-400" />
            <span className="text-slate-700 font-bold text-[10px] sm:text-[11px]">{product.rating}</span>
            <span className="text-slate-400 text-[9px] sm:text-[10px]">({product.reviewCount})</span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-slate-100">
          <div className="flex items-baseline gap-1.5 sm:gap-2 mb-2">
            <span className="text-sm sm:text-base lg:text-lg font-black text-[#303d6e]">
              ৳ {product.basePrice.toLocaleString()}
            </span>
            {product.oldPrice && product.oldPrice > product.basePrice && (
              <span className="text-[10px] sm:text-xs text-slate-400 line-through">
                ৳ {product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>

          {/* Two Action Buttons */}
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-1.5 sm:py-2 px-1 sm:px-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95 cursor-pointer whitespace-nowrap"
            >
              <ShoppingCart size={12} className="shrink-0" />
              <span className="truncate">কার্ট</span>
            </button>
            <button
              onClick={handleOrderNow}
              className="w-full py-1.5 sm:py-2 px-1 sm:px-2 bg-[#303d6e] hover:bg-indigo-900 text-white rounded-lg sm:rounded-xl text-[11px] sm:text-xs font-bold transition-all shadow-xs active:scale-95 text-center cursor-pointer whitespace-nowrap"
            >
              <span className="truncate">অর্ডার করুন</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
