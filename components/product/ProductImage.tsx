"use client";

import { useState } from "react";
import { ImageOff, Sparkles } from "lucide-react";

interface ProductImageProps {
  src?: string | null;
  alt: string;
  className?: string;
  containerClassName?: string;
  showText?: boolean;
  iconSize?: number;
}

export default function ProductImage({
  src,
  alt,
  className = "w-full h-full object-cover",
  containerClassName = "w-full h-full",
  showText = true,
  iconSize = 24,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);

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

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      loading="lazy"
    />
  );
}
