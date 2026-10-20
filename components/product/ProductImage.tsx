"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import { optimizeImageUrl, shimmerPlaceholder } from "@/lib/imageUtils";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  showText?: boolean;
  iconSize?: number;
  priority?: boolean;
  sizes?: string;
  targetWidth?: number;
}

export default function ProductImage({
  src,
  alt,
  className = "object-cover",
  containerClassName = "w-full h-full",
  showText = true,
  iconSize = 24,
  priority = false,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  targetWidth = 800,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [src]);

  const isInvalid = !src || typeof src !== "string" || src.trim() === "" || hasError;

  if (isInvalid) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 via-slate-50 to-indigo-50/40 text-slate-400 select-none p-2.5 relative overflow-hidden ${containerClassName}`}
      >
        <div className="w-11 h-11 rounded-2xl bg-white shadow-xs border border-slate-200/80 flex items-center justify-center text-slate-400 mb-1">
          <ImageOff size={iconSize} className="stroke-[1.6] text-slate-400" />
        </div>
        {showText && (
          <div className="text-center">
            <span className="text-[11px] font-bold text-slate-600 block leading-tight">
              ছবি উপলব্ধ নেই
            </span>
            <span className="text-[9px] font-semibold text-slate-400 tracking-wider block mt-0.5">
              NO IMAGE
            </span>
          </div>
        )}
      </div>
    );
  }

  const optimizedSrc = optimizeImageUrl(src, {
    width: targetWidth,
    quality: "auto:good",
  });

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      <Image
        src={optimizedSrc}
        alt={alt || "Product Image"}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        placeholder="blur"
        blurDataURL={shimmerPlaceholder(targetWidth, targetWidth)}
        className={`${className}`}
        onError={() => setHasError(true)}
      />
    </div>
  );
}
