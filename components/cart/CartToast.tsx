"use client";

import { useEffect } from "react";
import { CheckCircle2, ShoppingBag, X } from "lucide-react";
import { useCartStore } from "@/lib/store";
import ProductImage from "@/components/product/ProductImage";

export default function CartToast() {
  const { toast, hideToast, openCartDrawer, items } = useCartStore();

  useEffect(() => {
    if (!toast?.show) return;

    const timer = setTimeout(() => {
      hideToast();
    }, 3800);

    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast?.show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-8 right-3 sm:right-6 z-50 animate-bounce-subtle pointer-events-auto max-w-[calc(100vw-1.5rem)] sm:max-w-md w-full"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-2xl border border-indigo-100/80 ring-1 ring-black/5 flex flex-col gap-3">
        {/* Header line */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-xs sm:text-sm">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 size={13} className="text-emerald-700" />
            </div>
            <span>{toast.message || "পণ্যটি কার্টে যোগ করা হয়েছে!"}</span>
          </div>

          <button
            type="button"
            onClick={hideToast}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close notification"
          >
            <X size={15} />
          </button>
        </div>

        {/* Product snippet (if available) */}
        {toast.item && (
          <div className="flex items-center gap-3 bg-slate-50/80 rounded-xl p-2 border border-slate-100">
            <div className="w-11 h-11 rounded-lg overflow-hidden border border-slate-200 shrink-0 bg-white">
              <ProductImage
                src={toast.item.image}
                alt={toast.item.name}
                className="w-full h-full object-cover"
                showText={false}
                iconSize={14}
              />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-slate-900 text-xs truncate">
                {toast.item.name}
              </h4>
              <p className="text-[11px] text-slate-500 font-medium">
                {toast.item.quantity > 1 ? `${toast.item.quantity} × ` : ""}
                <span className="font-extrabold text-[#303d6e]">
                  ৳ {toast.item.price.toLocaleString()}
                </span>
                {toast.item.variantInfo ? ` • ${toast.item.variantInfo}` : ""}
              </p>
            </div>
          </div>
        )}

        {/* Action Bar */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-slate-100">
          <span className="text-[11px] text-slate-500 font-medium">
            মোট আইটেম: <strong className="text-slate-800">{items.reduce((s, i) => s + i.quantity, 0)}টি</strong>
          </span>

          <button
            type="button"
            onClick={() => {
              hideToast();
              openCartDrawer();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#303d6e] hover:bg-indigo-900 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
          >
            <ShoppingBag size={13} />
            <span>কার্ট দেখুন</span>
          </button>
        </div>
      </div>
    </div>
  );
}
