"use client";

import Link from "next/link";
import { X, Trash2, ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/store";
import ProductImage from "@/components/product/ProductImage";

export default function CartDrawer() {
  const {
    items,
    isCartDrawerOpen,
    closeCartDrawer,
    removeItem,
    updateQuantity,
    getSubtotal,
  } = useCartStore();

  if (!isCartDrawerOpen) return null;

  const subtotal = getSubtotal();

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={closeCartDrawer}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-slide-left border-l border-slate-100">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#303d6e] text-white flex items-center justify-center shadow-sm">
                <ShoppingBag size={17} />
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">
                শপিং কার্ট ({items.length})
              </h3>
            </div>
            <button
              onClick={closeCartDrawer}
              className="p-1.5 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
              aria-label="Close Cart"
            >
              <X size={18} />
            </button>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <ShoppingBag size={48} className="mx-auto mb-3 opacity-30 stroke-[1.5]" />
                <p className="font-semibold text-slate-600 mb-1">আপনার কার্ট খালি রয়েছে</p>
                <p className="text-xs text-slate-400 mb-4">পছন্দের পণ্য কার্টে যুক্ত করুন</p>
                <button
                  onClick={closeCartDrawer}
                  className="bg-[#303d6e] text-white text-xs font-bold px-4 py-2 rounded-xl shadow"
                >
                  কেনাকাটা চালিয়ে যান
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantInfo || ""}`}
                  className="flex gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-100/80 items-center"
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-white">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      showText={false}
                      iconSize={18}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 line-clamp-1">
                      {item.name}
                    </h4>
                    {item.variantInfo && (
                      <span className="text-[11px] text-slate-400 font-medium block mt-0.5">
                        {item.variantInfo}
                      </span>
                    )}
                    <span className="text-xs font-extrabold text-[#303d6e] block mt-1">
                      ৳ {item.price.toLocaleString()}
                    </span>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity - 1,
                              item.variantInfo
                            )
                          }
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          -
                        </button>
                        <span className="px-2.5 py-0.5 text-xs font-bold text-slate-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            updateQuantity(
                              item.productId,
                              item.quantity + 1,
                              item.variantInfo
                            )
                          }
                          className="px-2 py-0.5 text-xs text-slate-600 hover:bg-slate-100 font-bold"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeItem(item.productId, item.variantInfo)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-auto"
                        title="Remove item"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout Action */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-100 bg-white space-y-3">
              <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                <span>সাবটোটাল</span>
                <span className="text-base font-black text-slate-900">
                  ৳ {subtotal.toLocaleString()}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                * ডেলিভারি চার্জ চেকআউট পেজে জেলার ভিত্তিতে হিসাব করা হবে।
              </p>
              <Link
                href="/checkout"
                onClick={closeCartDrawer}
                className="w-full bg-[#303d6e] hover:bg-indigo-800 text-white font-bold py-3.5 px-4 rounded-2xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/20 transition-all active:scale-98"
              >
                চেকআউট করুন <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
