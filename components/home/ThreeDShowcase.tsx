"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  Sparkles,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Star,
  ChevronLeft,
  ChevronRight,
  Eye,
  Check,
  Compass,
  Play,
  Pause,
  Maximize2,
  Layers,
  Flame,
  Award,
  CircleDot,
  Info,
  Sliders,
} from "lucide-react";
import { useCartStore } from "@/lib/store";

interface Hotspot {
  id: string;
  x: number; // Percentage X (0-100)
  y: number; // Percentage Y (0-100)
  title: string;
  desc: string;
  spec: string;
}

interface ShowcaseProduct {
  id: string;
  name: string;
  bengaliTitle: string;
  category: string;
  basePrice: number;
  oldPrice: number;
  image: string;
  rating: number;
  reviews: number;
  highlightBadge: string;
  description: string;
  hotspots: Hotspot[];
  specs: { label: string; value: string }[];
  colors: { name: string; hex: string }[];
  sizes: string[];
  stockLeft: number;
  slug: string;
}

const SHOWCASE_PRODUCTS: ShowcaseProduct[] = [
  {
    id: "3d_gold_polo",
    name: "Old Rank Royal Black Polo",
    bengaliTitle: "২৪K গোল্ড এমব্রয়ডারি সিগনেচার পোলো",
    category: "SIGNATURE APPAREL",
    basePrice: 1450,
    oldPrice: 2100,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&auto=format&fit=crop&q=85",
    rating: 4.9,
    reviews: 538,
    highlightBadge: "100% Cotton • 24K Gold Crest",
    description:
      "২৬০ জিএসএম হেভিওয়েট কম্বড সুতির তৈরি লাক্সারি পোলো। অ্যান্টি-রোল স্ট্রাকচার্ড কলার এবং গোল্ড ক্রেস্ট প্রতিটি আউটফিটে যুক্ত করে রাজকীয় আভিজাত্য।",
    hotspots: [
      {
        id: "polo_crest",
        x: 58,
        y: 35,
        title: "২৪K গোল্ড থ্রেড ক্রেস্ট",
        desc: "১০০,০০০ স্টিচের ডেনসিটি যুক্ত জাপানিজ গোল্ড মেটালিক সুতোয় এমব্রয়ডারি করা ক্রাউন ব্যাজ।",
        spec: "Density: 100k Stitches • 24K Metallic Thread",
      },
      {
        id: "polo_fabric",
        x: 44,
        y: 62,
        title: "২৬০ GSM কম্বড পিক সুতি",
        desc: "প্রাকৃতিক অর্গানিক বায়ো-ওয়াশড সুতোয় তৈরি, যা ১০০ ধোয়ার পরেও রঙ ও শেপ অটুট রাখে।",
        spec: "100% Organic Cotton • Zero Shrinkage",
      },
      {
        id: "polo_collar",
        x: 50,
        y: 20,
        title: "লেজার-কাট অ্যান্টি-রোল কলার",
        desc: "বিশেষ ইন্টারলাইনিং টেকনোলজি কলারকে সবসময় পারফেক্ট ও টানটান রাখে।",
        spec: "German Fused Interlining",
      },
    ],
    specs: [
      { label: "ফেব্রিক", value: "100% Organic Pique 260 GSM" },
      { label: "ফিটিং", value: "Modern European Slim Fit" },
      { label: "বাটন", value: "Custom Engraved Mother-of-Pearl" },
      { label: "ডেলিভারি", value: "২৪-৪৮ ঘণ্টায় হোম ডেলিভারি" },
    ],
    colors: [
      { name: "Jet Black", hex: "#0a0d14" },
      { name: "Royal Navy", hex: "#172554" },
      { name: "Bordeaux Crimson", hex: "#7f1d1d" },
    ],
    sizes: ["M", "L", "XL", "XXL"],
    stockLeft: 7,
    slug: "fashion",
  },
  {
    id: "3d_chrono_watch",
    name: "Old Rank Heritage Chronograph",
    bengaliTitle: "স্যাফায়ার ক্রিস্টাল লাক্সারি টাইমপিস",
    category: "LIMITED TIMEPIECE",
    basePrice: 3850,
    oldPrice: 5500,
    image: "https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=1000&auto=format&fit=crop&q=85",
    rating: 5.0,
    reviews: 384,
    highlightBadge: "Sapphire Crystal • 50M Waterproof",
    description:
      "অ্যারোস্পেস গ্রেড ৩১৬এল স্টেইনলেস স্টিল ও স্যাফায়ার ক্রিস্টাল গ্লাসের সমন্বয়ে তৈরি মাস্টারপিস। নির্ভুল জাপানিজ মেকানিজম ও ৫০ মিটার ওয়াটার রেজিস্ট্যান্স।",
    hotspots: [
      {
        id: "watch_glass",
        x: 50,
        y: 46,
        title: "স্যাফায়ার ক্রিস্টাল গ্লাস",
        desc: "৯ মোহস হার্ডনেস বিশিষ্ট স্ক্র্যাচপ্রুফ ডায়মন্ড কোটিং গ্লাস।",
        spec: "9 Mohs Hardness • Anti-Reflective Coating",
      },
      {
        id: "watch_bezel",
        x: 68,
        y: 35,
        title: "রোজ গোল্ড পিভিডি বেজেল",
        desc: "ট্যাকিমিটার স্কেল সহ হাই-প্রিসিশন ভ্যাকুয়াম প্লেটিং প্রযুক্তি।",
        spec: "Rose Gold PVD • 316L Surgical Steel",
      },
      {
        id: "watch_strap",
        x: 50,
        y: 82,
        title: "ইতালিয়ান লেদার স্ট্র্যাপ",
        desc: "হাতে সেলাই করা জেনুইন নরম ফুল-গ্রেইন কাফ লেদার স্ট্র্যাপ।",
        spec: "Full-Grain Calf Leather • Quick-Release",
      },
    ],
    specs: [
      { label: "কেস ডায়ামিটার", value: "42mm Rose Gold 316L" },
      { label: "মুভমেন্ট", value: "Japanese Chronograph Caliber" },
      { label: "ওয়াটার রেসিস্ট", value: "5 ATM (50 Meters)" },
      { label: "ওয়ারেন্টি", value: "২ বছরের অফিশিয়াল কার্ড" },
    ],
    colors: [
      { name: "Rose Gold", hex: "#b45309" },
      { name: "Stealth Onyx", hex: "#18181b" },
      { name: "Silver Ice", hex: "#94a3b8" },
    ],
    sizes: ["42mm Standard"],
    stockLeft: 4,
    slug: "fashion",
  },
  {
    id: "3d_apex_sneaker",
    name: "Old Rank Apex Street Sneaker",
    bengaliTitle: "এয়ার-কুশন সফট সোল স্ট্রিটওয়্যার",
    category: "STREETWEAR RUNNER",
    basePrice: 2950,
    oldPrice: 4200,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1000&auto=format&fit=crop&q=85",
    rating: 4.8,
    reviews: 620,
    highlightBadge: "Air-Capsule Sole • 3M Reflective",
    description:
      "শক-অ্যাবজর্বিং কার্বন প্লেট ও ব্রিথেবল মাইক্রো-পলিমার ফ্যাব্রিক। সর্বোচ্চ গ্রিপ এবং আরামদায়ক কুশনিং যা দৈনন্দিন হাঁটাচলা ও ফ্যাশনে অতুলনীয়।",
    hotspots: [
      {
        id: "sneaker_air",
        x: 65,
        y: 65,
        title: "ডুয়াল এয়ার-ক্যাপসুল সোল",
        desc: "প্রতিটি পদক্ষেপে শক অ্যাবজর্ব করে পায়ে সারাদিন এনার্জি রিবাউন্ড প্রদান করে।",
        spec: "Responsive Dual Air-Sole • 40mm Heel",
      },
      {
        id: "sneaker_upper",
        x: 42,
        y: 42,
        title: "ব্রিথেবল অ্যারো-মেশ আপার",
        desc: "বাতাস চলাচলের জন্য বিশেষ ফাইবার ম্যাট্রিক্স যা পা রাখে শুকনো ও ঘামহীন।",
        spec: "360° Airflow Mesh • 3M Reflective Strip",
      },
      {
        id: "sneaker_traction",
        x: 82,
        y: 78,
        title: "হাই-ট্র্যাকশন গ্রিপ আউটসোল",
        desc: "ভেজা ও পিচ্ছিল ফ্লোরেও দৃঢ় গ্রিপের নিশ্চয়তা প্রদানকারী রাবার ট্রেড।",
        spec: "VibraGrip Rubber Compound",
      },
    ],
    specs: [
      { label: "সোল টেকনোলজি", value: "Air-Capsule Energy Return" },
      { label: "আপার উপাদান", value: "High-Grade Engineered Knit" },
      { label: "ওজন", value: "Ultra-Lightweight 290 Grams" },
      { label: "সাইজ রিপ্লেস", value: "৭ দিন ফ্রি হোম সোয়াপ" },
    ],
    colors: [
      { name: "Apex Flame", hex: "#dc2626" },
      { name: "Midnight Black", hex: "#0f172a" },
      { name: "Arctic White", hex: "#f1f5f9" },
    ],
    sizes: ["40", "41", "42", "43", "44"],
    stockLeft: 6,
    slug: "fashion",
  },
  {
    id: "3d_cyber_headset",
    name: "Old Rank Cyber-71 Pro Headset",
    bengaliTitle: "৭.১ স্পেশিয়াল সারাউন্ড সাউন্ড ও নয়েজ ক্যানসেলিং",
    category: "PRO GAMING AUDIO",
    basePrice: 2450,
    oldPrice: 3500,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&auto=format&fit=crop&q=85",
    rating: 4.9,
    reviews: 315,
    highlightBadge: "7.1 Spatial Audio • ANC Studio Mic",
    description:
      "৫০ মিমি নিওডিমিয়াম ড্রাইভার ও টাইটানিয়াম ডায়াফ্রাম। ব্যাকগ্রাউন্ড নয়েজ সম্পূর্ণ ফিল্টার করে স্টুডিও লেভেলের ক্রিস্টাল ক্লিয়ার অডিও আউটপুট দেয়।",
    hotspots: [
      {
        id: "headset_driver",
        x: 48,
        y: 52,
        title: "৫০ মিমি টাইটানিয়াম ড্রাইভার",
        desc: "ডিপ সিনেমাটিক বেস এবং ক্রিস্টাল ক্লিয়ার হাইস এর জন্য বিশেষ টিউনিং।",
        spec: "50mm Neodymium • 20Hz - 40kHz Response",
      },
      {
        id: "headset_pad",
        x: 62,
        y: 62,
        title: "কুলিং-জেল মেমোরি ইয়ারপ্যাড",
        desc: "ঘণ্টার পর ঘণ্টা ব্যবহারের পরেও কান ঠান্ডা ও ক্লান্তিহীন রাখার জন্য কুলিং জেল লেয়ার।",
        spec: "Cooling-Gel Memory Foam • Breathable Leather",
      },
      {
        id: "headset_mic",
        x: 28,
        y: 72,
        title: "ডিটাচেবল কার্ডিওয়েড মাইক",
        desc: "অটো এআই ফিল্টারিং সহ আপনার কণ্ঠস্বর পৌঁছে দেয় সর্বোচ্চ স্পষ্টতায়।",
        spec: "AI Noise Cancellation • Broadcast Grade",
      },
    ],
    specs: [
      { label: "কানেক্টিভিটি", value: "2.4GHz Ultra Low-Latency + BT 5.3" },
      { label: "ব্যাটারি লাইফ", value: "৫০ ঘণ্টা একটানা প্লেব্যাক" },
      { label: "লেটেন্সি", value: "Under 15ms Pro Gaming Mode" },
      { label: "ওয়ারেন্টি", value: "১ বছর ইনস্ট্যান্ট রিপ্লেসমেন্ট" },
    ],
    colors: [
      { name: "Neon Cyber", hex: "#06b6d4" },
      { name: "Matte Carbon", hex: "#1e293b" },
      { name: "Electric Gold", hex: "#f59e0b" },
    ],
    sizes: ["Universal Adjustable"],
    stockLeft: 9,
    slug: "electronics",
  },
];

export default function ThreeDShowcase() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [rotationAngle, setRotationAngle] = useState(0);
  const [isAutoSpin, setIsAutoSpin] = useState(true);
  const [viewAngle, setViewAngle] = useState<"front" | "isometric" | "side">("front");
  const [activeHotspot, setActiveHotspot] = useState<Hotspot | null>(null);

  // Dynamic 3D mouse tilt inside active card
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  // Commerce Customizations
  const [selectedColorIdx, setSelectedColorIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string>(SHOWCASE_PRODUCTS[0].sizes[0]);
  const [toastMessage, setToastMessage] = useState("");

  const activeItem = SHOWCASE_PRODUCTS[activeIdx];
  const stageRef = useRef<HTMLDivElement>(null);
  const addItem = useCartStore((state) => state.addItem);
  const openCart = useCartStore((state) => state.openCartDrawer);

  // Auto-Orbit interval
  useEffect(() => {
    if (!isAutoSpin || isDragging) return;
    const interval = setInterval(() => {
      setRotationAngle((prev) => prev - 90);
      setActiveIdx((prev) => (prev + 1) % SHOWCASE_PRODUCTS.length);
      setActiveHotspot(null);
    }, 6000);

    return () => clearInterval(interval);
  }, [isAutoSpin, isDragging]);

  // Sync size when changing item
  useEffect(() => {
    setSelectedSize(activeItem.sizes[0] || "Standard");
    setSelectedColorIdx(0);
    setActiveHotspot(null);
  }, [activeIdx, activeItem]);

  // Rotate to specific product directly
  const handleSelectProduct = (index: number) => {
    const diff = index - activeIdx;
    setRotationAngle((prev) => prev - diff * 90);
    setActiveIdx(index);
    setActiveHotspot(null);
  };

  // Mouse tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Dampened tilt: -14deg to +14deg
    const tiltY = (x - 0.5) * 28;
    const tiltX = (0.5 - y) * 24;

    setTilt({ x: tiltX, y: tiltY });
    setMousePos({ x: x * 100, y: y * 100 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setMousePos({ x: 50, y: 50 });
  };

  // Drag-to-spin physics
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
    setIsAutoSpin(false);
  };

  const handleGlobalMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX;
      if (Math.abs(deltaX) > 60) {
        if (deltaX > 0) {
          // Drag right -> previous
          setRotationAngle((prev) => prev + 90);
          setActiveIdx((prev) => (prev === 0 ? SHOWCASE_PRODUCTS.length - 1 : prev - 1));
        } else {
          // Drag left -> next
          setRotationAngle((prev) => prev - 90);
          setActiveIdx((prev) => (prev + 1) % SHOWCASE_PRODUCTS.length);
        }
        setIsDragging(false);
      }
    },
    [isDragging, dragStartX]
  );

  const handleGlobalMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleGlobalMouseMove);
      window.addEventListener("mouseup", handleGlobalMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      window.removeEventListener("mouseup", handleGlobalMouseUp);
    };
  }, [isDragging, handleGlobalMouseMove, handleGlobalMouseUp]);

  // Touch Swipe for Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setDragStartX(e.touches[0].clientX);
    setIsAutoSpin(false);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - dragStartX;
    if (Math.abs(deltaX) > 40) {
      if (deltaX > 0) {
        setRotationAngle((prev) => prev + 90);
        setActiveIdx((prev) => (prev === 0 ? SHOWCASE_PRODUCTS.length - 1 : prev - 1));
      } else {
        setRotationAngle((prev) => prev - 90);
        setActiveIdx((prev) => (prev + 1) % SHOWCASE_PRODUCTS.length);
      }
    }
  };

  // Commerce Add to Cart
  const handleAddToCart = () => {
    addItem(
      {
        productId: activeItem.id,
        name: `${activeItem.name} - ${activeItem.colors[selectedColorIdx]?.name || ""}`,
        slug: activeItem.slug,
        price: activeItem.basePrice,
        image: activeItem.image,
        sizeName: selectedSize,
        colorName: activeItem.colors[selectedColorIdx]?.name,
        variantInfo: `${selectedSize} | ${activeItem.colors[selectedColorIdx]?.name || ""}`,
      },
      1
    );

    setToastMessage("কার্টে যোগ করা হয়েছে!");
    setTimeout(() => setToastMessage(""), 2500);
    openCart();
  };

  // View Angle offsets
  const angleTiltX = viewAngle === "isometric" ? 12 : viewAngle === "side" ? 0 : tilt.x;
  const angleTiltY = viewAngle === "isometric" ? -22 : viewAngle === "side" ? -45 : tilt.y;

  return (
    <section className="relative overflow-hidden py-14 sm:py-20 bg-[#060911] text-white select-none border-y border-white/10">
      {/* Studio Lighting Effects */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-indigo-500/25 via-blue-600/10 to-transparent blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-1/4 w-[500px] h-[350px] bg-amber-500/15 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[450px] h-[450px] bg-cyan-500/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Top Overhead Spotlight Beam Lamp */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-64 h-24 bg-indigo-400/30 blur-2xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ================= SECTION HEADER ================= */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 sm:mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-widest mb-3 shadow-lg shadow-amber-400/10">
              <Sparkles size={14} className="text-amber-400 animate-spin" />
              <span>Old Rank Virtual 3D Studio</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              ৩৬০° ইন্টারেক্টিভ{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">
                ৩ডি শো-রুম
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1.5 max-w-xl leading-relaxed">
              যেকোনো কোণে ঘোরান, জুম করুন এবং স্পর্শকাতর ৩ডি হটস্পট বাটনে ক্লিক করে প্রতিটি ম্যাটেরিয়াল,
              সুতো ও টেক্সচারের প্রিমিয়াম ফিনিশিং পরখ করুন।
            </p>
          </div>

          {/* Controls: Auto-Spin Toggle & View Angle Mode */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* View Angle Switcher */}
            <div className="flex items-center p-1 rounded-xl bg-white/10 border border-white/15 text-xs font-bold backdrop-blur-md">
              <button
                type="button"
                onClick={() => setViewAngle("front")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewAngle === "front"
                    ? "bg-[#5064df] text-white shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                সামনে (0°)
              </button>
              <button
                type="button"
                onClick={() => setViewAngle("isometric")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewAngle === "isometric"
                    ? "bg-[#5064df] text-white shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                অ্যাঙ্গেল (45°)
              </button>
              <button
                type="button"
                onClick={() => setViewAngle("side")}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                  viewAngle === "side"
                    ? "bg-[#5064df] text-white shadow-sm"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                সাইড (90°)
              </button>
            </div>

            {/* Auto Orbit Toggle */}
            <button
              type="button"
              onClick={() => setIsAutoSpin(!isAutoSpin)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                isAutoSpin
                  ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300 shadow-sm"
                  : "bg-white/10 border-white/15 text-slate-300 hover:text-white"
              }`}
              title={isAutoSpin ? "অটো-ঘূর্ণন চালু আছে" : "অটো-ঘূর্ণন পজ করা"}
            >
              {isAutoSpin ? <Pause size={14} /> : <Play size={14} />}
              <span className="hidden sm:inline">৩ডি অটো-স্পিন</span>
            </button>
          </div>
        </div>

        {/* ================= MAIN 3D SHOWROOM ARENA (12 Cols) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* LEFT: 3D CYLINDRICAL ORBIT STAGE (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* 3D Viewport with 1400px Perspective */}
            <div
              ref={stageRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="w-full max-w-lg sm:max-w-xl aspect-[4/3] sm:aspect-square relative perspective-1400 flex items-center justify-center cursor-grab active:cursor-grabbing"
              title="মাউস টেনে ডানে-বামে ৩৬০° ঘোরান"
            >
              {/* Studio Gyroscope Rings rotating in 3D Space */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Outer Ring */}
                <div className="w-72 sm:w-96 h-72 sm:h-96 rounded-full border border-indigo-400/20 border-dashed animate-orbit-3d" />
                {/* Middle Ring */}
                <div className="w-56 sm:w-72 h-56 sm:h-72 rounded-full border border-amber-400/25 animate-orbit-3d-reverse" />
                {/* Glowing Floor Pedestal */}
                <div className="w-64 sm:w-80 h-64 sm:h-80 rounded-full bg-gradient-to-t from-indigo-600/30 via-blue-500/10 to-transparent blur-xl shadow-2xl [transform:rotateX(75deg)_translateZ(-80px)]" />
              </div>

              {/* 3D CYLINDER CAROUSEL CONTAINER */}
              <div
                style={{
                  transform: `rotateY(${rotationAngle}deg)`,
                  transition: isDragging ? "none" : "transform 0.85s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                className="w-full h-full relative preserve-3d flex items-center justify-center"
              >
                {SHOWCASE_PRODUCTS.map((prod, idx) => {
                  // Angle step is 90 deg for 4 products
                  const cardAngle = idx * 90;
                  const isActive = idx === activeIdx;

                  return (
                    <div
                      key={prod.id}
                      onClick={() => handleSelectProduct(idx)}
                      style={{
                        transform: `rotateY(${cardAngle}deg) translateZ(clamp(200px, 34vw, 340px))`,
                      }}
                      className={`absolute w-[270px] sm:w-[350px] aspect-[4/5] rounded-3xl p-5 sm:p-6 preserve-3d transition-opacity duration-500 cursor-pointer overflow-hidden border backdrop-blur-xl ${
                        isActive
                          ? "opacity-100 ring-2 ring-amber-400/50 border-amber-400/30 shadow-[0_25px_60px_rgba(0,0,0,0.9)] bg-gradient-to-br from-[#0e1628]/95 via-[#101b33]/90 to-[#070b14]/95 z-30"
                          : "opacity-40 hover:opacity-75 border-white/10 shadow-xl bg-gradient-to-br from-[#0c1220]/75 to-[#070b14]/80 scale-90 z-10 pointer-events-auto"
                      }`}
                    >
                      {/* Dynamic Holographic Cursor Glare */}
                      {isActive && (
                        <div
                          style={{
                            background: `radial-gradient(circle 350px at ${mousePos.x}% ${mousePos.y}%, rgba(255,255,255,0.22), transparent 75%)`,
                          }}
                          className="absolute inset-0 pointer-events-none rounded-3xl z-30"
                        />
                      )}

                      {/* Card Header in 3D Space */}
                      <div
                        style={{ transform: "translateZ(35px)" }}
                        className="flex items-center justify-between z-20 relative"
                      >
                        <span className="text-[10px] sm:text-xs font-black bg-white/10 text-amber-300 px-3 py-1 rounded-full border border-white/15 uppercase tracking-wider backdrop-blur-md">
                          {prod.category}
                        </span>
                        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/15 text-[11px] font-bold text-amber-400">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span>{prod.rating}</span>
                        </div>
                      </div>

                      {/* Central Product Image popping out in 3D Space */}
                      <div
                        style={{
                          transform: isActive
                            ? `translateZ(85px) rotateX(${angleTiltX}deg) rotateY(${angleTiltY}deg)`
                            : "translateZ(40px)",
                          transition: isDragging
                            ? "none"
                            : "transform 0.15s ease-out, filter 0.3s ease",
                        }}
                        className="relative z-10 my-auto flex items-center justify-center py-2 h-44 sm:h-56"
                      >
                        <img
                          src={prod.image}
                          alt={prod.name}
                          className="max-h-full max-w-full object-contain filter drop-shadow-[0_25px_30px_rgba(0,0,0,0.85)] group-hover:scale-105 transition-transform duration-500"
                        />

                        {/* Interactive Hotspot Pins (Only on Active Card) */}
                        {isActive &&
                          prod.hotspots.map((hotspot) => (
                            <button
                              key={hotspot.id}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveHotspot(
                                  activeHotspot?.id === hotspot.id ? null : hotspot
                                );
                              }}
                              style={{
                                left: `${hotspot.x}%`,
                                top: `${hotspot.y}%`,
                                transform: "translate(-50%, -50%) translateZ(40px)",
                              }}
                              className={`absolute w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer z-40 group/pin ${
                                activeHotspot?.id === hotspot.id
                                  ? "bg-amber-400 text-slate-950 scale-125 shadow-lg shadow-amber-400"
                                  : "bg-white/90 text-[#303d6e] animate-pulse-pin hover:scale-125 hover:bg-amber-400 hover:text-slate-950"
                              }`}
                              title={hotspot.title}
                            >
                              <CircleDot size={14} className="stroke-[3]" />
                            </button>
                          ))}
                      </div>

                      {/* Floating Hotspot Details Popover */}
                      {isActive && activeHotspot && (
                        <div
                          style={{ transform: "translateZ(110px)" }}
                          className="absolute left-4 right-4 bottom-20 p-3.5 rounded-2xl bg-[#090d19]/95 backdrop-blur-xl border border-amber-400/60 shadow-2xl text-xs z-50 animate-scale-up"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h5 className="font-extrabold text-amber-300 text-xs flex items-center gap-1.5">
                              <Sparkles size={13} className="text-amber-400" />
                              <span>{activeHotspot.title}</span>
                            </h5>
                            <button
                              type="button"
                              onClick={() => setActiveHotspot(null)}
                              className="text-slate-400 hover:text-white p-0.5"
                            >
                              ✕
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-300 leading-relaxed">
                            {activeHotspot.desc}
                          </p>
                          <div className="mt-2 pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-amber-400 font-bold">
                            <span>{activeHotspot.spec}</span>
                            <span className="text-slate-400 font-normal">● ৩ডি ভেরিফাইড</span>
                          </div>
                        </div>
                      )}

                      {/* Card Footer in 3D Space */}
                      <div
                        style={{ transform: "translateZ(45px)" }}
                        className="relative z-20 flex items-end justify-between gap-2 pt-1 border-t border-white/10"
                      >
                        <div className="min-w-0">
                          <p className="text-xs sm:text-sm font-black text-white truncate">
                            {prod.name}
                          </p>
                          <span className="text-[10px] text-emerald-400 font-semibold block">
                            ✓ ক্যাশ অন ডেলিভারি
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[10px] text-slate-400 line-through block">
                            ৳ {prod.oldPrice}
                          </span>
                          <span className="text-base sm:text-lg font-black text-amber-400 leading-none">
                            ৳ {prod.basePrice.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom 3D Cylinder Controls & Thumbnail Dock */}
            <div className="flex flex-col items-center gap-3 w-full max-w-lg mt-4">
              <p className="text-[11px] text-amber-300/90 font-medium flex items-center gap-1.5">
                <Compass size={13} className="animate-spin text-amber-400" />
                <span>মাউস টেনে ডানে-বামে ৩৬০° কোণে ঘুরিয়ে দেখুন</span>
              </p>

              {/* 4 Interactive Showcase Switcher Buttons */}
              <div className="grid grid-cols-4 gap-2 w-full">
                {SHOWCASE_PRODUCTS.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectProduct(idx)}
                    className={`p-2 rounded-2xl border transition-all flex flex-col items-center gap-1 text-center cursor-pointer group ${
                      activeIdx === idx
                        ? "bg-amber-400/20 border-amber-400 ring-2 ring-amber-400/40 shadow-lg scale-105"
                        : "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl overflow-hidden bg-black/40 flex items-center justify-center p-1 border border-white/10">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain group-hover:scale-110 transition-transform"
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-200 line-clamp-1">
                      {item.name.split(" ")[2] || item.name.split(" ")[0]}
                    </span>
                    <span className="text-[9px] text-amber-400 font-black">
                      ৳ {item.basePrice}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ================= RIGHT: 3D SPECS, HOTSPOTS & 1-CLICK ORDER (5 Cols) ================= */}
          <div className="lg:col-span-5 space-y-5">
            {/* Title & Badge */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-extrabold text-[#5064df] bg-indigo-500/15 border border-indigo-500/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {activeItem.category}
                </span>
                <span className="text-[11px] font-bold text-rose-400 bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Flame size={12} className="text-rose-400" />
                  <span>মাত্র {activeItem.stockLeft} টি অবশিষ্ট!</span>
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                {activeItem.name}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-amber-300">
                {activeItem.bengaliTitle}
              </p>
              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {activeItem.description}
              </p>
            </div>

            {/* Price & Savings Pill */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-white/10 via-white/5 to-transparent border border-white/15 backdrop-blur-md flex items-center justify-between">
              <div>
                <div className="flex items-baseline gap-2.5">
                  <span className="text-2xl sm:text-3xl font-black text-amber-400">
                    ৳ {activeItem.basePrice.toLocaleString()}
                  </span>
                  <span className="text-xs sm:text-sm text-slate-400 line-through">
                    ৳ {activeItem.oldPrice.toLocaleString()}
                  </span>
                </div>
                <span className="text-[10px] text-emerald-400 font-bold block mt-0.5">
                  ✓ সাশ্রয় হচ্ছে ৳ {(activeItem.oldPrice - activeItem.basePrice).toLocaleString()} টাকা (ক্যাশ অন ডেলিভারি)
                </span>
              </div>

              <span className="text-xs font-black text-white bg-red-600 px-3 py-1.5 rounded-xl shadow-md">
                {Math.round(((activeItem.oldPrice - activeItem.basePrice) / activeItem.oldPrice) * 100)}% ছাড়
              </span>
            </div>

            {/* Interactive 3D Hotspot Inspector Pill */}
            <div className="p-3.5 rounded-2xl bg-indigo-950/40 border border-indigo-500/30">
              <span className="text-[11px] font-extrabold text-indigo-300 uppercase tracking-wider block mb-2">
                🔍 ৩ডি হটস্পট টাচপয়েন্ট ({activeItem.hotspots.length} টি ফিচার)
              </span>
              <div className="grid grid-cols-3 gap-2">
                {activeItem.hotspots.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setActiveHotspot(activeHotspot?.id === h.id ? null : h)}
                    className={`p-2 rounded-xl border text-[11px] font-bold text-left transition-all cursor-pointer ${
                      activeHotspot?.id === h.id
                        ? "bg-amber-400 text-slate-950 border-amber-400 shadow-md"
                        : "bg-white/5 border-white/10 text-slate-300 hover:bg-white/15 hover:text-white"
                    }`}
                  >
                    <span className="block truncate">{h.title.split(" ")[0]}</span>
                    <span className="text-[9px] opacity-75 block truncate">ক্লিক করুন ›</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Swatches */}
            {activeItem.colors && activeItem.colors.length > 1 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>কালার ভ্যারিয়েশন:</span>
                  <span className="text-amber-300 font-semibold">
                    {activeItem.colors[selectedColorIdx]?.name}
                  </span>
                </label>
                <div className="flex items-center gap-2.5">
                  {activeItem.colors.map((color, cIdx) => (
                    <button
                      key={cIdx}
                      type="button"
                      onClick={() => setSelectedColorIdx(cIdx)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        selectedColorIdx === cIdx
                          ? "bg-white/20 border-amber-400 text-white ring-1 ring-amber-400"
                          : "bg-white/5 border-white/10 text-slate-400 hover:text-white"
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full border border-white/30"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Size Selector */}
            {activeItem.sizes && activeItem.sizes.length > 1 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
                  <span>সাইজ নির্বাচন:</span>
                  <span className="text-amber-300 font-semibold">{selectedSize}</span>
                </label>
                <div className="flex items-center gap-2">
                  {activeItem.sizes.map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`w-12 h-10 rounded-xl font-black text-xs transition-all border cursor-pointer ${
                        selectedSize === sz
                          ? "bg-amber-400 text-slate-950 border-amber-400 shadow-md shadow-amber-400/30 scale-105"
                          : "bg-white/5 text-slate-300 border-white/15 hover:bg-white/15 hover:text-white"
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons: Add to Cart & Buy COD Now */}
            <div className="space-y-2 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-black text-sm border border-white/20 transition-all active:scale-95 shadow-lg cursor-pointer"
                >
                  <ShoppingBag size={18} />
                  <span>{toastMessage || "কার্টে যোগ করুন"}</span>
                </button>

                <Link
                  href="/checkout"
                  onClick={handleAddToCart}
                  className="flex items-center justify-center gap-2 py-3 px-5 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black text-sm transition-all active:scale-95 shadow-xl shadow-amber-400/25 text-center"
                >
                  <Zap size={18} className="fill-slate-950 text-slate-950" />
                  <span>ক্যাশ অন ডেলিভারিতে কিনুন</span>
                </Link>
              </div>

              {/* COD Guarantees */}
              <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-400" />
                  <span>১০০% আসল পণ্য</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck size={14} className="text-indigo-400" />
                  <span>ক্যাশ অন ডেলিভারি</span>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <RotateCcw size={14} className="text-amber-400" />
                  <span>৭ দিন রিপ্লেসমেন্ট</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ================= 3 BOTTOM LUXURY 3D VALUE CARDS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-14 pt-10 border-t border-white/10">
          <div className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-amber-400/40 transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-amber-400/15 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Compass size={22} />
            </div>
            <h4 className="text-base font-bold text-white mb-1">৩৬০° ভার্চুয়াল টাচ ও স্পিন</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              সরাসরি স্পর্শ করে যেকোনো কোণ থেকে পোশাকের টেক্সচার, সেলাই ও ফিনিশিং নিখুঁতভাবে দেখার সুযোগ।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-indigo-400/40 transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Truck size={22} />
            </div>
            <h4 className="text-base font-bold text-white mb-1">সরাসরি ক্যাশ অন ডেলিভারি</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              কোনো অগ্রিম পেমেন্ট নেই। সারাদেশের ৬৪ জেলায় পার্সেল হাতে পেয়ে চেক করে মূল্য পরিশোধ করুন।
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-br from-white/5 to-white/0 border border-white/10 hover:border-emerald-400/40 transition-all group">
            <div className="w-11 h-11 rounded-2xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Award size={22} />
            </div>
            <h4 className="text-base font-bold text-white mb-1">Old Rank অথেনটিসিটি সিল</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              প্রতিটি সিগনেচার প্রোডাক্টের সাথে পাচ্ছেন অফিসিয়াল অথেনটিসিটি কার্ড এবং ৭ দিনের ইনস্ট্যান্ট সাইজ সোয়াপ পলিসি।
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
