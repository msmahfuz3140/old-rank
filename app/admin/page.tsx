"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  TrendingUp,
  DollarSign,
  Search,
  ExternalLink,
  MessageSquare,
  PhoneCall,
  Crown,
  LogOut,
  RefreshCw,
  ShieldCheck,
  CreditCard,
  Settings,
  ShoppingBag,
  ArrowUpRight,
  Printer,
  X,
  Flame,
  UserCheck,
  Store,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { api, fallbackProducts } from "@/lib/api";
import { IOrder, IIncompleteOrder, IProduct } from "@/lib/types";
import ProductImage from "@/components/product/ProductImage";

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoggedIn, login, logout } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "incomplete" | "products" | "settings">("overview");

  // State
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [incompleteOrders, setIncompleteOrders] = useState<IIncompleteOrder[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 48909,
    totalOrders: 5,
    pendingOrders: 1,
    confirmedOrders: 1,
    deliveredOrders: 2,
    incompleteCount: 3,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<IOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Gateway Settings State
  const [settings, setSettings] = useState({
    bkashNumber: "01849832178",
    nagadNumber: "01849832178",
    rocketNumber: "01849832178",
    dhakaCharge: 60,
    outsideDhakaCharge: 120,
    freeDeliveryThreshold: 2000,
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedOrders, fetchedIncomplete, fetchedStats, fetchedProducts] = await Promise.all([
        api.getAllOrders(statusFilter, searchQuery),
        api.getIncompleteOrders(),
        api.getAdminStats(),
        api.getProducts(),
      ]);

      setOrders(fetchedOrders);
      setIncompleteOrders(fetchedIncomplete);
      if (fetchedStats) setStats(fetchedStats);
      setProducts(fetchedProducts);
    } catch (e) {
      console.warn("Failed loading admin data:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [statusFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadData();
  };

  const handleStatusChange = async (invoiceId: string, newStatus: string) => {
    try {
      await api.updateOrderStatus(invoiceId, newStatus);
      setOrders((prev) =>
        prev.map((ord) => (ord.invoiceId === invoiceId ? { ...ord, status: newStatus as any } : ord))
      );
      showToast(`অর্ডার ${invoiceId} এর স্ট্যাটাস '${newStatus}' এ পরিবর্তন করা হয়েছে।`);
    } catch {
      showToast("স্ট্যাটাস পরিবর্তন করা সম্ভব হয়নি।");
    }
  };

  const handleVerifyPayment = async (invoiceId: string) => {
    try {
      await api.updatePaymentStatus(invoiceId, "paid");
      setOrders((prev) =>
        prev.map((ord) =>
          ord.invoiceId === invoiceId
            ? { ...ord, paymentStatus: "paid", status: ord.status === "pending" ? "confirmed" : ord.status }
            : ord
        )
      );
      showToast(`ইনভয়েস ${invoiceId} এর TrxID সফলভাবে ভেরিফাই করা হয়েছে!`);
    } catch {
      showToast("ভেরিফিকেশন সম্পন্ন হয়নি।");
    }
  };

  const handleSwitchToAdmin = () => {
    login({
      id: "usr_admin",
      name: "ShopGenie Admin",
      phone: "01849832178",
      email: "admin@shopgenie.com",
      role: "admin",
    });
    showToast("অ্যাডমিন মোড সক্রিয় হয়েছে!");
  };

  const filteredOrders = orders.filter((o) => {
    if (statusFilter !== "all" && o.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.invoiceId.toLowerCase().includes(q) ||
        o.customer?.phone?.includes(q) ||
        o.customer?.name?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-slate-700 animate-fadeIn">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-8 py-3 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="w-9 h-9 rounded-xl bg-[#303d6e] text-white flex items-center justify-center font-black text-base shadow-sm">
              SG
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-black text-slate-900 tracking-tight leading-none">
                  ShopGenie <span className="text-[#303d6e]">Admin Center</span>
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  লাইভ সার্ভার
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">অর্ডার, পেমেন্ট ও সেলস ম্যানেজমেন্ট</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-700 hover:text-[#303d6e] bg-slate-100 hover:bg-slate-200 py-2 px-3 rounded-xl transition-colors"
            >
              <span>শপ প্রিভিউ</span>
              <ArrowUpRight size={14} />
            </Link>

            <button
              onClick={loadData}
              className="p-2 rounded-xl text-slate-600 hover:text-[#303d6e] hover:bg-slate-100 transition-colors cursor-pointer"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin text-[#303d6e]" : ""} />
            </button>

            {/* Admin/Seller User Info */}
            <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-700 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                {user?.role === "seller" ? <Store size={15} /> : <Crown size={15} />}
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold text-slate-900 block leading-tight truncate max-w-[130px]">
                  {user?.name || "সিস্টেম অ্যাডমিন"}
                </span>
                <span className="text-[10px] text-slate-400 block leading-tight">
                  {user?.role === "seller" ? "Authorized Seller" : "Super Admin"}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors ml-1 cursor-pointer"
                title="লগআউট"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Role Banner */}
      {user?.role === "seller" ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-4">
          <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3.5 flex items-center justify-between gap-3 text-indigo-950 text-xs">
            <div className="flex items-center gap-2">
              <Store size={18} className="text-[#303d6e] shrink-0" />
              <span>
                <strong>সেলার মোডে অ্যাক্টিভ আছেন:</strong> {user.shopName || user.name} (আপনার দোকান ও অর্ডারের পূর্ণ বিবরণ দেখতে পারছেন)
              </span>
            </div>
            <Link
              href="/login"
              className="text-[#303d6e] hover:underline font-bold text-xs shrink-0"
            >
              রোল পরিবর্তন করুন →
            </Link>
          </div>
        </div>
      ) : (!isLoggedIn || user?.role !== "admin") ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900 text-xs">
            <div className="flex items-center gap-2.5">
              <Crown size={20} className="text-amber-600 shrink-0" />
              <span>
                <strong>ডেমো মোড নোটিশ:</strong> আপনি বর্তমানে অ্যাডমিন হিসেবে অথেন্টিকেটেড নন। সম্পূর্ণ অ্যাক্সেসের জন্য অ্যাডমিন মোড অন করুন।
              </span>
            </div>
            <button
              onClick={handleSwitchToAdmin}
              className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors shrink-0 cursor-pointer"
            >
              <UserCheck size={14} /> ১-ক্লিকে অ্যাডমিন হিসেবে লগইন করুন
            </button>
          </div>
        </div>
      ) : null}


      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 border-b border-slate-200 no-scrollbar">
          <button
            onClick={() => setActiveTab("overview")}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "overview"
                ? "bg-[#303d6e] text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard size={15} />
            <span>ওভারভিউ ও অ্যানালিটিক্স</span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "orders"
                ? "bg-[#303d6e] text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            <Package size={15} />
            <span>অর্ডারসমূহ</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-50 text-[#303d6e] font-extrabold">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("incomplete")}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "incomplete"
                ? "bg-[#303d6e] text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            <Clock size={15} className="text-amber-500" />
            <span>ইনকমপ্লিট অর্ডার ও লিড</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-800 font-extrabold">
              {incompleteOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "products"
                ? "bg-[#303d6e] text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            <ShoppingBag size={15} />
            <span>পণ্য ও স্টক</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "settings"
                ? "bg-[#303d6e] text-white shadow-sm"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            <Settings size={15} />
            <span>পেমেন্ট ও শপ সেটিংস</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">মোট বিক্রয়</span>
                  <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                    <DollarSign size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">৳ {stats.totalRevenue.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-600 font-bold mt-2">
                  <TrendingUp size={13} />
                  <span>+18.4% গত সপ্তাহের চেয়ে বৃদ্ধি</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">মোট অর্ডার</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-[#303d6e] flex items-center justify-center">
                    <Package size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{stats.totalOrders} টি</div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-2">
                  <span>ডেলিভারি সম্পন্ন: {stats.deliveredOrders} টি</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">পেন্ডিং অর্ডার</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Clock size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{stats.pendingOrders} টি</div>
                <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-2">
                  <span>ভেরিফিকেশন আবশ্যক</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">পরিত্যক্ত কার্ট লিড</span>
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Flame size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{incompleteOrders.length} টি</div>
                <div className="flex items-center gap-1 text-[11px] text-rose-600 font-bold mt-2">
                  <span>WhatsApp এ ফলো-আপ করুন</span>
                </div>
              </div>
            </div>

            {/* Quick Actions and Recent Orders */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Recent Orders Overview */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">সাম্প্রতিক অর্ডারসমূহ</h3>
                    <p className="text-xs text-slate-400">সর্বশেষ গ্রাহকদের ক্রয় সংক্রান্ত তথ্য</p>
                  </div>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className="text-xs font-bold text-[#303d6e] hover:underline"
                  >
                    সব দেখুন ({orders.length}) →
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-100 text-slate-400 uppercase text-[10px] font-bold">
                        <th className="py-2.5">ইনভয়েস</th>
                        <th className="py-2.5">গ্রাহক</th>
                        <th className="py-2.5">পেমেন্ট</th>
                        <th className="py-2.5">মোট মূল্য</th>
                        <th className="py-2.5">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {orders.slice(0, 5).map((ord) => (
                        <tr key={ord._id || ord.invoiceId} className="hover:bg-slate-50/60">
                          <td className="py-3 font-bold text-slate-900">{ord.invoiceId}</td>
                          <td className="py-3">
                            <span className="font-semibold block text-slate-800">{ord.customer?.name}</span>
                            <span className="text-[11px] text-slate-400">{ord.customer?.phone}</span>
                          </td>
                          <td className="py-3">
                            <span className="capitalize font-medium text-slate-700 block">
                              {ord.paymentMethod.replace("_", " ")}
                            </span>
                            {ord.manualPaymentDetails?.trxId && (
                              <span className="text-[10px] font-mono text-indigo-600 bg-indigo-50 px-1 rounded">
                                Trx: {ord.manualPaymentDetails.trxId}
                              </span>
                            )}
                          </td>
                          <td className="py-3 font-black text-slate-900">৳ {ord.grandTotal?.toLocaleString()}</td>
                          <td className="py-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                                ord.status === "delivered"
                                  ? "bg-emerald-50 text-emerald-700"
                                  : ord.status === "confirmed"
                                  ? "bg-blue-50 text-blue-700"
                                  : ord.status === "shipped"
                                  ? "bg-purple-50 text-purple-700"
                                  : "bg-amber-50 text-amber-700"
                              }`}
                            >
                              {ord.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Conversion Booster / WhatsApp Lead Box */}
              <div className="bg-gradient-to-br from-[#303d6e] to-indigo-900 rounded-2xl p-6 text-white shadow-md flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold bg-white/10 text-amber-300 mb-3 border border-white/10">
                    <Flame size={13} /> হাই কনভার্সন সিস্টেম
                  </div>
                  <h3 className="text-lg font-black tracking-tight">পরিত্যক্ত কার্ট রিকভারি</h3>
                  <p className="text-xs text-indigo-100/80 mt-2 leading-relaxed">
                    যেসব গ্রাহক চেকআউটে নম্বর দিয়ে অর্ডার ড্রপ করেছেন, তাদের ১-ক্লিক WhatsApp মেসেজ পাঠিয়ে অর্ডার কনফার্ম করান।
                  </p>

                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3.5 mt-4 border border-white/10">
                    <span className="text-[10px] uppercase font-bold text-indigo-200 block">অপেক্ষমান হট লিড</span>
                    <span className="text-2xl font-black text-white block mt-0.5">{incompleteOrders.length} জন</span>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab("incomplete")}
                  className="w-full mt-5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer"
                >
                  <MessageSquare size={16} />
                  <span>লিড ফলো-আপ ও চ্যাট শুরু করুন</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: ORDERS MANAGEMENT */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Filter and Search Bar */}
            <div className="p-4 sm:p-5 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              {/* Status Tabs */}
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                {["all", "pending", "confirmed", "shipped", "delivered"].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`py-1.5 px-3 rounded-lg text-xs font-bold uppercase transition-colors cursor-pointer ${
                      statusFilter === st
                        ? "bg-[#303d6e] text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {st === "all" ? "সবগুলো" : st}
                  </button>
                ))}
              </div>

              {/* Search Form */}
              <form onSubmit={handleSearch} className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="ইনভয়েস, মোবাইল বা নাম খুঁজুন..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#303d6e]"
                />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </form>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="py-3 px-4">ইনভয়েস নং</th>
                    <th className="py-3 px-4">গ্রাহকের বিবরণ</th>
                    <th className="py-3 px-4">পণ্যসমূহ</th>
                    <th className="py-3 px-4">পেমেন্ট গেটওয়ে ও TrxID</th>
                    <th className="py-3 px-4">সর্বমোট</th>
                    <th className="py-3 px-4">অর্ডার স্ট্যাটাস</th>
                    <th className="py-3 px-4 text-center">অ্যাকশন</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400">
                        কোনো অর্ডার পাওয়া যায়নি
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord._id || ord.invoiceId} className="hover:bg-slate-50/60 transition-colors">
                        {/* Invoice */}
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-slate-900 block">{ord.invoiceId}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {new Date(ord.createdAt).toLocaleDateString("bn-BD")}
                          </span>
                        </td>

                        {/* Customer */}
                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-800">{ord.customer?.name}</p>
                          <a
                            href={`tel:${ord.customer?.phone}`}
                            className="text-[#303d6e] hover:underline font-semibold block text-[11px]"
                          >
                            {ord.customer?.phone}
                          </a>
                          <span className="text-[11px] text-slate-500 block max-w-xs truncate">
                            {ord.customer?.address}, {ord.customer?.district}
                          </span>
                        </td>

                        {/* Items */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1 max-w-[200px]">
                            {ord.items?.map((item, idx) => (
                              <div key={idx} className="text-[11px] text-slate-700 flex justify-between gap-2">
                                <span className="truncate">{item.name}</span>
                                <span className="font-bold shrink-0 text-slate-900">×{item.quantity}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Payment with TrxID */}
                        <td className="py-3.5 px-4">
                          <div className="space-y-1">
                            <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700">
                              {ord.paymentMethod.replace("_", " ")}
                            </span>

                            {ord.manualPaymentDetails?.trxId && (
                              <div className="p-1.5 bg-amber-50 rounded border border-amber-200/80 text-[10px]">
                                <span className="text-amber-800 font-bold block">
                                  Trx: <code className="font-mono">{ord.manualPaymentDetails.trxId}</code>
                                </span>
                                {ord.manualPaymentDetails.senderNumber && (
                                  <span className="text-slate-500 block">
                                    নম্বর: {ord.manualPaymentDetails.senderNumber}
                                  </span>
                                )}
                              </div>
                            )}

                            <div>
                              {ord.paymentStatus === "paid" ? (
                                <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                                  <CheckCircle2 size={12} /> পেমেন্ট ভেরিফাইড
                                </span>
                              ) : ord.manualPaymentDetails?.trxId ? (
                                <button
                                  type="button"
                                  onClick={() => handleVerifyPayment(ord.invoiceId)}
                                  className="text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-2 py-0.5 rounded shadow-xs cursor-pointer"
                                >
                                  ✓ TrxID কনফার্ম করুন
                                </button>
                              ) : (
                                <span className="text-[10px] text-amber-600 font-bold">ক্যাশ অন ডেলিভারি</span>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Grand Total */}
                        <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                          ৳ {ord.grandTotal?.toLocaleString()}
                        </td>

                        {/* Order Status Selector */}
                        <td className="py-3.5 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.invoiceId, e.target.value)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase border focus:outline-none cursor-pointer ${
                              ord.status === "delivered"
                                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                                : ord.status === "confirmed"
                                ? "bg-blue-50 text-blue-700 border-blue-200"
                                : ord.status === "shipped"
                                ? "bg-purple-50 text-purple-700 border-purple-200"
                                : "bg-amber-50 text-amber-700 border-amber-200"
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        {/* Action buttons */}
                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setSelectedInvoice(ord)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors inline-flex items-center gap-1 text-[11px] font-semibold cursor-pointer"
                            title="ইনভয়েস প্রিন্ট"
                          >
                            <Printer size={13} />
                            <span>রসিদ</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: INCOMPLETE ORDERS / DROPPED LEADS */}
        {activeTab === "incomplete" && (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                  অসম্পূর্ণ অর্ডার ও ড্রপ-অফ লিড
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  যেসব কাস্টমার চেকআউট ফর্মে মোবাইল নম্বর লিখেছিলেন কিন্তু ফাইনাল অর্ডার প্লেস করেননি
                </p>
              </div>
              <div className="bg-indigo-50 text-[#303d6e] px-4 py-2 rounded-xl text-xs font-bold border border-indigo-100">
                মোট লিড: {incompleteOrders.length} টি
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {incompleteOrders.map((lead) => {
                const waMessage = encodeURIComponent(
                  `আসসালামু আলাইকুম ${lead.name || "গ্রাহক"}, আপনি Shop Genie-তে অর্ডার করার চেষ্টা করছিলেন। অর্ডার সংক্রান্ত কোনো সহযোগিতার প্রয়োজন হলে আমাদের জানান। আমাদের ওয়েবসাইট: https://shopgenie.com`
                );

                return (
                  <div
                    key={lead._id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 hover:border-indigo-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        {lead.name || "নামহীন লিড"}
                      </span>
                      <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded-full">
                        পরিত্যক্ত কার্ট
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-400">মোবাইল:</span>
                        <a href={`tel:${lead.phone}`} className="font-bold text-[#303d6e] hover:underline">
                          {lead.phone}
                        </a>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">ঠিকানা:</span>
                        <span className="font-medium text-slate-700 truncate max-w-[150px]">
                          {lead.address || "দেওয়া হয়নি"}, {lead.district || ""}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">কার্ট ভ্যালু:</span>
                        <span className="font-extrabold text-slate-900">
                          ৳ {lead.subtotal?.toLocaleString() || "0"}
                        </span>
                      </div>
                    </div>

                    {lead.items && lead.items.length > 0 && (
                      <div className="p-2.5 bg-slate-50 rounded-xl text-[11px] text-slate-600 border border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">কার্ট পণ্য:</span>
                        {lead.items.map((i, idx) => (
                          <div key={idx} className="truncate">
                            • {i.name} (৳{i.price})
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Instant Conversion Action Buttons */}
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <a
                        href={`https://wa.me/88${lead.phone.replace(/[^0-9]/g, "")}?text=${waMessage}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                      >
                        <MessageSquare size={13} />
                        <span>WhatsApp</span>
                      </a>

                      <a
                        href={`tel:${lead.phone}`}
                        className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2 px-3 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <PhoneCall size={13} />
                        <span>সরাসরি কল</span>
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 4: PRODUCTS & INVENTORY */}
        {activeTab === "products" && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">প্রোডাক্ট ও স্টক লিস্ট</h3>
                <p className="text-xs text-slate-400">দোকানের সকল সক্রিয় ও হট ডিল পণ্যসমূহ</p>
              </div>
              <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-full">
                মোট পণ্য: {products.length} টি
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="py-3 px-4">প্রোডাক্ট</th>
                    <th className="py-3 px-4">ক্যাটাগরি</th>
                    <th className="py-3 px-4">মূল্য</th>
                    <th className="py-3 px-4">স্টক</th>
                    <th className="py-3 px-4">হট ডিল</th>
                    <th className="py-3 px-4 text-center">ভিউ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {products.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/60">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg overflow-hidden border border-slate-100 shrink-0 bg-white">
                            <ProductImage
                              src={p.mainImage}
                              alt={p.name}
                              className="w-full h-full object-cover"
                              showText={false}
                              iconSize={14}
                            />
                          </div>
                          <div className="min-w-0 max-w-sm">
                            <span className="font-bold text-slate-900 truncate block">{p.name}</span>
                            <span className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-semibold text-slate-600">
                        {typeof p.category === "object" ? p.category?.name : p.category}
                      </td>

                      <td className="py-3 px-4 font-black text-slate-900">
                        ৳ {p.basePrice?.toLocaleString()}
                        {p.oldPrice && (
                          <span className="text-[10px] text-slate-400 line-through ml-1.5 font-normal">
                            ৳ {p.oldPrice.toLocaleString()}
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {p.stock} পিস
                        </span>
                      </td>

                      <td className="py-3 px-4">
                        {p.isHotDeal ? (
                          <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full flex items-center gap-1 w-max">
                            <Flame size={12} /> Hot Deal
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-400">Regular</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <Link
                          href={`/product/${p.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 inline-flex items-center gap-1 font-semibold"
                        >
                          <ExternalLink size={13} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: GATEWAY & SHOP SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-2xl bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">পেমেন্ট গেটওয়ে ও ডেলিভারি কনফিগারেশন</h3>
              <p className="text-xs text-slate-400 mt-0.5">ম্যানুয়াল বিকাশ, নগদ ও রকেট একাউন্ট নম্বর পরিবর্তন করুন</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 uppercase">
                  ম্যানুয়াল বিকাশ পার্সোনাল নম্বর (Personal bKash)
                </label>
                <input
                  type="text"
                  value={settings.bkashNumber}
                  onChange={(e) => setSettings({ ...settings, bkashNumber: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:ring-2 focus:ring-[#303d6e]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 uppercase">
                  ম্যানুয়াল নগদ নম্বর (Nagad Number)
                </label>
                <input
                  type="text"
                  value={settings.nagadNumber}
                  onChange={(e) => setSettings({ ...settings, nagadNumber: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:ring-2 focus:ring-[#303d6e]"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 uppercase">
                  ম্যানুয়াল রকেট নম্বর (Rocket Number)
                </label>
                <input
                  type="text"
                  value={settings.rocketNumber}
                  onChange={(e) => setSettings({ ...settings, rocketNumber: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:ring-2 focus:ring-[#303d6e]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 uppercase">
                    ঢাকার ভিতরে ডেলিভারি চার্জ (৳)
                  </label>
                  <input
                    type="number"
                    value={settings.dhakaCharge}
                    onChange={(e) => setSettings({ ...settings, dhakaCharge: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:ring-2 focus:ring-[#303d6e]"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1 uppercase">
                    ঢাকার বাইরে ডেলিভারি চার্জ (৳)
                  </label>
                  <input
                    type="number"
                    value={settings.outsideDhakaCharge}
                    onChange={(e) => setSettings({ ...settings, outsideDhakaCharge: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:ring-2 focus:ring-[#303d6e]"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast("সেটিংস সফলভাবে সংরক্ষিত হয়েছে!")}
                className="w-full mt-4 bg-[#303d6e] hover:bg-indigo-950 text-white font-bold py-3 px-4 rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Print Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="font-extrabold text-xl text-slate-900">অর্ডার ইনভয়েস</span>
                <span className="text-xs font-mono text-[#303d6e] block font-bold">{selectedInvoice.invoiceId}</span>
              </div>
              <button
                onClick={() => setSelectedInvoice(null)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-700">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <p className="font-bold text-slate-900">{selectedInvoice.customer?.name}</p>
                <p>মোবাইল: {selectedInvoice.customer?.phone}</p>
                <p>ঠিকানা: {selectedInvoice.customer?.address}, {selectedInvoice.customer?.district}</p>
              </div>

              <div className="divide-y divide-slate-100">
                {selectedInvoice.items?.map((item, idx) => (
                  <div key={idx} className="py-2 flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span className="font-bold">৳ {(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-2 space-y-1">
                <div className="flex justify-between text-slate-500">
                  <span>সাবটোটাল</span>
                  <span>৳ {selectedInvoice.subtotal?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>ডেলিভারি চার্জ</span>
                  <span>৳ {selectedInvoice.deliveryCharge?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-1">
                  <span>সর্বমোট প্রদেয়</span>
                  <span className="text-[#303d6e]">৳ {selectedInvoice.grandTotal?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  window.print();
                }}
                className="flex-1 bg-[#303d6e] text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Printer size={14} /> প্রিন্ট করুন
              </button>
              <button
                type="button"
                onClick={() => setSelectedInvoice(null)}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
