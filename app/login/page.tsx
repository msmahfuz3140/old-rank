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
  BadgeCheck,
  Check,
  Building2,
  Phone,
  Mail,
  Info,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { IUser } from "@/lib/types";
import { api } from "@/lib/api";

export default function LoginPage() {
  const router = useRouter();
  const { user, isLoggedIn, login, logout } = useAuthStore();

  // Active Tab: "register-seller" or "login"
  const [activeTab, setActiveTab] = useState<"register-seller" | "login">("register-seller");

  // Login Form States
  const [loginInput, setLoginInput] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // Seller Registration Form States
  const [sellerRegisterForm, setSellerRegisterForm] = useState({
    shopName: "",
    ownerName: "",
    phone: "",
    email: "",
    category: "fashion",
    plan: "Pro" as "Standard" | "Pro" | "VIP",
    password: "",
    address: "Dhaka, Bangladesh",
  });

  // 1-Click Instant Demo Login Handlers
  const handleInstantDemoLogin = (role: "admin" | "seller") => {
    setIsSubmitting(true);
    setErrorMsg("");

    let demoUser: IUser;
    let redirectPath = "/admin";
    let message = "";

    if (role === "admin") {
      demoUser = {
        id: "usr_admin",
        name: "Old Rank Admin",
        phone: "01956016119",
        email: "mdmahfuzulhaque3140@gmail.com",
        role: "admin",
      };
      message = "👑 অ্যাডমিন হিসেবে সফলভাবে লগইন হয়েছে! ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে...";
    } else {
      demoUser = {
        id: "usr_seller_1",
        name: "তানভীর আহমেদ (ভেন্ডর)",
        shopName: "Gadget King BD",
        phone: "01822334455",
        email: "seller@gadgetking.com",
        role: "seller",
      };
      message = "🏪 সেলার হিসেবে সফলভাবে লগইন হয়েছে! শপ প্যানেলে রিডাইরেক্ট করা হচ্ছে...";
    }

    setTimeout(() => {
      login(demoUser);
      setIsSubmitting(false);
      setSuccessMsg(message);

      setTimeout(() => {
        router.push(redirectPath);
      }, 500);
    }, 350);
  };

  // Handle Manual Seller Registration
  const handleSellerRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!sellerRegisterForm.shopName || !sellerRegisterForm.phone) {
      setErrorMsg("দোকানের নাম ও মোবাইল নম্বর পূরণ করা আবশ্যক।");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.registerSeller({
        shopName: sellerRegisterForm.shopName,
        ownerName: sellerRegisterForm.ownerName || sellerRegisterForm.shopName,
        phone: sellerRegisterForm.phone,
        email: sellerRegisterForm.email || `${sellerRegisterForm.shopName.toLowerCase().replace(/[^a-z0-9]/g, "")}@gmail.com`,
        plan: sellerRegisterForm.plan,
        address: sellerRegisterForm.address,
      });

      const newAuthUser: IUser = {
        id: `usr_${Date.now()}`,
        name: sellerRegisterForm.ownerName || sellerRegisterForm.shopName,
        phone: sellerRegisterForm.phone,
        email: sellerRegisterForm.email || `${sellerRegisterForm.shopName.toLowerCase().replace(/[^a-z0-9]/g, "")}@gmail.com`,
        role: "seller",
        shopName: sellerRegisterForm.shopName,
      };

      login(newAuthUser);
      setSuccessMsg("🎉 অভিনন্দন! আপনার প্রিমিয়াম সেলার অ্যাকাউন্ট সফলভাবে ওপেন হয়েছে। ড্যাশবোর্ডে রিডাইরেক্ট করা হচ্ছে...");

      setTimeout(() => {
        router.push("/admin");
      }, 1000);
    } catch {
      setErrorMsg("রেজিস্ট্রেশন সম্পন্ন করা সম্ভব হয়নি। আবার চেষ্টা করুন।");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Manual Login
  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setSuccessMsg("");

    if (!loginInput.trim()) {
      setErrorMsg("অনুগ্রহ করে আপনার ফোন বা ইমেইল লিখুন।");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const input = loginInput.toLowerCase().trim();
      let role: "admin" | "seller" = "seller";
      let name = "ভেন্ডর পার্টনার";
      let shopName = "My Merchant Store";

      if (
        input.includes("admin") ||
        input === "01956016119" ||
        input === "01301010553" ||
        input === "mdmahfuzulhaque3140@gmail.com" ||
        input === "niloy@gmail.com"
      ) {
        role = "admin";
        name = "Old Rank Admin";
      } else {
        role = "seller";
        name = "সেলার পার্টনার";
        shopName = input.includes("@") ? input.split("@")[0].toUpperCase() : "Merchant Shop";
      }

      const authUser: IUser = {
        id: `usr_${Date.now()}`,
        name,
        phone: input.includes("@") ? "01956016119" : input,
        email: input.includes("@") ? input : (role === "admin" ? "mdmahfuzulhaque3140@gmail.com" : "seller@gmail.com"),
        role,
        shopName,
      };

      login(authUser);
      setSuccessMsg(`স্বাগতম, ${authUser.name}! সফলভাবে লগইন হয়েছে।`);

      setTimeout(() => {
        router.push("/admin");
      }, 600);
    }, 400);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8 bg-slate-50 font-sans">
      <div className="max-w-xl w-full space-y-5">
        {/* 🌟 NOTICE FOR BUYERS: NO LOGIN NEEDED TO SHOP! */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 rounded-3xl p-4 sm:p-5 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
              <ShoppingBag size={18} />
            </div>
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-emerald-950 flex items-center gap-1.5">
                <span>সম্মানিত ক্রেতাদের জন্য নোটিশ: কোনো লগইন লাগবে না!</span>
                <span className="text-[10px] bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full font-bold">
                  ১০০% ওপেন
                </span>
              </h3>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Old Rank-এ যেকোনো পণ্য দেখতে, কার্টে যোগ করতে বা কিনতে <strong>কোনো রেজিস্ট্রেশন বা লগইন করতে হবে না</strong>। আপনি যেকোনো সময় সরাসরি ক্যাশ অন ডেলিভারিতে অর্ডার করতে পারবেন। নিচের পোর্টালটি কেবল <strong>সেলার ও অ্যাডমিনদের</strong> জন্য।
              </p>
              <div className="pt-1">
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-900 hover:text-emerald-700 underline"
                >
                  সরাসরি শপিং করুন <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Card / Main Auth Container */}
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200/80 p-6 sm:p-8 space-y-6">
          {/* Header */}
          <div className="text-center">
            <Link href="/" className="inline-flex items-center gap-2 mb-3 group">
              <img
                src="/images/logo.png"
                alt="Old Rank Logo"
                className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400/60 shadow-md group-hover:scale-105 transition-transform"
              />
              <span className="font-black text-2xl text-slate-900 tracking-tight">
                Old<span className="text-amber-500">Rank</span>
              </span>
            </Link>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              সেলার ও মার্চেন্ট পোর্টাল
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              মার্চেন্ট পার্টনার হিসেবে ব্যবসা পরিচালনা করুন অথবা নতুন সেলার একাউন্ট খুলুন
            </p>
          </div>

          {/* If already logged in */}
          {isLoggedIn && user ? (
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center mx-auto text-xl font-black shadow-md">
                {user.role === "admin" ? <Crown size={24} /> : <Store size={24} />}
              </div>
              <div>
                <h3 className="font-black text-base text-slate-900">{user.name}</h3>
                <p className="text-xs text-slate-500">{user.phone || user.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-amber-100 text-amber-900 font-extrabold text-xs rounded-full uppercase">
                  {user.role === "admin" ? "Super Admin" : `Verified Seller (${user.shopName || "Store"})`}
                </span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/admin"
                  className="w-full bg-[#0b0f19] hover:bg-slate-900 text-amber-400 font-bold py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 shadow-md transition-all"
                >
                  <Store size={16} /> ড্যাশবোর্ডে প্রবেশ করুন
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
              {/* Tab Switcher */}
              <div className="grid grid-cols-2 p-1.5 bg-slate-100 rounded-2xl text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setActiveTab("register-seller")}
                  className={`py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === "register-seller"
                      ? "bg-white text-slate-950 shadow-sm font-black border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Sparkles size={14} className="text-amber-500" />
                  <span>সেলার অ্যাকাউন্ট খুলুন</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab("login")}
                  className={`py-2.5 px-3 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                    activeTab === "login"
                      ? "bg-white text-slate-950 shadow-sm font-black border border-slate-200/80"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <Lock size={14} />
                  <span>সেলার / অ্যাডমিন লগইন</span>
                </button>
              </div>

              {/* Success / Error Alerts */}
              {successMsg && (
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
                  <Info size={16} className="shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* TAB 1: REGISTER PREMIUM SELLER ACCOUNT */}
              {activeTab === "register-seller" && (
                <form onSubmit={handleSellerRegisterSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      দোকানের নাম (Store / Brand Name) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="যেমন: Urban Threads BD"
                      value={sellerRegisterForm.shopName}
                      onChange={(e) =>
                        setSellerRegisterForm({ ...sellerRegisterForm, shopName: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">স্বত্বাধিকারীর নাম (Owner Name)</label>
                      <input
                        type="text"
                        placeholder="আপনার নাম"
                        value={sellerRegisterForm.ownerName}
                        onChange={(e) =>
                          setSellerRegisterForm({ ...sellerRegisterForm, ownerName: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                      <input
                        type="tel"
                        required
                        placeholder="017XXXXXXXX"
                        value={sellerRegisterForm.phone}
                        onChange={(e) =>
                          setSellerRegisterForm({ ...sellerRegisterForm, phone: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">ইমেইল ঠিকানা (Email)</label>
                    <input
                      type="email"
                      placeholder="merchant@gmail.com"
                      value={sellerRegisterForm.email}
                      onChange={(e) =>
                        setSellerRegisterForm({ ...sellerRegisterForm, email: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  {/* Plan Tier Selection */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1.5">
                      প্রিমিয়াম সেলার প্যাকেজ নির্বাচন করুন (Select Plan)
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: "Standard", name: "Standard", badge: "ফ্রি পার্টনার", desc: "বেসিক লিস্টিং" },
                        { id: "Pro", name: "⚡ Pro Store", badge: "ভেরিফাইড", desc: "প্রায়োরিটি সাপোর্ট" },
                        { id: "VIP", name: "👑 VIP Brand", badge: "টপ র‍্যাঙ্ক", desc: "এক্সক্লুসিভ ফিচার" },
                      ].map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() =>
                            setSellerRegisterForm({
                              ...sellerRegisterForm,
                              plan: p.id as "Standard" | "Pro" | "VIP",
                            })
                          }
                          className={`p-2.5 rounded-xl border-2 text-left transition-all cursor-pointer ${
                            sellerRegisterForm.plan === p.id
                              ? "border-amber-500 bg-amber-50/50 shadow-xs"
                              : "border-slate-200 bg-white hover:border-slate-300"
                          }`}
                        >
                          <div className="font-extrabold text-[11px] text-slate-900">{p.name}</div>
                          <div className="text-[9px] text-amber-700 font-semibold">{p.badge}</div>
                          <div className="text-[8px] text-slate-400 mt-0.5">{p.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">পাসওয়ার্ড নির্ধারণ করুন</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={sellerRegisterForm.password}
                      onChange={(e) =>
                        setSellerRegisterForm({ ...sellerRegisterForm, password: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-98 cursor-pointer disabled:opacity-50"
                  >
                    <Sparkles size={15} />
                    <span>{isSubmitting ? "প্রসেসিং..." : "প্রিমিয়াম সেলার একাউন্ট খুলুন"}</span>
                  </button>

                  <p className="text-[10px] text-slate-400 text-center">
                    অ্যাকাউন্ট খোলার সাথে সাথেই আপনি প্রোডাক্ট আপলোড ও অর্ডার ম্যানেজ করার পূর্ণ অ্যাক্সেস পাবেন।
                  </p>
                </form>
              )}

              {/* TAB 2: SELLER & ADMIN LOGIN */}
              {activeTab === "login" && (
                <div className="space-y-4">
                  {/* 1-Click Instant Demo Login Hub */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block">
                      ⚡ ১-ক্লিক ইনস্ট্যান্ট ডেমো লগইন
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleInstantDemoLogin("admin")}
                        className="bg-white hover:bg-amber-50 border border-slate-200 hover:border-amber-400 p-2.5 rounded-xl text-left transition-all cursor-pointer shadow-xs"
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                          <Crown size={14} className="text-amber-500" />
                          <span>Old Rank Admin</span>
                        </div>
                        <span className="text-[9px] text-slate-400 block mt-0.5">মাস্টার অ্যাডমিন কন্ট্রোল</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleInstantDemoLogin("seller")}
                        className="bg-white hover:bg-indigo-50 border border-slate-200 hover:border-indigo-400 p-2.5 rounded-xl text-left transition-all cursor-pointer shadow-xs"
                      >
                        <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                          <Store size={14} className="text-indigo-600" />
                          <span>Gadget King BD</span>
                        </div>
                        <span className="text-[9px] text-slate-400 block mt-0.5">অথোরাইজড সেলার ডেমো</span>
                      </button>
                    </div>
                  </div>

                  {/* Manual Login Form */}
                  <form onSubmit={handleManualLogin} className="space-y-3.5 text-xs">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        মোবাইল নম্বর অথবা ইমেইল
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="01956016119 অথবা seller@gmail.com"
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">পাসওয়ার্ড</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-[#0b0f19] hover:bg-slate-900 text-amber-400 font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Lock size={14} />
                      <span>{isSubmitting ? "প্রবেশ করা হচ্ছে..." : "লগইন করুন"}</span>
                    </button>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
