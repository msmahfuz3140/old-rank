"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Move,
} from "lucide-react";
import ProductImage from "./ProductImage";

interface ProductImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  initialIndex?: number;
  productName: string;
}

export default function ProductImageZoomModal({
  isOpen,
  onClose,
  images,
  initialIndex = 0,
  productName,
}: ProductImageZoomModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  // Sync index when initialIndex changes or modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
      setScale(1);
      setPosition({ x: 0, y: 0 });
      // Prevent background scroll
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen, initialIndex]);

  // Reset zoom and pan position when switching image
  const handleSelectImage = useCallback((index: number) => {
    setCurrentIndex(index);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleNext = useCallback(() => {
    if (images.length <= 1) return;
    handleSelectImage((currentIndex + 1) % images.length);
  }, [currentIndex, images.length, handleSelectImage]);

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return;
    handleSelectImage((currentIndex - 1 + images.length) % images.length);
  }, [currentIndex, images.length, handleSelectImage]);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 0.5, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  }, []);

  const handleReset = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  // Keyboard navigation & controls
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      } else if (e.key === "+" || e.key === "=") {
        handleZoomIn();
      } else if (e.key === "-" || e.key === "_") {
        handleZoomOut();
      } else if (e.key === "0") {
        handleReset();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, handleNext, handlePrev, handleZoomIn, handleZoomOut, handleReset]);

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      // Zoom in
      setScale((prev) => Math.min(prev + 0.25, 4));
    } else {
      // Zoom out
      setScale((prev) => {
        const next = Math.max(prev - 0.25, 1);
        if (next === 1) setPosition({ x: 0, y: 0 });
        return next;
      });
    }
  };

  // Double click to toggle 1x <-> 2.2x zoom
  const handleDoubleClick = () => {
    if (scale > 1) {
      handleReset();
    } else {
      setScale(2.2);
    }
  };

  // Drag to pan when zoomed in
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || scale <= 1) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch drag to pan for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (scale <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    setDragStart({
      x: e.touches[0].clientX - position.x,
      y: e.touches[0].clientY - position.y,
    });
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || scale <= 1 || e.touches.length !== 1) return;
    setPosition({
      x: e.touches[0].clientX - dragStart.x,
      y: e.touches[0].clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  if (!isOpen) return null;

  const currentImage = images[currentIndex] || images[0];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/92 backdrop-blur-md flex flex-col justify-between select-none animate-fadeIn"
      onMouseUp={handleMouseUp}
    >
      {/* Top Controls Bar */}
      <div className="relative z-20 flex items-center justify-between px-4 sm:px-6 py-3 bg-black/50 border-b border-white/10 backdrop-blur-sm text-white">
        <div className="flex items-center gap-3 min-w-0 pr-4">
          <span className="text-xs sm:text-sm font-black truncate max-w-xs sm:max-w-md text-slate-100">
            {productName}
          </span>
          {images.length > 1 && (
            <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-full bg-white/15 text-slate-300">
              {currentIndex + 1} / {images.length}
            </span>
          )}
        </div>

        {/* Zoom Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Zoom % badge */}
          <span className="text-[11px] font-mono font-bold px-2 py-1 rounded-lg bg-white/10 text-amber-300 min-w-[50px] text-center">
            {Math.round(scale * 100)}%
          </span>

          <button
            type="button"
            onClick={handleZoomOut}
            disabled={scale <= 1}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white cursor-pointer"
            title="Zoom Out (-)"
          >
            <ZoomOut size={17} />
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={scale >= 4}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white cursor-pointer"
            title="Zoom In (+)"
          >
            <ZoomIn size={17} />
          </button>

          <button
            type="button"
            onClick={handleReset}
            disabled={scale === 1 && position.x === 0 && position.y === 0}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-white cursor-pointer"
            title="Reset (100%)"
          >
            <RotateCcw size={17} />
          </button>

          <div className="w-px h-5 bg-white/20 mx-1" />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-rose-600/80 hover:bg-rose-600 text-white transition-colors cursor-pointer shadow-sm"
            title="বন্ধ করুন (Esc)"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Main Image Viewport */}
      <div
        ref={containerRef}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative flex-1 flex items-center justify-center overflow-hidden p-4 sm:p-8 ${
          scale > 1
            ? isDragging
              ? "cursor-grabbing"
              : "cursor-grab"
            : "cursor-zoom-in"
        }`}
      >
        {/* Navigation Arrow: Previous */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-3 sm:left-6 z-20 w-11 h-11 rounded-2xl bg-black/60 hover:bg-black/90 text-white border border-white/15 flex items-center justify-center transition-transform hover:scale-105 shadow-xl cursor-pointer"
            title="পূর্ববর্তী ছবি (Left Arrow)"
          >
            <ChevronLeft size={24} />
          </button>
        )}

        {/* The Zoomable / Draggable Image */}
        <div
          style={{
            transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
            transition: isDragging ? "none" : "transform 0.2s cubic-bezier(0.2, 0, 0, 1)",
          }}
          className="relative max-w-full max-h-[75vh] flex items-center justify-center will-change-transform"
        >
          <img
            src={currentImage}
            alt={productName}
            draggable={false}
            className="max-w-full max-h-[75vh] object-contain rounded-2xl shadow-2xl pointer-events-none drop-shadow-2xl"
          />
        </div>

        {/* Navigation Arrow: Next */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-3 sm:right-6 z-20 w-11 h-11 rounded-2xl bg-black/60 hover:bg-black/90 text-white border border-white/15 flex items-center justify-center transition-transform hover:scale-105 shadow-xl cursor-pointer"
            title="পরবর্তী ছবি (Right Arrow)"
          >
            <ChevronRight size={24} />
          </button>
        )}

        {/* Helpful Hint Pill */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
          <span className="inline-flex items-center gap-1.5 bg-black/60 text-slate-300 backdrop-blur-md border border-white/10 text-[10px] sm:text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            {scale > 1 ? (
              <>
                <Move size={12} className="text-amber-400" /> ড্র্যাগ করে ছবির খুঁটিনাটি দেখুন • ডাবল-ক্লিকে রিসেট
              </>
            ) : (
              <>
                <ZoomIn size={12} className="text-amber-400" /> ডাবল-ক্লিক বা স্ক্রোল করে জুম করুন
              </>
            )}
          </span>
        </div>
      </div>

      {/* Bottom Thumbnail Strip */}
      {images.length > 1 && (
        <div className="relative z-20 px-4 py-3 bg-black/60 border-t border-white/10 backdrop-blur-sm flex items-center justify-center gap-2.5 overflow-x-auto">
          {images.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectImage(idx)}
              className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer ${
                currentIndex === idx
                  ? "border-amber-400 scale-105 shadow-lg shadow-amber-400/20 ring-2 ring-amber-400/30"
                  : "border-white/20 hover:border-white/60 opacity-60 hover:opacity-100"
              }`}
            >
              <img
                src={img}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
