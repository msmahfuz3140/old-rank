"use client";

import { useEffect, useRef, useState } from "react";
import { IProduct } from "@/lib/types";
import ProductCard from "./ProductCard";
import { Sparkles } from "lucide-react";

interface PopUpProductCardProps {
  product: IProduct;
  index?: number;
  isPopHighlight?: boolean;
}

export default function PopUpProductCard({
  product,
  index = 0,
  isPopHighlight = false,
}: PopUpProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // If IntersectionObserver is not supported, show immediately
    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "0px 0px -40px 0px",
        threshold: 0.08,
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  // Stagger animation timing across cards in a row
  const delayMs = (index % 8) * 90;

  return (
    <div
      ref={cardRef}
      style={{
        animationDelay: `${delayMs}ms`,
        animationFillMode: "both",
      }}
      className={`relative transform-gpu transition-all duration-300 ${
        isVisible
          ? "animate-pop-up-bottom"
          : "opacity-0 translate-y-12 scale-95 pointer-events-none"
      } ${
        isPopHighlight
          ? "ring-2 ring-indigo-500/20 rounded-2xl hover:ring-indigo-500/50 shadow-md"
          : ""
      }`}
    >
      {/* Optional Pop-up highlighted badge */}
      {isPopHighlight && (
        <div className="absolute -top-2.5 right-3 z-20 flex items-center gap-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full shadow-md animate-pop-float pointer-events-none uppercase tracking-wider">
          <Sparkles size={10} className="fill-white" />
          <span>পপ হাইলাইট</span>
        </div>
      )}

      {/* Render the core ProductCard */}
      <ProductCard product={product} />
    </div>
  );
}
