"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ShoppingCart,
  Truck,
  Store,
  User,
  Menu,
  ChevronDown,
  PhoneCall,
  Crown,
  LogOut,
  Settings,
  Package,
  ShieldCheck,
  Flame,
  ArrowRight,
  X,
  Layers,
} from "lucide-react";
import { useCartStore, useAuthStore } from "@/lib/store";
import { api } from "@/lib/api";
import { ICategory, IProduct } from "@/lib/types";
import ProductImage from "@/components/product/ProductImage";

export default function Navbar() {
  const router = useRouter();
  const totalItems = useCartStore((state) => state.getTotalItems());
  const subtotal = useCartStore((state) => state.getSubtotal());
  const openCart = useCartStore((state) => state.openCartDrawer);

  const { user, isLoggedIn, logout } = useAuthStore();

  const [categories, setCategories] = useState<ICategory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<IProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const categoryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (servicesRef.current && !servicesRef.current.contains(event.target as Node)) {
        setIsServicesOpen(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setIsCategoryOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (searchQuery.trim().length > 1) {
      setIsSearching(true);
      const timer = setTimeout(async () => {
        const results = await api.getProducts({ search: searchQuery.trim() });
        setSearchResults(results.slice(0, 5));
        setIsSearching(false);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
    }
  }, [searchQuery]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/category/all?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchResults([]);
    }
  };

  const handleLogout = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="sticky top-0 z-40 bg-white shadow-xs border-b border-slate-200">
      {/* Top Corporate Micro Bar */}
      <div className="bg-[#1e293b] text-slate-300 text-[11px] py-1.5 px-3 sm:px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-6 min-w-0">
            <a
              href="tel:01956016119"
              className="flex items-center gap-1 sm:gap-1.5 hover:text-white transition-colors truncate"
            >
              <PhoneCall size={12} className="text-emerald-400 shrink-0" />
              <span className="truncate">
                হটলাইন: <strong className="text-white">01956-016119</strong>
              </span>
            </a>
            <a
              href="tel:01301010553"
              className="hidden lg:flex items-center gap-1 hover:text-white transition-colors"
            >
              <span className="text-slate-400">/</span>
              <strong className="text-white">01301-010553</strong>
            </a>
            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              <Truck size={12} className="text-amber-400 shrink-0" />
              <span>সারাদেশে ৬৪ জেলায় দ্রুত হোম ডেলিভারি</span>
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400 font-semibold">
              <ShieldCheck size={13} />
              <span>১০০% অথেনটিক পণ্য গ্যারান্টি</span>
            </span>
            <span className="text-slate-500 hidden sm:inline">•</span>
            <Link
              href="/order-track"
              className="text-slate-300 hover:text-white transition-colors text-[11px] flex items-center gap-1 font-medium"
            >
              <Truck size={12} className="text-amber-400" />
              <span>অর্ডার ট্র্যাকিং</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Header Bar (Single Unified Navigation Bar) */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4 lg:gap-6">
          {/* Mobile Menu Button + Logo */}
          <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
            <button
              onClick={() => setIsMobileDrawerOpen(true)}
              className="lg:hidden p-1.5 rounded-xl text-slate-700 hover:bg-slate-100 hover:text-[#303d6e] transition-colors cursor-pointer"
              aria-label="Open Navigation Drawer"
            >
              <Menu size={22} />
            </button>

            <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group">
              <img
                src="/images/logo.png"
                alt="Old Rank Logo"
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform shrink-0 ring-1 ring-slate-200"
              />
              <div>
                <div className="flex items-center gap-1">
                  <span className="font-black text-lg sm:text-2xl text-slate-900 tracking-tight block leading-none">
                    Old<span className="text-[#303d6e]">Rank</span>
                  </span>
                  <span className="text-[9px] sm:text-[10px] font-bold bg-amber-50 text-amber-700 px-1 sm:px-1.5 py-0.5 rounded border border-amber-200">
                    CLOTHING
                  </span>
                </div>
                <span className="text-[9px] sm:text-[10px] font-medium text-slate-500 uppercase tracking-widest block mt-0.5 hidden xl:block">
                  Wear Your Rank
                </span>
              </div>
            </Link>
          </div>

          {/* Primary Nav Menu (Embedded Directly in Navbar Row) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 text-xs font-bold text-slate-700">
            <Link
              href="/"
              className="px-2.5 py-2 rounded-xl hover:text-[#303d6e] hover:bg-slate-100 transition-colors"
            >
              হোম
            </Link>

            <Link
              href="/category/all"
              className="px-2.5 py-2 rounded-xl hover:text-[#303d6e] hover:bg-slate-100 transition-colors"
            >
              সকল প্রোডাক্ট
            </Link>

            {/* Categories Dropdown in Navbar */}
            <div className="relative" ref={categoryRef}>
              <button
                type="button"
                onClick={() => {
                  setIsCategoryOpen(!isCategoryOpen);
                  setIsServicesOpen(false);
                }}
                className={`flex items-center gap-1 px-2.5 py-2 rounded-xl transition-colors cursor-pointer ${
                  isCategoryOpen
                    ? "bg-[#303d6e] text-white"
                    : "hover:text-[#303d6e] hover:bg-slate-100 text-slate-700"
                }`}
              >
                <Layers size={14} />
                <span>ক্যাটাগরি</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    isCategoryOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isCategoryOpen && (
                <div className="absolute left-0 top-full mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 py-2 animate-fadeIn">
                  <div className="px-3.5 py-2 border-b border-slate-100 flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>ক্যাটাগরি তালিকা</span>
                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                      {categories.length}
                    </span>
                  </div>
                  <div className="max-h-80 overflow-y-auto py-1">
                    <Link
                      href="/category/all"
                      onClick={() => setIsCategoryOpen(false)}
                      className="flex items-center justify-between px-4 py-2 text-xs font-bold text-[#303d6e] hover:bg-indigo-50 transition-colors border-b border-slate-50"
                    >
                      <span>সব প্রডাক্ট একসাথে</span>
                      <ArrowRight size={13} />
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/category/${cat.slug}`}
                        onClick={() => setIsCategoryOpen(false)}
                        className="flex items-center justify-between px-4 py-2 text-xs text-slate-700 hover:bg-indigo-50 hover:text-[#303d6e] font-semibold transition-colors"
                      >
                        <span>{cat.name}</span>
                        <span className="text-slate-400 text-xs">›</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Hot Deals */}
            <Link
              href="/#hot-deals"
              className="px-2.5 py-2 rounded-xl text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-bold flex items-center gap-1 transition-colors"
            >
              <Flame size={14} className="text-rose-600" />
              <span>হট অফার 🔥</span>
            </Link>

            {/* Services & Partner Dropdown (Order Track, Seller Hub, Top Shops, Admin) */}
            <div className="relative" ref={servicesRef}>
              <button
                type="button"
                onClick={() => {
                  setIsServicesOpen(!isServicesOpen);
                  setIsCategoryOpen(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border transition-all cursor-pointer font-bold ${
                  isServicesOpen
                    ? "bg-[#303d6e] text-white border-[#303d6e]"
                    : "border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 text-slate-700 hover:text-[#303d6e]"
                }`}
              >
                <Store size={14} className={isServicesOpen ? "text-amber-300" : "text-amber-600"} />
                <span>সার্ভিস ও ট্র্যাকিং</span>
                <ChevronDown
                  size={13}
                  className={`transition-transform duration-200 ${
                    isServicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isServicesOpen && (
                <div className="absolute left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 p-2 animate-fadeIn">
                  <div className="px-3 py-2 bg-slate-50 rounded-xl mb-1.5 border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-900">সার্ভিস ও ভেন্ডর হাব</p>
                    <p className="text-[10px] text-slate-500">ট্র্যাকিং ও পার্টনার পোর্টালে স্বাগতম</p>
                  </div>

                  <div className="space-y-1">
                    {/* Order Track */}
                    <Link
                      href="/order-track"
                      onClick={() => setIsServicesOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-indigo-50 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 text-[#303d6e] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <Truck size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-[#303d6e]">
                          অর্ডার ট্র্যাক করুন
                        </p>
                        <p className="text-[10px] text-slate-500">পার্সেল রিয়েল-টাইম অবস্থান জানুন</p>
                      </div>
                    </Link>

                    {/* Seller Hub */}
                    <Link
                      href="/login"
                      onClick={() => setIsServicesOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-50/70 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <Store size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-amber-800">
                          সেলার হাব ও রেজিস্টার
                        </p>
                        <p className="text-[10px] text-slate-500">ভেন্ডর একাউন্ট ও পার্টনার পোর্টাল</p>
                      </div>
                    </Link>

                    {/* Top Shops */}
                    <Link
                      href="/sellers"
                      onClick={() => setIsServicesOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-100 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <Package size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-[#303d6e]">
                          টপ ভেন্ডর শপসমূহ
                        </p>
                        <p className="text-[10px] text-slate-500">সেরা বিশ্বস্ত সেলারদের শপ</p>
                      </div>
                    </Link>

                    {/* Admin Dashboard */}
                    <Link
                      href="/admin"
                      onClick={() => setIsServicesOpen(false)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-amber-100/60 bg-amber-50/50 transition-colors group border border-amber-200/50"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                        <Crown size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-amber-950">
                          অ্যাডমিন ড্যাশবোর্ড
                        </p>
                        <p className="text-[10px] text-amber-700">সাইট কন্ট্রোল ও অ্যানালিটিক্স</p>
                      </div>
                    </Link>
                  </div>

                  {/* Customer Hotline in Dropdown */}
                  <div className="mt-2 pt-2 border-t border-slate-100 space-y-1">
                    <p className="text-[10px] text-slate-400 font-bold px-2">কাস্টমার হেল্পলাইন</p>
                    <a
                      href="tel:01956016119"
                      className="flex items-center gap-2 px-2 py-1 text-[11px] font-semibold text-slate-700 hover:text-emerald-600 transition-colors"
                    >
                      <PhoneCall size={12} className="text-emerald-500" />
                      <span>01956-016119</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          </nav>

          {/* Search Box with Autocomplete */}
          <div className="flex-1 max-w-xs xl:max-w-sm relative hidden sm:block">
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="প্রোডাক্ট খুঁজুন... যেমন: Shirt, Canva"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#303d6e] focus:bg-white transition-all shadow-inner"
              />
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#303d6e] hover:bg-indigo-900 text-white flex items-center justify-center transition-colors shadow-sm cursor-pointer"
                aria-label="Search"
              >
                <Search size={13} />
              </button>
            </form>

            {/* Live Autocomplete Results */}
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50">
                <div className="p-2.5 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider flex justify-between">
                  <span>প্রস্তাবিত পণ্যসমূহ</span>
                  <span>{searchResults.length} টি পাওয়া গেছে</span>
                </div>
                {searchResults.map((item) => (
                  <Link
                    key={item._id}
                    href={`/product/${item.slug}`}
                    onClick={() => setSearchResults([])}
                    className="flex items-center gap-3 p-3 hover:bg-indigo-50/50 transition-colors border-b border-slate-50 last:border-none"
                  >
                    <div className="w-11 h-11 rounded-lg overflow-hidden border border-slate-100 shrink-0 bg-white">
                      <ProductImage
                        src={item.mainImage}
                        alt={item.name}
                        className="w-full h-full object-cover"
                        showText={false}
                        iconSize={14}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs font-bold text-[#303d6e]">
                          ৳ {item.basePrice.toLocaleString()}
                        </span>
                        {item.oldPrice && (
                          <span className="text-[11px] text-slate-400 line-through">
                            ৳ {item.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Right Actions (Auth, Cart) */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* USER LOGIN / LOGOUT PROFILE DROPDOWN */}
            <div className="relative" ref={userMenuRef}>
              {isLoggedIn && user ? (
                <div>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all cursor-pointer text-left"
                    aria-label="User Menu"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#303d6e] text-white flex items-center justify-center text-xs font-bold shadow-xs">
                      {user.role === "admin" ? (
                        <Crown size={16} className="text-amber-300" />
                      ) : user.role === "seller" ? (
                        <Store size={16} className="text-amber-300" />
                      ) : (
                        user.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="flex items-center gap-1">
                        <span className="text-xs font-bold text-slate-900 block truncate max-w-[90px]">
                          {user.name.split(" ")[0]}
                        </span>
                        {user.role === "admin" ? (
                          <span className="text-[9px] bg-amber-100 text-amber-800 font-extrabold px-1 rounded">
                            Admin
                          </span>
                        ) : user.role === "seller" ? (
                          <span className="text-[9px] bg-indigo-100 text-[#303d6e] font-extrabold px-1 rounded">
                            Seller
                          </span>
                        ) : null}
                      </div>
                      <span className="text-[10px] text-slate-500 block leading-tight">
                        আমার অ্যাকাউন্ট
                      </span>
                    </div>
                    <ChevronDown size={14} className="text-slate-400 hidden sm:block" />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-fadeIn">
                      <div className="p-3.5 bg-slate-50 border-b border-slate-100">
                        <div className="flex items-center gap-2.5">
                          <div className="w-10 h-10 rounded-xl bg-[#303d6e] text-white flex items-center justify-center font-bold text-sm">
                            {user.role === "admin" ? (
                              <Crown size={18} className="text-amber-400" />
                            ) : user.role === "seller" ? (
                              <Store size={18} className="text-amber-400" />
                            ) : (
                              <User size={18} />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-black text-slate-900 truncate">{user.name}</p>
                            <p className="text-[11px] text-slate-500 truncate">{user.email || user.phone}</p>
                            <span className="inline-block text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-indigo-100 text-[#303d6e] mt-1">
                              {user.role === "admin"
                                ? "👑 সিস্টেম অ্যাডমিন"
                                : user.role === "seller"
                                ? "🏪 ভেন্ডর / সেলার"
                                : "👤 কাস্টমার"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="p-2 space-y-1 text-xs font-semibold text-slate-700">
                        {(user.role === "admin" || user.role === "seller") && (
                          <Link
                            href="/admin"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-amber-50 text-amber-900 hover:bg-amber-100 transition-colors font-bold border border-amber-200/60"
                          >
                            {user.role === "admin" ? (
                              <Crown size={15} className="text-amber-600" />
                            ) : (
                              <Store size={15} className="text-indigo-600" />
                            )}
                            <span>{user.role === "admin" ? "অ্যাডমিন ড্যাশবোর্ড" : "সেলার ড্যাশবোর্ড"}</span>
                          </Link>
                        )}

                        <Link
                          href="/order-track"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                          <Package size={15} className="text-slate-500" />
                          <span>আমার অর্ডারসমূহ</span>
                        </Link>

                        <Link
                          href="/login"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                          <Settings size={15} className="text-slate-500" />
                          <span>প্রোফাইল তথ্য</span>
                        </Link>

                        <div className="border-t border-slate-100 my-1"></div>

                        <button
                          type="button"
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer text-left"
                        >
                          <LogOut size={15} />
                          <span>লগআউট করুন</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 py-2 px-3 rounded-xl bg-slate-50 hover:bg-indigo-50 border border-slate-200 hover:border-indigo-300 text-slate-800 hover:text-[#303d6e] transition-all text-xs font-bold group"
                  title="লগইন বা রেজিস্টার"
                >
                  <div className="w-6 h-6 rounded-md bg-[#303d6e]/10 text-[#303d6e] flex items-center justify-center group-hover:bg-[#303d6e] group-hover:text-white transition-colors">
                    <User size={14} />
                  </div>
                  <span className="hidden sm:inline">লগইন</span>
                </Link>
              )}
            </div>

            {/* Cart Trigger */}
            <button
              onClick={openCart}
              className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-xl bg-[#303d6e] text-white hover:bg-indigo-900 transition-all text-left group shadow-sm cursor-pointer shrink-0"
              aria-label="View Cart"
            >
              <div className="relative">
                <ShoppingCart size={18} />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2.5 bg-red-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-white shadow animate-bounce">
                    {totalItems}
                  </span>
                )}
              </div>
              <div className="hidden sm:block">
                <span className="text-[10px] text-indigo-200 uppercase tracking-wider block font-semibold leading-tight">
                  কার্ট
                </span>
                <span className="text-xs font-bold text-white block leading-tight">
                  ৳ {subtotal.toLocaleString()}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 block sm:hidden">
          <form onSubmit={handleSearchSubmit} className="relative">
            <input
              type="text"
              placeholder="প্রোডাক্ট খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-full text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#303d6e]"
            />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#303d6e] text-white flex items-center justify-center cursor-pointer"
              aria-label="Search"
            >
              <Search size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Slide-in Mobile Drawer */}
      {isMobileDrawerOpen && (
        <div className="fixed inset-0 z-50 md:hidden animate-fade-in">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileDrawerOpen(false)}
          />

          {/* Drawer Menu Content */}
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white shadow-2xl flex flex-col z-10 animate-slide-left [transform:translateX(0)]">
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#1e293b] to-[#303d6e] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/logo.png"
                  alt="Old Rank Logo"
                  className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-amber-400/40"
                />
                <div>
                  <h3 className="font-extrabold text-sm text-white leading-tight">Old Rank</h3>
                  <p className="text-[10px] text-amber-300 font-medium">Wear Your Rank</p>
                </div>
              </div>
              <button
                onClick={() => setIsMobileDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close Drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* User Quick Info */}
            <div className="p-3 bg-slate-50 border-b border-slate-100">
              {isLoggedIn && user ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#303d6e] text-white font-bold text-xs flex items-center justify-center shrink-0">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-500 truncate">{user.phone || user.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-red-600 text-xs font-bold p-1 hover:bg-red-50 rounded cursor-pointer"
                    title="Logout"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="flex items-center justify-center gap-2 bg-[#0b0f19] hover:bg-slate-900 text-amber-400 text-xs font-bold py-2 rounded-xl shadow-xs transition-colors border border-amber-400/30"
                >
                  <Store size={14} />
                  <span>সেলার অ্যাকাউন্ট / লগইন</span>
                </Link>
              )}
            </div>

            {/* Scrollable Navigation Items */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs font-semibold">
              {/* Primary Nav Links */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  মূল মেনু
                </span>
                <div className="space-y-1">
                  <Link
                    href="/"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors font-bold"
                  >
                    <span>হোম</span>
                    <ArrowRight size={13} className="text-slate-400" />
                  </Link>

                  <Link
                    href="/category/all"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl text-slate-800 hover:bg-slate-100 transition-colors font-bold"
                  >
                    <span>সকল প্রোডাক্ট</span>
                    <ArrowRight size={13} className="text-slate-400" />
                  </Link>

                  <Link
                    href="/#hot-deals"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-rose-50 text-rose-700 font-bold hover:bg-rose-100 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Flame size={16} className="text-rose-600" />
                      <span>হট ডিল অফার</span>
                    </span>
                    <span className="text-[10px] bg-rose-600 text-white px-1.5 py-0.5 rounded-full">HOT</span>
                  </Link>
                </div>
              </div>

              {/* Services & Partner Links */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  সার্ভিস ও ট্র্যাকিং
                </span>
                <div className="space-y-1">
                  <Link
                    href="/order-track"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-[#303d6e] transition-colors"
                  >
                    <Truck size={16} className="text-indigo-600" />
                    <span>অর্ডার ট্র্যাকিং</span>
                  </Link>

                  <Link
                    href="/login"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-amber-50 hover:text-amber-800 transition-colors"
                  >
                    <Store size={16} className="text-amber-600" />
                    <span>সেলার হাব ও পার্টনার পোর্টাল</span>
                  </Link>

                  <Link
                    href="/sellers"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-[#303d6e] transition-colors"
                  >
                    <Package size={16} className="text-slate-500" />
                    <span>ভেরিফাইড শপসমূহ</span>
                  </Link>

                  <Link
                    href="/admin"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-amber-50 text-amber-900 font-bold hover:bg-amber-100 transition-colors border border-amber-200/50"
                  >
                    <Crown size={16} className="text-amber-600" />
                    <span>অ্যাডমিন ড্যাশবোর্ড</span>
                  </Link>
                </div>
              </div>

              {/* All Categories */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  সকল ক্যাটাগরি ({categories.length})
                </span>
                <div className="space-y-1">
                  <Link
                    href="/category/all"
                    onClick={() => setIsMobileDrawerOpen(false)}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-800 hover:bg-indigo-50 hover:text-[#303d6e] transition-colors font-bold"
                  >
                    <span className="flex items-center gap-2">
                      <Layers size={15} className="text-[#303d6e]" />
                      <span>সব প্রডাক্ট একসাথে</span>
                    </span>
                    <ArrowRight size={13} className="text-slate-400" />
                  </Link>

                  {categories.map((cat) => (
                    <Link
                      key={cat._id}
                      href={`/category/${cat.slug}`}
                      onClick={() => setIsMobileDrawerOpen(false)}
                      className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-indigo-50 hover:text-[#303d6e] transition-colors"
                    >
                      <span>{cat.name}</span>
                      <span className="text-slate-400">›</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Hotline Action in Drawer */}
            <div className="p-3 border-t border-slate-100 bg-slate-50 space-y-1.5">
              <a
                href="tel:01956016119"
                className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 py-2.5 px-3 rounded-xl transition-colors"
              >
                <PhoneCall size={14} />
                <span>হটলাইন: 01956-016119</span>
              </a>
              <a
                href="tel:01301010553"
                className="flex items-center justify-center gap-2 text-xs font-bold text-slate-700 bg-slate-200 hover:bg-slate-300 py-2 px-3 rounded-xl transition-colors"
              >
                <PhoneCall size={14} />
                <span>হেল্পলাইন: 01301-010553</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
