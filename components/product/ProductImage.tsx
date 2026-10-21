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
  const [useFallbackImg, setUseFallbackImg] = useState(false);

  useEffect(() => {
    setHasError(false);
    setUseFallbackImg(false);
  }, [src]);

  const rawSrc = typeof src === "string" ? src.trim() : "";
  const isInvalid = !rawSrc || hasError;

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

  // 1. Instant local preview (blob: or data: URL) - Render native <img> for 0ms instantaneous display
  const isBlobOrData = rawSrc.startsWith("blob:") || rawSrc.startsWith("data:");
  if (isBlobOrData) {
    return (
      <div className={`relative overflow-hidden ${containerClassName}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={rawSrc}
          alt={alt || "Product Preview"}
          className={`w-full h-full ${className}`}
          decoding="async"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  // 2. Cloudinary or external CDN URL optimization
  const optimizedSrc = optimizeImageUrl(rawSrc, {
    width: targetWidth,
    quality: "auto:good",
  });

  const isCloudinary = rawSrc.includes("res.cloudinary.com");

  // 3. If Next.js proxy encountered an issue, fallback directly to native <img> loaded from CDN
  if (useFallbackImg) {
    return (
      <div className={`relative overflow-hidden ${containerClassName}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={optimizedSrc || rawSrc}
          alt={alt || "Product Image"}
          className={`w-full h-full ${className}`}
          loading={priority ? "eager" : "lazy"}
          decoding="async"
          onError={() => setHasError(true)}
        />
      </div>
    );
  }

  return (
    <div className={`relative overflow-hidden ${containerClassName}`}>
      <Image
        src={optimizedSrc}
        alt={alt || "Product Image"}
        fill
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : "lazy"}
        unoptimized={isCloudinary}
        placeholder={isCloudinary ? undefined : "blur"}
        blurDataURL={isCloudinary ? undefined : shimmerPlaceholder(targetWidth, targetWidth)}
        className={`${className}`}
        onError={() => {
          // Attempt direct CDN fetch before showing broken image icon
          setUseFallbackImg(true);
        }}
      />
    </div>
  );
}

