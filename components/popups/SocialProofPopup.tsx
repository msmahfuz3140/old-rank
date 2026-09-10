"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, ShieldCheck, ShoppingBag, MapPin, Sparkles } from "lucide-react";

interface NotificationItem {
  name: string;
  location: string;
  product_name: string;
  time: string;
  image: string;
  product_url: string;
  price: string;
}

const defaultSocialProofData: NotificationItem[] = [
  {
    name: "তানভির হোসেন",
    location: "মিরপুর-১০, ঢাকা",
    product_name: "Ultra Modern Smartwatch Series 9 AMOLED",
    time: "২ মিনিট আগে",
    price: "৳ ২,৮৫০",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=80",
    product_url: "/product/ultra-modern-smartwatch-series-9",
  },
  {
    name: "সাব্বির আহমেদ",
    location: "ধানমন্ডি, ঢাকা",
    product_name: "Intel Core i5 Desktop Computer Full Setup",
    time: "৪ মিনিট আগে",
    price: "৳ ৪২,৫০০",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=500&auto=format&fit=crop&q=80",
    product_url: "/product/intel-core-i5-desktop-computer-full-setup",
  },
  {
    name: "নুসরাত জাহান",
    location: "জিইসি মোড়, চট্টগ্রাম",
    product_name: "Premium Oxford Cotton Casual Shirt (Navy)",
    time: "৬ মিনিট আগে",
    price: "৳ ১,২৫০",
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&auto=format&fit=crop&q=80",
    product_url: "/product/premium-oxford-cotton-casual-shirt",
  },
  {
    name: "মাহমুদুল হাসান",
    location: "উপশহর, সিলেট",
    product_name: "Canva Pro Lifetime Owner Access",
    time: "৮ মিনিট আগে",
    price: "৳ ৪৯৯",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=80",
    product_url: "/product/canva-pro-lifetime-owner-access",
  },
  {
    name: "মেহেদী হাসান",
    location: "উত্তরা সেক্টর ৭, ঢাকা",
    product_name: "Comfort Narrow Fit Stretchable Chino Pant",
    time: "১০ মিনিট আগে",
    price: "৳ ১,৪৫০",
    image: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=500&auto=format&fit=crop&q=80",
    product_url: "/product/comfort-narrow-fit-stretchable-chino-pant",
  },
];

export default function SocialProofPopup() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (isMuted) return;

    // Trigger first popup 1.5 seconds after entry
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 1500);

    // Auto-rotate every 9 seconds, display for 5.5 seconds
    const interval = setInterval(() => {
      setIsVisible(true);
      setCurrentIndex((prev) => (prev + 1) % defaultSocialProofData.length);

      const hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 5500);

      return () => clearTimeout(hideTimer);
    }, 11000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, [isMuted]);

  const handleClose = () => {
    setIsVisible(false);
    setIsMuted(true);
    // Mute for 60 seconds
    setTimeout(() => setIsMuted(false), 60000);
  };

  if (!isVisible) return null;

  const currentItem = defaultSocialProofData[currentIndex];

  return (
    <div className="fixed bottom-20 md:bottom-7 left-4 sm:left-6 z-50 max-w-[340px] w-full bg-white/95 backdrop-blur-md rounded-2xl p-3.5 shadow-2xl border border-slate-100 ring-1 ring-slate-900/5 transition-all duration-500 animate-slide-up overflow-hidden">
      {/* Top micro progress line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-emerald-500 via-[#303d6e] to-indigo-600 animate-pulse" />

      <div className="flex items-center gap-3">
        {/* Thumbnail with verified ring */}
        <div className="relative shrink-0">
          <img
            src={currentItem.image}
            alt={currentItem.product_name}
            className="w-14 h-14 rounded-xl object-cover border border-slate-200 shadow-sm"
          />
          <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow">
            <ShieldCheck size={12} />
          </span>
        </div>

        {/* Content Details */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-900 leading-none mb-1">
            <span className="text-[#303d6e] font-extrabold">{currentItem.name}</span>
            <span className="text-slate-400 font-normal">•</span>
            <span className="text-slate-500 flex items-center gap-0.5 text-[10px]">
              <MapPin size={10} className="text-rose-500" /> {currentItem.location}
            </span>
          </div>

          <Link
            href={currentItem.product_url}
            className="text-xs text-slate-800 font-bold line-clamp-1 hover:text-[#303d6e] transition-colors block mb-1 leading-tight"
          >
            {currentItem.product_name}
          </Link>

          <div className="flex items-center justify-between text-[10px]">
            <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1 border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
              🛡️ ভেরিফাইড অর্ডার
            </span>
            <span className="text-slate-400 font-medium">{currentItem.time}</span>
          </div>
        </div>
      </div>

      {/* Close button */}
      <button
        onClick={handleClose}
        className="absolute top-2 right-2 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
        aria-label="Close notification"
      >
        <X size={13} />
      </button>
    </div>
  );
}
