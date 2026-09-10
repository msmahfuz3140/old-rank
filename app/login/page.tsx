"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Crown,
  CheckCircle2,
  LogOut,
  Sparkles,
  Store,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { IUser } from "@/lib/types";

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoggedIn, login, logout } = useAuthStore();

  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDemoTab, setActiveDemoTab] = useState<"admin" | "seller" | "customer">("admin");
  const [successMsg, setSuccessMsg] = useState("");

  // 1-Click Instant Demo Login Handlers
  const handleInstantDemoLogin = (role: "admin" | "seller" | "customer") => {
    setIsSubmitting(true);

    let demoUser: IUser;
    let redirectPath = "/";
    let message = "";

    if (role === "admin") {
      demoUser = {
        id: "usr_admin",
        name: "Old Rank Super Admin",
        phone: "01849832178",
        email: "admin@oldrank.com",
        role: "admin",
      };
      redirectPath = "/admin";
      message = "👑 অ্যাডমিন হিসেবে সফলভাবে লগইন হয়েছে! ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে...";
    } else if (role === "seller") {
      demoUser = {
        id: "usr_seller_1",
        name: "তানভীর আহমেদ (ভেন্ডর)",
        shopName: "Gadget King BD",
        phone: "01822334455",
        email: "seller@gadgetking.com",
        role: "seller",
      };
      redirectPath = "/admin";
      message = "🏪 সেলার হিসেবে সফলভাবে লগইন হয়েছে! শপ প্যানেলে রিডাইরেক্ট করা হচ্ছে...";
    } else {
      demoUser = {
        id: "usr_customer_1",
        name: "মাহফুজুল হক",
        phone: "01712345678",
        email: "mahfuz@gmail.com",
        role: "customer",
      };
      redirectPath = "/";
      message = "👤 কাস্টমার হিসেবে সফলভাবে লগইন হয়েছে!";
    }

    setTimeout(() => {
      login(demoUser);
      setIsSubmitting(false);
      setSuccessMsg(message);

      setTimeout(() => {
        router.push(redirectPath);
      }, 600);
    }, 350);
  };

  // Form Pre-fill Helper
  const handleFillCredentials = (role: "admin" | "seller" | "customer") => {
    setActiveDemoTab(role);
    if (role === "admin") {
      setLoginInput("admin@shopgenie.com");
      setPassword("admin12345");
    } else if (role === "seller") {
      setLoginInput("seller@gadgetking.com");
      setPassword("seller12345");
    } else {
      setLoginInput("01712345678");
      setPassword("demo12345");
    }
  };

  // Form Submit Handler
  const handleStandardLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);

      const input = loginInput.toLowerCase().trim();
      let role: "admin" | "seller" | "customer" = "customer";
      let name = "সম্মানিত গ্রাহক";
      let shopName: string | undefined = undefined;

      if (input.includes("admin") || input === "01849832178") {
        role = "admin";
        name = "Old Rank Super Admin";
      } else if (input.includes("seller") || input.includes("vendor") || input === "01822334455") {
        role = "seller";
        name = "Gadget King BD (সেলার)";
        shopName = "Gadget King BD";
      }

      const authUser: IUser = {
        id: `usr_${Date.now()}`,
        name,
        phone: input.includes("@") ? "01712345678" : input,
        email: input.includes("@") ? input : `${role}@oldrank.com`,
        role,
        shopName,
      };

      login(authUser);
      setSuccessMsg(`স্বাগতম, ${authUser.name}! সফলভাবে লগইন হয়েছে।`);

      setTimeout(() => {
        if (role === "admin" || role === "seller") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }, 600);
    }, 500);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-9 border border-slate-200/80 shadow-xl space-y-6">
        {/* If Already Logged In */}
        {isLoggedIn && user ? (
          <div className="text-center space-y-5">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-[#303d6e] flex items-center justify-center mx-auto border-2 border-indigo-100 shadow-sm">
              {user.role === "admin" ? (
                <Crown size={32} className="text-amber-500" />
              ) : user.role === "seller" ? (
                <Store size={32} className="text-indigo-600" />
              ) : (
                <User size={32} />
              )}
            </div>

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-[#303d6e] mb-2">
                {user.role === "admin"
                  ? "👑 সিস্টেম অ্যাডমিনিস্ট্রেটর"
                  : user.role === "seller"
                  ? "🏪 অথরাইজড সেলার / ভেন্ডর"
                  : "👤 সম্মানিত কাস্টমার"}
              </div>
              <h2 className="text-xl font-black text-slate-900">{user.name}</h2>
              {user.shopName && (
                <p className="text-xs font-bold text-indigo-700 mt-0.5">দোকান: {user.shopName}</p>
              )}
              <p className="text-xs text-slate-500 mt-0.5">{user.email || user.phone}</p>
            </div>

            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 text-left space-y-2 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-200/60">
                <span className="text-slate-400 font-medium">মোবাইল:</span>
                <span className="font-bold text-slate-800">{user.phone}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-400 font-medium">অ্যাক্সেস লেভেল:</span>
                <span className="font-bold text-indigo-700 capitalize">{user.role}</span>
              </div>
            </div>

            {/* Quick Switch Role Buttons */}
            <div className="p-3 bg-slate-100/70 rounded-2xl border border-slate-200 space-y-2 text-left">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                অন্য রোলে সুইচ করুন (Quick Switch):
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleInstantDemoLogin("admin")}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    user.role === "admin"
                      ? "bg-[#303d6e] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  <Crown size={13} className="text-amber-400" />
                  <span>Admin</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInstantDemoLogin("seller")}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    user.role === "seller"
                      ? "bg-[#303d6e] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  <Store size={13} className="text-blue-400" />
                  <span>Seller</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleInstantDemoLogin("customer")}
                  className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                    user.role === "customer"
                      ? "bg-[#303d6e] text-white shadow-xs"
                      : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  <User size={13} className="text-emerald-500" />
                  <span>Customer</span>
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 pt-1">
              {user.role === "admin" || user.role === "seller" ? (
                <Link
                  href="/admin"
                  className="w-full bg-[#303d6e] hover:bg-indigo-950 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Crown size={16} className="text-amber-400" /> ড্যাশবোর্ডে প্রবেশ করুন
                </Link>
              ) : (
                <Link
                  href="/order-track"
                  className="w-full bg-[#303d6e] hover:bg-indigo-950 text-white font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  📦 আপনার অর্ডার ট্র্যাক করুন
                </Link>
              )}

              <Link
                href="/"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-4 rounded-xl text-sm transition-colors text-center"
              >
                হোমপেজে যান
              </Link>

              <button
                type="button"
                onClick={logout}
                className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <LogOut size={14} /> লগআউট করুন
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="text-center">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#303d6e] flex items-center justify-center mx-auto mb-3 font-bold border border-indigo-100">
                <ShieldCheck size={26} />
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                অ্যাকাউন্টে প্রবেশ করুন
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                নিচের ডেমো রোলগুলোতে ১-ক্লিক করে সরাসরি টেস্ট করুন
              </p>
            </div>

            {/* Success Toast Banner */}
            {successMsg && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* 🎯 1-CLICK INSTANT DEMO LOGIN HUB (Admin / Seller / Customer) */}
            <div className="space-y-2.5 bg-gradient-to-br from-slate-50 to-indigo-50/40 p-4 rounded-2xl border border-indigo-100/80 shadow-xs">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <Sparkles size={14} className="text-amber-500" /> ১-ক্লিক ইনস্ট্যান্ট ডেমো লগইন
                </span>
                <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100">
                  পাসওয়ার্ড ছাড়াই প্রবেশ
                </span>
              </div>

              {/* 3 Dedicated Demo Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {/* Admin Demo Button */}
                <button
                  type="button"
                  onClick={() => handleInstantDemoLogin("admin")}
                  disabled={isSubmitting}
                  className="group relative bg-white hover:bg-gradient-to-b hover:from-amber-50/50 hover:to-white border-2 border-amber-200/80 hover:border-amber-400 p-3 rounded-2xl text-left transition-all active:scale-97 shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold">
                      <Crown size={17} />
                    </div>
                    <span className="text-[9px] font-extrabold uppercase bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded">
                      Admin
                    </span>
                  </div>
                  <div className="font-extrabold text-xs text-slate-900 group-hover:text-amber-700">
                    অ্যাডমিন লগইন
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">admin@shopgenie.com</div>
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-amber-600">
                    <span>ড্যাশবোর্ড</span>
                    <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                {/* Seller Demo Button */}
                <button
                  type="button"
                  onClick={() => handleInstantDemoLogin("seller")}
                  disabled={isSubmitting}
                  className="group relative bg-white hover:bg-gradient-to-b hover:from-indigo-50/50 hover:to-white border-2 border-indigo-200/80 hover:border-indigo-400 p-3 rounded-2xl text-left transition-all active:scale-97 shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#303d6e] flex items-center justify-center font-bold">
                      <Store size={17} />
                    </div>
                    <span className="text-[9px] font-extrabold uppercase bg-indigo-100 text-[#303d6e] px-1.5 py-0.5 rounded">
                      Seller
                    </span>
                  </div>
                  <div className="font-extrabold text-xs text-slate-900 group-hover:text-[#303d6e]">
                    সেলার লগইন
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">seller@gadgetking.com</div>
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-[#303d6e]">
                    <span>ভেন্ডর শপ</span>
                    <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>

                {/* Customer Demo Button */}
                <button
                  type="button"
                  onClick={() => handleInstantDemoLogin("customer")}
                  disabled={isSubmitting}
                  className="group relative bg-white hover:bg-gradient-to-b hover:from-emerald-50/50 hover:to-white border-2 border-emerald-200/80 hover:border-emerald-400 p-3 rounded-2xl text-left transition-all active:scale-97 shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                      <User size={17} />
                    </div>
                    <span className="text-[9px] font-extrabold uppercase bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded">
                      User
                    </span>
                  </div>
                  <div className="font-extrabold text-xs text-slate-900 group-hover:text-emerald-700">
                    কাস্টমার লগইন
                  </div>
                  <div className="text-[10px] text-slate-400 truncate mt-0.5">01712345678</div>
                  <div className="mt-2 pt-1.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-emerald-600">
                    <span>শপিং হোম</span>
                    <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex py-1 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="shrink-0 mx-3 text-slate-400 text-[11px] uppercase tracking-wider font-semibold">
                অথবা ফরম পূরণ করে লগইন করুন
              </span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Quick Fill Helper Tabs */}
            <div className="flex items-center justify-between text-xs bg-slate-50 p-1.5 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-400 pl-2">ফর্ম ফিল করুন:</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => handleFillCredentials("admin")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDemoTab === "admin" && loginInput.includes("admin")
                      ? "bg-[#303d6e] text-white"
                      : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  👑 Admin
                </button>
                <button
                  type="button"
                  onClick={() => handleFillCredentials("seller")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDemoTab === "seller" && loginInput.includes("seller")
                      ? "bg-[#303d6e] text-white"
                      : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  🏪 Seller
                </button>
                <button
                  type="button"
                  onClick={() => handleFillCredentials("customer")}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    activeDemoTab === "customer" && loginInput.includes("017")
                      ? "bg-[#303d6e] text-white"
                      : "bg-white text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  👤 Customer
                </button>
              </div>
            </div>

            {/* Standard Form */}
            <form onSubmit={handleStandardLogin} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase">
                  মোবাইল নম্বর বা ইমেইল
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="017xxxxxxxx অথবা admin@shopgenie.com"
                    value={loginInput}
                    onChange={(e) => setLoginInput(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#303d6e] focus:bg-white transition-all"
                  />
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5 uppercase">
                  পাসওয়ার্ড
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#303d6e] focus:bg-white transition-all"
                  />
                  <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    aria-label="Toggle password"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#303d6e] hover:bg-indigo-950 text-white font-bold py-3.5 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-950/20 transition-all active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  "লগইন হচ্ছে..."
                ) : (
                  <>
                    ম্যানুয়াল সাবমিট করে প্রবেশ করুন <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            <div className="border-t border-slate-100 pt-4 text-center text-xs text-slate-500">
              সরাসরি সেলার শপ ব্রাউজ করতে চান?{" "}
              <Link href="/sellers" className="text-[#303d6e] font-extrabold hover:underline">
                সেলার শপ ডিরেক্টরি দেখুন →
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
