"use client";

import { useState, useEffect } from "react";
import { Star, X, Sparkles } from "lucide-react";
import ProductReviewModal from "./ProductReviewModal";

export default function CustomerReviewPrompt() {
  const [recentOrder, setRecentOrder] = useState<any>(null);
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  useEffect(() => {
    try {
      // Check if dismissed in this session
      const dismissed = sessionStorage.getItem("oldrank_dismiss_review_prompt");
      if (dismissed) return;

      const orderStr = localStorage.getItem("oldrank_recent_order");
      if (orderStr) {
        const order = JSON.parse(orderStr);
        if (order && order.items && order.items.length > 0) {
          setRecentOrder(order);
          // Show after a gentle 3-second delay
          const timer = setTimeout(() => {
            setIsPromptOpen(true);
          }, 3500);
          return () => clearTimeout(timer);
        }
      }
    } catch {}
  }, []);

  const handleDismiss = () => {
    setIsPromptOpen(false);
    sessionStorage.setItem("oldrank_dismiss_review_prompt", "true");
  };

  const handleOpenReview = (productItem?: any) => {
    const target = productItem || recentOrder?.items?.[0];
    if (target) {
      setSelectedProduct({
        _id: target.productId || target._id,
        name: target.name,
        slug: target.slug || "",
        image: target.image || "",
      });
      setIsModalOpen(true);
      setIsPromptOpen(false);
    }
  };

  if (!recentOrder) return null;

  const firstItem = recentOrder.items?.[0];

  return (
    <>
      {isPromptOpen && (
        <div className="fixed bottom-4 right-4 z-40 max-w-sm w-full p-4 bg-white/95 backdrop-blur-md rounded-3xl border-2 border-indigo-500 shadow-2xl animate-scaleUp">
          <button
            type="button"
            onClick={handleDismiss}
            className="absolute top-3 right-3 p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={14} />
          </button>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles size={20} />
            </div>

            <div className="flex-1 pr-4">
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full inline-block mb-1">
                গ্রাহক সন্তুষ্টি
              </span>
              <h4 className="text-xs font-black text-slate-900 leading-tight">
                পণ্যটি কি হাতে পেয়েছেন?
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                {firstItem?.name || "আপনার অর্ডারকৃত পণ্য"}
              </p>

              <div className="flex items-center gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => handleOpenReview()}
                  className="bg-[#303d6e] hover:bg-indigo-900 text-white font-bold text-xs px-3.5 py-1.5 rounded-xl shadow flex items-center gap-1.5 transition-transform active:scale-95 cursor-pointer"
                >
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span>রিভিউ দিন</span>
                </button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="text-slate-400 hover:text-slate-600 text-xs font-semibold px-2 py-1 cursor-pointer"
                >
                  পরে দেব
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedProduct && (
        <ProductReviewModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
          defaultCustomerName={recentOrder.name || ""}
          defaultCustomerPhone={recentOrder.phone || ""}
          defaultCustomerCity={recentOrder.district || recentOrder.division || ""}
          defaultInvoiceId={recentOrder.invoiceId || ""}
          onReviewSubmitted={() => {
            sessionStorage.setItem("oldrank_dismiss_review_prompt", "true");
          }}
        />
      )}
    </>
  );
}
