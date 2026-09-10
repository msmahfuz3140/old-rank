"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Zap,
  ShieldCheck,
  Truck,
  Star,
  Flame,
  Heart,
  RotateCcw,
} from "lucide-react";

interface SlideData {
  id: number;
  badge: string;
  badgeIcon: "sparkles" | "zap" | "flame" | "heart";
  badgeBg: string;
  badgeText: string;
  title: string;
  highlightText: string;
  description: string;
  chips: string[];
  primaryBtn: { text: string; link: string; bg: string };
  secondaryBtn: { text: string; link: string };
  image: string;
  imageAlt: string;
  floatingCard: {
    title: string;
    subtitle: string;
    icon: string;
  };
  gradient: string;
  glowColor: string;
}

const slides: SlideData[] = [
  {
    id: 1,
    badge: "অফিশিয়াল ক্লথিং ব্র্যান্ড ২০২৬",
    badgeIcon: "flame",
    badgeBg: "bg-amber-400",
    badgeText: "text-slate-950",
    title: "Old Rank এক্সক্লুসিভ",
    highlightText: "প্রিমিয়াম মেনস ওয়্যার",
    description:
      "Wear Your Rank — স্টাইলিশ ড্রপ-শোল্ডার টি-শার্ট, প্রিমিয়াম হুডি, জ্যাকেট ও ফ্যাশন এক্সেসরিজে আধুনিক আভিজাত্য।",
    chips: ["👑 ১০০% প্রিমিয়াম কম্বড কটন", "🔥 ক্লাসিক স্টাইল ও মডার্ন ফিট", "🚚 সারা দেশে ক্যাশ অন ডেলিভারি"],
    primaryBtn: {
      text: "সব প্রোডাক্ট দেখুন",
      link: "/category/all",
      bg: "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/25",
    },
    secondaryBtn: {
      text: "মেনস কালেকশন",
      link: "/category/fashion",
    },
    image: "/images/old-rank-banner.jpg",
    imageAlt: "Old Rank Clothing Brand - Wear Your Rank",
    floatingCard: {
      title: "Wear Your Rank",
      subtitle: "১০০% প্রিমিয়াম ক্লোথিং কালেকশন",
      icon: "👑",
    },
    gradient: "from-[#08090d] via-[#12141d] to-[#1a1c29]",
    glowColor: "bg-amber-500/20",
  },
  {
    id: 2,
    badge: "এক্সক্লুসিভ উইমেন্স ফেয়ার",
    badgeIcon: "sparkles",
    badgeBg: "bg-pink-500",
    badgeText: "text-white",
    title: "মেয়েদের প্রিমিয়াম শাড়ি ও",
    highlightText: "রূপচর্চা কালেকশন",
    description:
      "আসল ঐতিহ্যবাহী ঢাকাই জামদানি, পার্টি থ্রি-পিস ও সার্টিফাইড কোরিয়ান ব্রাইটনিং স্কিনকেয়ার এখন বিশেষ মূল্যে।",
    chips: ["🌸 ১০০% খাঁটি আরামদায়ক সুতি", "💄 ডার্মাটোলজিস্ট টেস্টেড সিরাম", "🔄 ৭ দিনের সহজ রিটার্ন"],
    primaryBtn: {
      text: "কালেকশন দেখুন",
      link: "/category/womens-fashion",
      bg: "bg-pink-500 hover:bg-pink-400 text-white shadow-pink-500/30",
    },
    secondaryBtn: {
      text: "স্কিনকেয়ার প্রোডাক্ট",
      link: "/category/beauty-cosmetics",
    },
    image:
      "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Exclusive Women Fashion Saree Collection",
    floatingCard: {
      title: "২,০০০+ নতুন ডিজাইন",
      subtitle: "হাতে বোনা আসল কারিগরির ছোঁয়া",
      icon: "✨",
    },
    gradient: "from-[#200516] via-[#3d0d2a] to-[#59143d]",
    glowColor: "bg-pink-500/25",
  },
  {
    id: 3,
    badge: "স্মার্ট কিচেন ও হোম গ্যাজেট",
    badgeIcon: "flame",
    badgeBg: "bg-emerald-500",
    badgeText: "text-white",
    title: "স্মার্ট হোম ও",
    highlightText: "কিচেন ইলেকট্রনিক্স",
    description:
      "অয়েল-ফ্রি ডিজিটাল এয়ার ফ্রায়ার, পাওয়ারফুল ব্লেন্ডার ও রোবট ভ্যাকুয়ামে স্বাস্থ্যকর জীবন ও সময় সাশ্রয় করুন।",
    chips: ["🍳 ৮০% কম তেলে স্বাস্থ্যকর রান্না", "⚡ ৪০% বিদ্যুৎ সাশ্রয়ী মোটর", "🛡️ ১ বছর রিপ্লেসমেন্ট গ্যারান্টি"],
    primaryBtn: {
      text: "অ্যাপ্লায়েন্স শপ",
      link: "/category/home-appliances",
      bg: "bg-emerald-500 hover:bg-emerald-400 text-white shadow-emerald-500/25",
    },
    secondaryBtn: {
      text: "হট ডিল অফার",
      link: "/#hot-deals",
    },
    image:
      "https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Digital Air Fryer and Kitchen Appliances",
    floatingCard: {
      title: "১০০% অরিজিনাল ব্র্যান্ড",
      subtitle: "সরাসরি অথোরাইজড ডিস্ট্রিবিউটর",
      icon: "🏆",
    },
    gradient: "from-[#061b17] via-[#0d2e27] to-[#124238]",
    glowColor: "bg-emerald-500/25",
  },
  {
    id: 4,
    badge: "বেবি ও কিডস সুপার সেভার",
    badgeIcon: "heart",
    badgeBg: "bg-amber-500",
    badgeText: "text-slate-950",
    title: "শিশুর যত্ন ও",
    highlightText: "১০০% অর্গানিক বেবি ফ্যাশন",
    description:
      "শিশুর কোমল ত্বকের জন্য টক্সিন-মুক্ত সফট সুতি রম্পার, নিরাপদ লাইটওয়েট স্ট্রোলার ও শিক্ষণীয় রঙিন খেলনা।",
    chips: ["👶 বিপিএ-ফ্রি সেফটি সার্টিফাইড", "☁️ সুপার সফট কটন ফ্যাব্রিক", "🎁 বাই ১ গেট ১ স্পেশাল গিফট"],
    primaryBtn: {
      text: "বেবি কালেকশন",
      link: "/category/baby-kids",
      bg: "bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-400/25",
    },
    secondaryBtn: {
      text: "সকল সেলার শপ",
      link: "/sellers",
    },
    image:
      "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&auto=format&fit=crop&q=80",
    imageAlt: "Baby and Kids Essentials",
    floatingCard: {
      title: "শিশুর কোমল যত্ন",
      subtitle: "ডাক্তারদের প্রস্তাবিত অর্গানিক কোয়ালিটি",
      icon: "🧸",
    },
    gradient: "from-[#082032] via-[#14324f] to-[#1e496f]",
    glowColor: "bg-sky-500/25",
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Auto slide interval
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return;
    const distance = touchStartX.current - touchEndX.current;
    if (distance > 50) {
      // Swiped left -> next
      nextSlide();
    } else if (distance < -50) {
      // Swiped right -> prev
      prevSlide();
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  const slide = slides[currentSlide];

  const renderBadgeIcon = (icon: string) => {
    switch (icon) {
      case "zap":
        return <Zap size={14} className="fill-current" />;
      case "sparkles":
        return <Sparkles size={14} className="fill-current" />;
      case "flame":
        return <Flame size={14} className="fill-current" />;
      case "heart":
        return <Heart size={14} className="fill-current" />;
      default:
        return <Sparkles size={14} className="fill-current" />;
    }
  };

  return (
    <section
      className="relative max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 pt-3 sm:pt-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div
        className={`relative rounded-2xl sm:rounded-3xl overflow-hidden bg-gradient-to-r ${slide.gradient} text-white shadow-2xl border border-white/10 transition-colors duration-700 min-h-[460px] sm:min-h-[480px] lg:min-h-[500px] flex flex-col justify-between`}
      >
        {/* Animated Background Orbs */}
        <div
          className={`absolute top-0 right-0 w-72 sm:w-96 h-72 sm:h-96 ${slide.glowColor} rounded-full blur-3xl pointer-events-none animate-pulse-glow transition-all duration-700`}
        />
        <div className="absolute bottom-0 left-1/4 w-52 sm:w-72 h-52 sm:h-72 bg-white/5 rounded-full blur-2xl pointer-events-none" />

        {/* Top Floating Promo Notification Bar inside Slider */}
        <div className="relative z-10 px-4 sm:px-8 lg:px-12 pt-4 sm:pt-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 ${slide.badgeBg} ${slide.badgeText} font-black text-[11px] sm:text-xs uppercase px-3 py-1 rounded-full shadow-md`}
            >
              {renderBadgeIcon(slide.badgeIcon)}
              <span>{slide.badge}</span>
            </span>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-300 bg-white/10 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
              <Star size={12} className="text-amber-400 fill-amber-400" />
              <span>টপ রেটেড অফার</span>
            </span>
          </div>

          {/* Slide Progress Indicator */}
          <div className="text-[11px] font-mono font-bold text-white/70 bg-black/30 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/10">
            <span>0{currentSlide + 1}</span> / <span>0{slides.length}</span>
          </div>
        </div>

        {/* Main Slide Content Grid */}
        <div className="relative z-10 px-4 sm:px-8 lg:px-12 py-4 sm:py-6 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left Text & CTA Content (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-snug sm:leading-tight">
              {slide.title}{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 block sm:inline">
                {slide.highlightText}
              </span>
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-slate-200 leading-relaxed font-medium max-w-xl">
              {slide.description}
            </p>

            {/* Feature Chips */}
            <div className="flex flex-wrap gap-2 pt-1">
              {slide.chips.map((chip, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center text-[10px] sm:text-xs font-semibold bg-white/10 hover:bg-white/15 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/15 text-slate-100 transition-colors"
                >
                  {chip}
                </span>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3.5 pt-2">
              <Link
                href={slide.primaryBtn.link}
                className={`font-black px-6 py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xl transition-all duration-300 hover:scale-[1.03] active:scale-95 ${slide.primaryBtn.bg}`}
              >
                <span>{slide.primaryBtn.text}</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href={slide.secondaryBtn.link}
                className="bg-white/10 hover:bg-white/20 text-white font-bold px-5 py-3 rounded-xl sm:rounded-2xl text-xs sm:text-sm border border-white/20 backdrop-blur-md transition-all text-center"
              >
                {slide.secondaryBtn.text}
              </Link>
            </div>
          </div>

          {/* Right Product Image Showcase (5 cols on lg) */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            {/* Desktop and Tablet Showcase Container */}
            <div className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md aspect-[4/3] sm:aspect-square rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl group">
              <img
                key={slide.id}
                src={slide.image}
                alt={slide.imageAlt}
                className="w-full h-full object-cover object-center animate-fade-in transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

              {/* Floating Testimonial/Quality Card */}
              <div className="absolute bottom-3 left-3 right-3 bg-black/60 backdrop-blur-md rounded-xl p-2.5 sm:p-3 border border-white/20 shadow-lg flex items-center gap-3 animate-float">
                <span className="text-xl sm:text-2xl shrink-0">
                  {slide.floatingCard.icon}
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-extrabold text-white truncate">
                    {slide.floatingCard.title}
                  </h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-300 truncate">
                    {slide.floatingCard.subtitle}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Dots Navigation & Arrow Controls */}
        <div className="relative z-10 px-4 sm:px-8 lg:px-12 py-3 sm:py-4 bg-black/20 backdrop-blur-xs border-t border-white/10 flex items-center justify-between">
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => setCurrentSlide(idx)}
                className={`transition-all duration-300 h-2.5 rounded-full cursor-pointer ${
                  currentSlide === idx
                    ? "w-8 bg-amber-400 shadow-md shadow-amber-400/50"
                    : "w-2.5 bg-white/40 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Quick Trust Highlights on Desktop */}
          <div className="hidden md:flex items-center gap-6 text-[11px] text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <Truck size={14} className="text-amber-400" /> সারা দেশে দ্রুত ডেলিভারি
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-emerald-400" /> আসল পণ্য ও ওয়ারেন্টি
            </span>
            <span className="flex items-center gap-1.5">
              <RotateCcw size={14} className="text-sky-400" /> সহজ রিটার্ন পলিসি
            </span>
          </div>

          {/* Navigation Arrows */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevSlide}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all active:scale-90 cursor-pointer"
              aria-label="Previous Slide"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextSlide}
              className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all active:scale-90 cursor-pointer"
              aria-label="Next Slide"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
