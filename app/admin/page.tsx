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
  Plus,
  Trash2,
  Edit3,
  Check,
  AlertCircle,
  Eye,
  Sliders,
  BadgeCheck,
  Ban,
  Percent,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { api, fallbackProducts, fallbackVendors } from "@/lib/api";
import { IOrder, IIncompleteOrder, IProduct, IVendor } from "@/lib/types";
import ProductImage from "@/components/product/ProductImage";

// Preset clothing & accessories images for 1-click rapid posting
const PRESET_GALLERY_IMAGES = [
  { label: "Old Rank Official Banner", url: "/images/old-rank-banner.jpg" },
  { label: "Oversized Black T-Shirt", url: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80" },
  { label: "Streetwear Premium Hoodie", url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80" },
  { label: "Vintage Denim Jacket", url: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80" },
  { label: "Slim Fit Stretch Chino", url: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80" },
  { label: "Premium Oxford Cotton Shirt", url: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80" },
  { label: "Luxury Smartwatch Series 9", url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80" },
  { label: "Gaming Desktop Setup", url: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80" },
];

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoggedIn, login, logout } = useAuthStore();

  const [activeTab, setActiveTab] = useState<"overview" | "products" | "sellers" | "orders" | "incomplete" | "settings">("overview");

  // Core Data States
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [incompleteOrders, setIncompleteOrders] = useState<IIncompleteOrder[]>([]);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [vendors, setVendors] = useState<IVendor[]>([]);
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

  // Product Modals & Filters
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");

  // New Product Form State
  const [productForm, setProductForm] = useState({
    name: "",
    shortDescription: "",
    category: "fashion",
    categoryName: "Men's Fashion",
    vendor: "Old Rank Official",
    basePrice: "",
    oldPrice: "",
    stock: "50",
    isHotDeal: true,
    isFeatured: true,
    mainImage: "/images/old-rank-banner.jpg",
    selectedSizes: ["M", "L", "XL"],
    colorName: "Jet Black",
  });

  // Seller Modals & Filters
  const [isAddSellerOpen, setIsAddSellerOpen] = useState(false);
  const [sellerSearch, setSellerSearch] = useState("");
  const [sellerForm, setSellerForm] = useState({
    shopName: "",
    ownerName: "",
    phone: "",
    email: "",
    plan: "Pro" as "Standard" | "Pro" | "VIP",
    isVerified: true,
    address: "Dhaka, Bangladesh",
    description: "",
  });

  // Gateway & Shop Settings State
  const [settings, setSettings] = useState({
    bkashNumber: "01956016119",
    nagadNumber: "01956016119",
    rocketNumber: "01956016119",
    dhakaCharge: 60,
    outsideDhakaCharge: 120,
    freeDeliveryThreshold: 2000,
    announcement: "স্বাগতম Old Rank প্রিমিয়াম ক্লোথিং অ্যান্ড লাইফস্টাইল স্টোরে!",
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [fetchedOrders, fetchedIncomplete, fetchedStats, fetchedProducts, fetchedVendors] = await Promise.all([
        api.getAllOrders(statusFilter, searchQuery),
        api.getIncompleteOrders(),
        api.getAdminStats(),
        api.getProducts(),
        api.getVendors(),
      ]);

      setOrders(fetchedOrders);
      setIncompleteOrders(fetchedIncomplete);
      if (fetchedStats) setStats(fetchedStats);
      setProducts(fetchedProducts);
      setVendors(fetchedVendors);
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

  // Order Handlers
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

  // Product Actions
  const handleCreateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.basePrice) {
      showToast("অনুগ্রহ করে প্রোডাক্টের নাম ও মূল্য লিখুন।");
      return;
    }

    try {
      const base = Number(productForm.basePrice);
      const old = productForm.oldPrice ? Number(productForm.oldPrice) : Math.round(base * 1.25);
      const discount = old > base ? Math.round(((old - base) / old) * 100) : 0;

      const payload = {
        name: productForm.name,
        shortDescription: productForm.shortDescription || productForm.name,
        description: productForm.shortDescription || productForm.name,
        category: {
          _id: `c_${productForm.category}`,
          name: productForm.categoryName,
          slug: productForm.category,
        },
        vendor: {
          _id: `v_${Date.now()}`,
          shopName: productForm.vendor,
          slug: productForm.vendor.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          isVerified: true,
          rating: 5.0,
        },
        mainImage: productForm.mainImage || "/images/old-rank-banner.jpg",
        basePrice: base,
        oldPrice: old,
        discountPercentage: discount,
        sku: `OR-${Math.floor(1000 + Math.random() * 9000)}`,
        stock: Number(productForm.stock) || 50,
        isHotDeal: productForm.isHotDeal,
        isFeatured: productForm.isFeatured,
        rating: 5.0,
        reviewCount: 1,
        variants: productForm.selectedSizes.map((sz) => ({
          colorName: productForm.colorName || "Jet Black",
          sizeName: sz,
          price: base,
          stock: Math.floor((Number(productForm.stock) || 50) / productForm.selectedSizes.length) || 10,
        })),
        tags: ["old-rank", productForm.category, "fashion"],
      };

      const res = await api.createProduct(payload);
      const createdProd = res.data || payload;
      setProducts([createdProd, ...products]);
      setIsAddProductOpen(false);
      showToast(`🎉 "${productForm.name}" সফলভাবে পোস্ট করা হয়েছে!`);

      // Reset form
      setProductForm({
        name: "",
        shortDescription: "",
        category: "fashion",
        categoryName: "Men's Fashion",
        vendor: "Old Rank Official",
        basePrice: "",
        oldPrice: "",
        stock: "50",
        isHotDeal: true,
        isFeatured: true,
        mainImage: "/images/old-rank-banner.jpg",
        selectedSizes: ["M", "L", "XL"],
        colorName: "Jet Black",
      });
    } catch (err: any) {
      showToast("প্রোডাক্ট পোস্ট করা সম্ভব হয়নি।");
    }
  };

  const handleUpdateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;

    try {
      await api.updateProduct(editingProduct._id, editingProduct);
      setProducts(products.map((p) => (p._id === editingProduct._id ? editingProduct : p)));
      setEditingProduct(null);
      showToast(`প্রোডাক্ট "${editingProduct.name}" সফলভাবে আপডেট হয়েছে!`);
    } catch {
      showToast("আপডেট ব্যর্থ হয়েছে।");
    }
  };

  const handleDeleteProduct = async (id: string, name: string) => {
    if (!confirm(`আপনি কি নিশ্চিতভাবে "${name}" প্রোডাক্টটি ডিলিট করতে চান?`)) return;
    try {
      await api.deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
      showToast(`"${name}" প্রোডাক্টটি সফলভাবে মুছে ফেলা হয়েছে।`);
    } catch {
      showToast("ডিলিট করা সম্ভব হয়নি।");
    }
  };

  const handleToggleHotDeal = async (product: IProduct) => {
    const updated = !product.isHotDeal;
    try {
      await api.updateProduct(product._id, { isHotDeal: updated });
      setProducts(products.map((p) => (p._id === product._id ? { ...p, isHotDeal: updated } : p)));
      showToast(`"${product.name}" এর হট ডিল স্ট্যাটাস ${updated ? "সক্রিয়" : "বন্ধ"} করা হয়েছে।`);
    } catch {
      showToast("স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।");
    }
  };

  // Seller Actions
  const handleCreateSellerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerForm.shopName || !sellerForm.phone) {
      showToast("দোকানের নাম ও ফোন নম্বর আবশ্যক।");
      return;
    }

    try {
      const payload = {
        shopName: sellerForm.shopName,
        slug: sellerForm.shopName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        ownerName: sellerForm.ownerName || sellerForm.shopName,
        phone: sellerForm.phone,
        email: sellerForm.email || `${sellerForm.shopName.toLowerCase()}@gmail.com`,
        plan: sellerForm.plan,
        isVerified: sellerForm.isVerified,
        status: "Active" as const,
        address: sellerForm.address,
        description: sellerForm.description || `${sellerForm.shopName} — ভেরিফাইড মার্চেন্ট পার্টনার`,
        rating: 5.0,
        reviewCount: 0,
        totalProducts: 0,
        logo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
        banner: "/images/old-rank-banner.jpg",
      };

      const res = await api.createVendor(payload);
      const createdVendor = res.data || payload;
      setVendors([createdVendor, ...vendors]);
      setIsAddSellerOpen(false);
      showToast(`🏪 সেলার শপ "${sellerForm.shopName}" সফলভাবে তৈরি হয়েছে!`);

      setSellerForm({
        shopName: "",
        ownerName: "",
        phone: "",
        email: "",
        plan: "Pro",
        isVerified: true,
        address: "Dhaka, Bangladesh",
        description: "",
      });
    } catch {
      showToast("সেলার যুক্ত করা সম্ভব হয়নি।");
    }
  };

  const handleToggleVerifySeller = async (vendorId: string, current: boolean, name: string) => {
    try {
      await api.updateVendor(vendorId, { isVerified: !current });
      setVendors(vendors.map((v) => (v._id === vendorId ? { ...v, isVerified: !current } : v)));
      showToast(`"${name}" এর ভেরিফিকেশন স্ট্যাটাস ${!current ? "ভেরিফাইড" : "আনভেরিফাইড"} করা হয়েছে।`);
    } catch {
      showToast("ভেরিফিকেশন আপডেট ব্যর্থ হয়েছে।");
    }
  };

  const handleToggleSellerStatus = async (vendorId: string, currentStatus: string | undefined, name: string) => {
    const nextStatus = currentStatus === "Active" ? "Suspended" : "Active";
    try {
      await api.updateVendor(vendorId, { status: nextStatus });
      setVendors(vendors.map((v) => (v._id === vendorId ? { ...v, status: nextStatus } : v)));
      showToast(`"${name}" এর স্ট্যাটাস '${nextStatus}' করা হয়েছে।`);
    } catch {
      showToast("স্ট্যাটাস আপডেট ব্যর্থ হয়েছে।");
    }
  };

  const handleDeleteSeller = async (vendorId: string, name: string) => {
    if (!confirm(`আপনি কি "${name}" সেলার শপটি মুছে ফেলতে চান?`)) return;
    try {
      await api.deleteVendor(vendorId);
      setVendors(vendors.filter((v) => v._id !== vendorId));
      showToast(`সেলার "${name}" মুছে ফেলা হয়েছে।`);
    } catch {
      showToast("মুছে ফেলা সম্ভব হয়নি।");
    }
  };

  const handleSwitchToAdmin = () => {
    login({
      id: "usr_admin",
      name: "Old Rank Admin",
      phone: "01956016119",
      email: "mdmahfuzulhaque3140@gmail.com",
      role: "admin",
    });
    showToast("অ্যাডমিন মোড সক্রিয় হয়েছে!");
  };

  // Filtered Orders
  const filteredOrders = orders.filter((o) => {
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

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      !productSearch.trim() ||
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(productSearch.toLowerCase());

    const catSlug = typeof p.category === "object" ? p.category.slug : p.category;
    const matchesCat = productCategoryFilter === "all" || catSlug === productCategoryFilter;

    return matchesSearch && matchesCat;
  });

  // Filtered Sellers
  const filteredVendors = vendors.filter((v) => {
    if (!sellerSearch.trim()) return true;
    const q = sellerSearch.toLowerCase();
    return (
      v.shopName.toLowerCase().includes(q) ||
      (v.ownerName && v.ownerName.toLowerCase().includes(q)) ||
      (v.phone && v.phone.includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0f172a] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-amber-400/40 animate-fade-in">
          <CheckCircle2 size={18} className="text-amber-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Top Header Bar */}
      <header className="sticky top-0 z-30 bg-[#0b0f19] text-white border-b border-slate-800 px-4 sm:px-8 py-3.5 shadow-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <img
                src="/images/logo.png"
                alt="Old Rank Logo"
                className="w-10 h-10 rounded-full object-cover ring-2 ring-amber-400/50 shadow-md group-hover:scale-105 transition-transform"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-lg text-white tracking-tight leading-none">
                    Old<span className="text-amber-400">Rank</span>
                  </span>
                  <span className="text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30 px-1.5 py-0.5 rounded">
                    ADMIN
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">পোস্টিং, প্রোডাক্ট, সেলার ও অর্ডার হাব</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-2.5 sm:gap-4">
            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white bg-slate-800 hover:bg-slate-700 py-2 px-3.5 rounded-xl border border-slate-700 transition-colors"
            >
              <span>শপ লাইভ প্রিভিউ</span>
              <ArrowUpRight size={14} className="text-amber-400" />
            </Link>

            <button
              onClick={loadData}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="রিফ্রেশ করুন"
            >
              <RefreshCw size={16} className={isLoading ? "animate-spin text-amber-400" : ""} />
            </button>

            {/* Admin/Seller User Info */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-slate-800">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-black text-xs shadow">
                {user?.role === "seller" ? <Store size={15} /> : <Crown size={15} />}
              </div>
              <div className="hidden md:block text-left">
                <span className="text-xs font-bold text-white block leading-tight truncate max-w-[140px]">
                  {user?.name || "Old Rank Admin"}
                </span>
                <span className="text-[10px] text-amber-300 block leading-tight">
                  {user?.role === "seller" ? "Authorized Seller" : "Headquarters Authority"}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/10 transition-colors ml-1 cursor-pointer"
                title="লগআউট"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Role Banner if Seller */}
      {user?.role === "seller" ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between gap-3 text-amber-950 text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <Store size={18} className="text-amber-700 shrink-0" />
              <span>
                <strong>সেলার পোর্টাল সক্রিয়:</strong> {user.shopName || user.name} (আপনার দোকান ও অর্ডারের পূর্ণ বিবরণ দেখতে পারছেন)
              </span>
            </div>
            <Link href="/login" className="text-amber-800 hover:underline font-bold text-xs shrink-0">
              রোল পরিবর্তন করুন →
            </Link>
          </div>
        </div>
      ) : (!isLoggedIn || user?.role !== "admin") ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900 text-xs shadow-xs">
            <div className="flex items-center gap-2.5">
              <Crown size={20} className="text-amber-600 shrink-0" />
              <span>
                <strong>ডেমো মোড নোটিশ:</strong> আপনি বর্তমানে সরাসরি ভিজিট করেছেন। পূর্ণ কন্ট্রোলের জন্য অ্যাডমিন মোড সক্রিয় করুন।
              </span>
            </div>
            <button
              onClick={handleSwitchToAdmin}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors shrink-0 cursor-pointer"
            >
              <UserCheck size={14} /> ১-ক্লিকে অ্যাডমিন হিসেবে সক্রিয় হন
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
                ? "bg-[#0b0f19] text-amber-400 shadow-md border border-slate-800"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            <LayoutDashboard size={15} />
            <span>ওভারভিউ ও অ্যানালিটিক্স</span>
          </button>

          <button
            onClick={() => setActiveTab("products")}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "products"
                ? "bg-[#0b0f19] text-amber-400 shadow-md border border-slate-800"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            <ShoppingBag size={15} />
            <span>প্রোডাক্ট পোস্ট ও স্টক</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-400/20 text-amber-700 font-extrabold">
              {products.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("sellers")}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "sellers"
                ? "bg-[#0b0f19] text-amber-400 shadow-md border border-slate-800"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            <Store size={15} />
            <span>সেলার ও ভেন্ডর হাব</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-indigo-50 text-indigo-700 font-extrabold">
              {vendors.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "orders"
                ? "bg-[#0b0f19] text-amber-400 shadow-md border border-slate-800"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            <Package size={15} />
            <span>অর্ডারসমূহ</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-50 text-emerald-700 font-extrabold">
              {orders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("incomplete")}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "incomplete"
                ? "bg-[#0b0f19] text-amber-400 shadow-md border border-slate-800"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            <Clock size={15} className="text-rose-500" />
            <span>ইনকমপ্লিট অর্ডার ও লিড</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-50 text-rose-700 font-extrabold">
              {incompleteOrders.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
              activeTab === "settings"
                ? "bg-[#0b0f19] text-amber-400 shadow-md border border-slate-800"
                : "bg-white text-slate-600 hover:text-slate-900 border border-slate-200/80 hover:bg-slate-50"
            }`}
          >
            <Settings size={15} />
            <span>শপ সেটিংস ও চার্জ</span>
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
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
                  <span>+18.4% গ্রোথ</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">মোট অর্ডার</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Package size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{stats.totalOrders} টি</div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-2">
                  <span>ডেলিভারি: {stats.deliveredOrders} টি</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">অ্যাক্টিভ সেলার</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                    <Store size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{vendors.length} টি শপ</div>
                <div className="flex items-center gap-1 text-[11px] text-amber-600 font-bold mt-2">
                  <span>ভেরিফাইড পার্টনার</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">লাইভ প্রোডাক্ট</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <ShoppingBag size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{products.length} টি আইটেম</div>
                <div className="flex items-center gap-1 text-[11px] text-blue-600 font-bold mt-2">
                  <span>স্টক রানিং</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">পরিত্যক্ত কার্ট</span>
                  <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
                    <Flame size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{incompleteOrders.length} টি লিড</div>
                <div className="flex items-center gap-1 text-[11px] text-rose-600 font-bold mt-2">
                  <span>ফলো-আপ করুন</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Bar */}
            <div className="bg-gradient-to-r from-[#0b0f19] to-[#1e293b] rounded-2xl p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg border border-slate-800">
              <div>
                <h3 className="text-base font-black tracking-tight">কুইক অপারেশন ম্যানেজমেন্ট</h3>
                <p className="text-xs text-slate-300 mt-0.5">নতুন পণ্য পোস্ট করুন অথবা নতুন মার্চেন্ট অনবোর্ড করুন</p>
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    setActiveTab("products");
                    setIsAddProductOpen(true);
                  }}
                  className="flex-1 sm:flex-initial bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2.5 px-4 rounded-xl flex items-center justify-center gap-1.5 shadow transition-transform transform active:scale-95 cursor-pointer"
                >
                  <Plus size={15} />
                  <span>নতুন প্রোডাক্ট পোস্ট করুন</span>
                </button>

                <button
                  onClick={() => {
                    setActiveTab("sellers");
                    setIsAddSellerOpen(true);
                  }}
                  className="flex-1 sm:flex-initial bg-white/10 hover:bg-white/20 text-white font-bold text-xs py-2.5 px-4 rounded-xl border border-white/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Store size={15} />
                  <span>নতুন সেলার যুক্ত করুন</span>
                </button>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">সাম্প্রতিক অর্ডারসমূহ</h3>
                  <p className="text-xs text-slate-400">সর্বশেষ গ্রাহকদের ক্রয় সংক্রান্ত তথ্য</p>
                </div>
                <button
                  onClick={() => setActiveTab("orders")}
                  className="text-xs font-bold text-amber-700 hover:underline"
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
                      <th className="py-2.5">পেমেন্ট মেথড</th>
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
                          <span className="font-bold text-slate-700 uppercase block text-[11px]">
                            {ord.paymentMethod === "cod" ? "ক্যাশ অন ডেলিভারি" : ord.paymentMethod}
                          </span>
                        </td>
                        <td className="py-3 font-black text-slate-900">৳ {ord.grandTotal?.toLocaleString()}</td>
                        <td className="py-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                              ord.status === "delivered"
                                ? "bg-emerald-50 text-emerald-700"
                                : ord.status === "confirmed"
                                ? "bg-blue-50 text-blue-700"
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
          </div>
        )}

        {/* TAB 2: PRODUCTS & INVENTORY MANAGEMENT */}
        {activeTab === "products" && (
          <div className="space-y-4">
            {/* Header & Action Bar */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900">প্রোডাক্ট ও ইনভেন্টরি ম্যানেজমেন্ট</h3>
                <p className="text-xs text-slate-400 mt-0.5">নতুন পণ্য পোস্ট করুন, মূল্য, ডিসকাউন্ট ও স্টক নিয়ন্ত্রণ করুন</p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <input
                    type="text"
                    placeholder="নাম বা SKU দিয়ে খুঁজুন..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="py-2 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 focus:ring-2 focus:ring-amber-500"
                >
                  <option value="all">সব ক্যাটাগরি</option>
                  <option value="fashion">Men's Fashion</option>
                  <option value="electronics">Electronics</option>
                  <option value="womens-fashion">Women's Fashion</option>
                  <option value="baby-kids">Baby & Kids</option>
                  <option value="home-appliances">Home & Kitchen</option>
                </select>

                <button
                  onClick={() => setIsAddProductOpen(true)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer shrink-0"
                >
                  <Plus size={15} />
                  <span>নতুন প্রোডাক্ট পোস্ট করুন</span>
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="py-3 px-4">প্রোডাক্ট ও বিবরণ</th>
                      <th className="py-3 px-4">ক্যাটাগরি</th>
                      <th className="py-3 px-4">সেলার শপ</th>
                      <th className="py-3 px-4">মূল্য ও ছাড়</th>
                      <th className="py-3 px-4">স্টক</th>
                      <th className="py-3 px-4 text-center">হট ডিল</th>
                      <th className="py-3 px-4 text-center">অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredProducts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                          কোনো প্রোডাক্ট পাওয়া যায়নি
                        </td>
                      </tr>
                    ) : (
                      filteredProducts.map((p) => (
                        <tr key={p._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                                <ProductImage
                                  src={p.mainImage}
                                  alt={p.name}
                                  className="w-full h-full object-cover"
                                  showText={false}
                                  iconSize={14}
                                />
                              </div>
                              <div className="min-w-0 max-w-xs">
                                <span className="font-bold text-slate-900 truncate block text-xs">{p.name}</span>
                                <span className="text-[10px] text-slate-400 font-mono">SKU: {p.sku}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4 font-semibold text-slate-600">
                            {typeof p.category === "object" ? p.category?.name : p.category}
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-800 block text-xs">
                              {typeof p.vendor === "object" ? p.vendor?.shopName : p.vendor || "Old Rank Official"}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-black text-slate-900 block text-xs">
                              ৳ {p.basePrice?.toLocaleString()}
                            </span>
                            {p.oldPrice && p.oldPrice > p.basePrice && (
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-slate-400 line-through">৳ {p.oldPrice.toLocaleString()}</span>
                                <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1 rounded">
                                  -{p.discountPercentage || Math.round(((p.oldPrice - p.basePrice) / p.oldPrice) * 100)}%
                                </span>
                              </div>
                            )}
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                p.stock > 10
                                  ? "bg-emerald-50 text-emerald-700"
                                  : p.stock > 0
                                  ? "bg-amber-50 text-amber-700"
                                  : "bg-rose-50 text-rose-700"
                              }`}
                            >
                              {p.stock > 0 ? `${p.stock} পিস` : "আউট অব স্টক"}
                            </span>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleHotDeal(p)}
                              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1 ${
                                p.isHotDeal
                                  ? "bg-rose-500 text-white shadow-xs"
                                  : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                              }`}
                              title="হট ডিল টগল করুন"
                            >
                              <Flame size={13} className={p.isHotDeal ? "fill-white" : ""} />
                              <span>{p.isHotDeal ? "Active" : "Off"}</span>
                            </button>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <Link
                                href={`/product/${p.slug}`}
                                target="_blank"
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
                                title="শপে দেখুন"
                              >
                                <Eye size={13} />
                              </Link>
                              <button
                                onClick={() => setEditingProduct(p)}
                                className="p-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 cursor-pointer"
                                title="এডিট করুন"
                              >
                                <Edit3 size={13} />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(p._id, p.name)}
                                className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                                title="মুছে ফেলুন"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: SELLERS / VENDORS MANAGEMENT */}
        {activeTab === "sellers" && (
          <div className="space-y-4">
            {/* Header & Stats */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-black text-slate-900">সেলার ও ভেন্ডর ম্যানেজমেন্ট</h3>
                <p className="text-xs text-slate-400 mt-0.5">সব সেলার মনিটর করুন, ১-ক্লিকে ভেরিফাই ও প্রিমিয়াম অ্যাকাউন্ট অ্যাপ্রুভ করুন</p>
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <input
                    type="text"
                    placeholder="দোকান বা মালিকের নাম খুঁজুন..."
                    value={sellerSearch}
                    onChange={(e) => setSellerSearch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>

                <button
                  onClick={() => setIsAddSellerOpen(true)}
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs py-2 px-4 rounded-xl flex items-center gap-1.5 shadow transition-all cursor-pointer shrink-0"
                >
                  <Plus size={15} />
                  <span>নতুন সেলার যুক্ত করুন</span>
                </button>
              </div>
            </div>

            {/* Sellers Grid / Table */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                      <th className="py-3 px-4">শপের নাম ও ঠিকানা</th>
                      <th className="py-3 px-4">মালিক ও যোগাযোগ</th>
                      <th className="py-3 px-4">প্ল্যান টিয়ার</th>
                      <th className="py-3 px-4">ভেরিফিকেশন</th>
                      <th className="py-3 px-4">অ্যাকাউন্ট স্ট্যাটাস</th>
                      <th className="py-3 px-4 text-center">যোগাযোগ ও অ্যাকশন</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredVendors.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                          কোনো সেলার শপ পাওয়া যায়নি
                        </td>
                      </tr>
                    ) : (
                      filteredVendors.map((v) => (
                        <tr key={v._id} className="hover:bg-slate-50/60 transition-colors">
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={v.logo || "/images/logo.png"}
                                alt={v.shopName}
                                className="w-10 h-10 rounded-xl object-cover border border-slate-200 shrink-0"
                              />
                              <div>
                                <Link
                                  href={`/shop/${v.slug}`}
                                  target="_blank"
                                  className="font-black text-slate-900 hover:text-amber-600 block text-xs flex items-center gap-1"
                                >
                                  <span>{v.shopName}</span>
                                  <ExternalLink size={11} className="text-slate-400" />
                                </Link>
                                <span className="text-[10px] text-slate-400 block truncate max-w-xs">{v.address}</span>
                              </div>
                            </div>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-bold text-slate-800 block text-xs">{v.ownerName || v.shopName}</span>
                            <a
                              href={`tel:${v.phone}`}
                              className="text-amber-800 hover:underline block text-[11px] font-mono mt-0.5"
                            >
                              {v.phone}
                            </a>
                            <span className="text-[10px] text-slate-400 block truncate">{v.email}</span>
                          </td>

                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                v.plan === "VIP"
                                  ? "bg-amber-400 text-slate-950 shadow-xs"
                                  : v.plan === "Pro"
                                  ? "bg-indigo-50 text-indigo-700 border border-indigo-200"
                                  : "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {v.plan === "VIP" ? "👑 VIP MERCHANT" : v.plan === "Pro" ? "⚡ PRO STORE" : "STANDARD"}
                            </span>
                          </td>

                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleVerifySeller(v._id, v.isVerified, v.shopName)}
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                                v.isVerified
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                  : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                              }`}
                              title="ক্লিক করে ভেরিফিকেশন পরিবর্তন করুন"
                            >
                              {v.isVerified ? (
                                <>
                                  <BadgeCheck size={13} className="text-emerald-600" />
                                  <span>ভেরিফাইড</span>
                                </>
                              ) : (
                                <>
                                  <span>পেন্ডিং / আনভেরিফাইড</span>
                                </>
                              )}
                            </button>
                          </td>

                          <td className="py-3 px-4">
                            <button
                              type="button"
                              onClick={() => handleToggleSellerStatus(v._id, v.status, v.shopName)}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                                v.status === "Active" || !v.status
                                  ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                  : "bg-rose-50 text-rose-700 border border-rose-100"
                              }`}
                              title="ক্লিক করে অ্যাক্টিভ বা সাসপেন্ড করুন"
                            >
                              {v.status || "Active"}
                            </button>
                          </td>

                          <td className="py-3 px-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <a
                                href={`https://wa.me/88${v.phone.replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                                  `আসসালামু আলাইকুম ${v.shopName}, Old Rank অ্যাডমিন সেন্টার থেকে যোগাযোগ করা হচ্ছে।`
                                )}`}
                                target="_blank"
                                rel="noreferrer"
                                className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold"
                                title="WhatsApp এ মেসেজ দিন"
                              >
                                <MessageSquare size={13} />
                              </a>
                              <a
                                href={`tel:${v.phone}`}
                                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                                title="সরাসরি কল দিন"
                              >
                                <PhoneCall size={13} />
                              </a>
                              {v.slug !== "old-rank" && (
                                <button
                                  onClick={() => handleDeleteSeller(v._id, v.shopName)}
                                  className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                                  title="সেলার মুছে ফেলুন"
                                >
                                  <Trash2 size={13} />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: ORDERS MANAGEMENT */}
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
                        ? "bg-[#0b0f19] text-amber-400 shadow-xs"
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
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              </form>
            </div>

            {/* Orders Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-400 uppercase text-[10px] font-bold">
                    <th className="py-3 px-4">ইনভয়েস নং</th>
                    <th className="py-3 px-4">গ্রাহকের বিবরণ</th>
                    <th className="py-3 px-4">পণ্যসমূহ</th>
                    <th className="py-3 px-4">পেমেন্ট মেথড</th>
                    <th className="py-3 px-4">সর্বমোট</th>
                    <th className="py-3 px-4">অর্ডার স্ট্যাটাস</th>
                    <th className="py-3 px-4 text-center">ইনভয়েস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                        কোনো অর্ডার পাওয়া যায়নি
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((ord) => (
                      <tr key={ord._id || ord.invoiceId} className="hover:bg-slate-50/60 transition-colors">
                        <td className="py-3.5 px-4">
                          <span className="font-extrabold text-slate-900 block font-mono">{ord.invoiceId}</span>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            {new Date(ord.createdAt).toLocaleDateString("bn-BD")}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <p className="font-bold text-slate-800">{ord.customer?.name}</p>
                          <a
                            href={`tel:${ord.customer?.phone}`}
                            className="text-amber-800 hover:underline font-semibold block text-[11px]"
                          >
                            {ord.customer?.phone}
                          </a>
                          <span className="text-[11px] text-slate-500 block max-w-xs truncate">
                            {ord.customer?.address}, {ord.customer?.district}
                          </span>
                        </td>

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

                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase bg-slate-100 text-slate-800">
                            {ord.paymentMethod === "cod" ? "ক্যাশ অন ডেলিভারি" : ord.paymentMethod}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-black text-slate-900 text-sm">
                          ৳ {ord.grandTotal?.toLocaleString()}
                        </td>

                        <td className="py-3.5 px-4">
                          <select
                            value={ord.status}
                            onChange={(e) => handleStatusChange(ord.invoiceId, e.target.value)}
                            className={`px-2 py-1 rounded-lg text-xs font-bold border focus:outline-none focus:ring-1 cursor-pointer ${
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
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>

                        <td className="py-3.5 px-4 text-center">
                          <button
                            onClick={() => setSelectedInvoice(ord)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer inline-flex items-center gap-1 font-bold text-xs"
                            title="ইনভয়েস দেখুন"
                          >
                            <Printer size={13} />
                            <span>প্রিন্ট</span>
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

        {/* TAB 5: INCOMPLETE ORDERS / ABANDONED LEADS */}
        {activeTab === "incomplete" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-slate-900">ইনকমপ্লিট অর্ডার ও পরিত্যক্ত কার্ট লিড</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  যেসব কাস্টমার চেকআউটে মোবাইল নম্বর দিয়েছিলেন কিন্তু ফাইনাল অর্ডার কনফার্ম করেননি
                </p>
              </div>
              <div className="bg-rose-50 text-rose-700 px-4 py-2 rounded-xl text-xs font-bold border border-rose-100">
                মোট লিড: {incompleteOrders.length} টি
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {incompleteOrders.map((lead) => {
                const waMessage = encodeURIComponent(
                  `আসসালামু আলাইকুম ${lead.name || "গ্রাহক"}, আপনি Old Rank-এ অর্ডার করার চেষ্টা করছিলেন। কোনো সহযোগিতার প্রয়োজন হলে আমাদের জানান। হটলাইন: 01956016119`
                );

                return (
                  <div
                    key={lead._id}
                    className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 hover:border-amber-400 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-slate-900">
                        {lead.name || "নামহীন গ্রাহক"}
                      </span>
                      <span className="text-[10px] bg-rose-50 text-rose-600 font-bold px-2 py-0.5 rounded-full">
                        পরিত্যক্ত কার্ট
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600">
                      <div className="flex justify-between">
                        <span className="text-slate-400">মোবাইল:</span>
                        <a href={`tel:${lead.phone}`} className="font-bold text-amber-800 hover:underline">
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

        {/* TAB 6: SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-2xl bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-slate-900 tracking-tight">পেমেন্ট, ডেলিভারি ও শপ কনফিগারেশন</h3>
              <p className="text-xs text-slate-400 mt-0.5">ক্যাশ অন ডেলিভারি, শিপিং চার্জ ও সাপোর্ট হটলাইন সেটিংস</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 uppercase">
                  অফিশিয়াল সাপোর্ট হটলাইন (Primary Hotline)
                </label>
                <input
                  type="text"
                  value={settings.bkashNumber}
                  onChange={(e) => setSettings({ ...settings, bkashNumber: e.target.value })}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1 uppercase">
                  সেকেন্ডারি হেল্পলাইন (Secondary Line)
                </label>
                <input
                  type="text"
                  value="01301010553"
                  disabled
                  className="w-full px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-mono text-slate-700 cursor-not-allowed"
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
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:ring-2 focus:ring-amber-500"
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
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={() => showToast("সেটিংস সফলভাবে সংরক্ষিত হয়েছে!")}
                className="w-full mt-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 px-4 rounded-xl text-sm transition-all shadow-md cursor-pointer"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL 1: ADD NEW PRODUCT MODAL */}
      {isAddProductOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 my-8 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-amber-400/20 text-amber-700 flex items-center justify-center">
                  <Plus size={18} />
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900">নতুন প্রোডাক্ট পোস্ট করুন</h3>
                  <p className="text-xs text-slate-400">Old Rank শপে তাৎক্ষণিক নতুন পণ্য লাইভ করুন</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddProductOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  প্রোডাক্টের নাম (Product Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Old Rank Heavyweight Drop-Shoulder T-Shirt"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">ক্যাটাগরি (Category)</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => {
                      const selected = e.target.value;
                      const nameMap: Record<string, string> = {
                        fashion: "Men's Fashion",
                        electronics: "Electronics & Gadgets",
                        "womens-fashion": "Women's Fashion",
                        "baby-kids": "Baby & Kids",
                        "home-appliances": "Home & Kitchen",
                        "smart-watch": "Smart Watch",
                      };
                      setProductForm({
                        ...productForm,
                        category: selected,
                        categoryName: nameMap[selected] || "Men's Fashion",
                      });
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="fashion">Men's Fashion (টি-শার্ট, হুডি, শার্ট)</option>
                    <option value="electronics">Electronics & Gadgets</option>
                    <option value="womens-fashion">Women's Fashion</option>
                    <option value="baby-kids">Baby & Kids</option>
                    <option value="home-appliances">Home & Kitchen</option>
                    <option value="smart-watch">Smart Watch</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">সেলার বা ব্র্যান্ড (Vendor)</label>
                  <select
                    value={productForm.vendor}
                    onChange={(e) => setProductForm({ ...productForm, vendor: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  >
                    {vendors.map((v) => (
                      <option key={v._id} value={v.shopName}>
                        {v.shopName} {v.isVerified ? "✓" : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">বিক্রয় মূল্য (Base Price ৳) *</label>
                  <input
                    type="number"
                    required
                    placeholder="990"
                    value={productForm.basePrice}
                    onChange={(e) => setProductForm({ ...productForm, basePrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">পূর্বের মূল্য (Old Price ৳)</label>
                  <input
                    type="number"
                    placeholder="1250"
                    value={productForm.oldPrice}
                    onChange={(e) => setProductForm({ ...productForm, oldPrice: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-700 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">স্টক সংখ্যা (Stock)</label>
                  <input
                    type="number"
                    placeholder="50"
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Quick Image Preset Selector */}
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  প্রোডাক্ট ইমেজ (গ্যালারি থেকে সিলেক্ট করুন অথবা URL দিন)
                </label>
                <div className="grid grid-cols-4 gap-2 mb-2 max-h-32 overflow-y-auto p-1 bg-slate-50 rounded-xl border border-slate-200">
                  {PRESET_GALLERY_IMAGES.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setProductForm({ ...productForm, mainImage: img.url })}
                      className={`relative rounded-lg overflow-hidden border-2 aspect-video transition-all cursor-pointer ${
                        productForm.mainImage === img.url
                          ? "border-amber-500 ring-2 ring-amber-400/40"
                          : "border-transparent opacity-70 hover:opacity-100"
                      }`}
                      title={img.label}
                    >
                      <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  placeholder="ইমেজ URL দিন..."
                  value={productForm.mainImage}
                  onChange={(e) => setProductForm({ ...productForm, mainImage: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 font-mono focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Sizes Selection */}
              <div>
                <label className="block font-bold text-slate-700 mb-1.5">উপলব্ধ সাইজসমূহ (Available Sizes)</label>
                <div className="flex items-center gap-2">
                  {["S", "M", "L", "XL", "XXL"].map((sz) => {
                    const isSelected = productForm.selectedSizes.includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => {
                          const next = isSelected
                            ? productForm.selectedSizes.filter((s) => s !== sz)
                            : [...productForm.selectedSizes, sz];
                          setProductForm({ ...productForm, selectedSizes: next });
                        }}
                        className={`w-9 h-8 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#0b0f19] text-amber-400 border border-amber-400/50"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        {sz}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Toggles */}
              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={productForm.isHotDeal}
                    onChange={(e) => setProductForm({ ...productForm, isHotDeal: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-500"
                  />
                  <span>হট ডিল অফারে দেখান (Hot Deal)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={productForm.isFeatured}
                    onChange={(e) => setProductForm({ ...productForm, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 accent-amber-500"
                  />
                  <span>ফিচার্ড প্রডাক্ট (Featured)</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddProductOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-6 py-2.5 rounded-xl shadow transition-all cursor-pointer"
                >
                  প্রোডাক্ট পোস্ট করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT PRODUCT MODAL */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="font-black text-base text-slate-900">প্রোডাক্ট এডিট করুন</h3>
              <button
                onClick={() => setEditingProduct(null)}
                className="p-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleUpdateProductSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">প্রোডাক্টের নাম</label>
                <input
                  type="text"
                  required
                  value={editingProduct.name}
                  onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-medium text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মূল্য (৳)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.basePrice}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, basePrice: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">স্টক সংখ্যা</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 pt-1">
                  <input
                    type="checkbox"
                    checked={editingProduct.isHotDeal}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, isHotDeal: e.target.checked })
                    }
                    className="w-4 h-4 accent-amber-500"
                  />
                  <span>হট ডিল অফার সক্রিয় রাখুন</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2 rounded-xl shadow cursor-pointer"
                >
                  আপডেট সংরক্ষণ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: ADD NEW SELLER MODAL */}
      {isAddSellerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-amber-400/20 text-amber-700 flex items-center justify-center">
                  <Store size={16} />
                </div>
                <div>
                  <h3 className="font-black text-base text-slate-900">নতুন সেলার যুক্ত করুন</h3>
                  <p className="text-[11px] text-slate-400">Old Rank প্ল্যাটফর্মে নতুন মার্চেন্ট অনবোর্ড করুন</p>
                </div>
              </div>
              <button
                onClick={() => setIsAddSellerOpen(false)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleCreateSellerSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">দোকানের নাম (Shop Name) *</label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Urban Threads BD"
                  value={sellerForm.shopName}
                  onChange={(e) => setSellerForm({ ...sellerForm, shopName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">মালিকের নাম (Owner Name)</label>
                  <input
                    type="text"
                    placeholder="যেমন: তানভীর আহমেদ"
                    value={sellerForm.ownerName}
                    onChange={(e) => setSellerForm({ ...sellerForm, ownerName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">মোবাইল নম্বর *</label>
                  <input
                    type="text"
                    required
                    placeholder="017XXXXXXXX"
                    value={sellerForm.phone}
                    onChange={(e) => setSellerForm({ ...sellerForm, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-mono focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">প্ল্যান টিয়ার (Plan Tier)</label>
                  <select
                    value={sellerForm.plan}
                    onChange={(e) =>
                      setSellerForm({ ...sellerForm, plan: e.target.value as "Standard" | "Pro" | "VIP" })
                    }
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Pro">⚡ PRO STORE</option>
                    <option value="VIP">👑 VIP MERCHANT</option>
                    <option value="Standard">STANDARD STORE</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">ইমেইল (Email)</label>
                  <input
                    type="email"
                    placeholder="merchant@gmail.com"
                    value={sellerForm.email}
                    onChange={(e) => setSellerForm({ ...sellerForm, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">ঠিকানা (Business Address)</label>
                <input
                  type="text"
                  placeholder="যেমন: মিরপুর ১০, ঢাকা"
                  value={sellerForm.address}
                  onChange={(e) => setSellerForm({ ...sellerForm, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800 pt-1">
                <input
                  type="checkbox"
                  checked={sellerForm.isVerified}
                  onChange={(e) => setSellerForm({ ...sellerForm, isVerified: e.target.checked })}
                  className="w-4 h-4 accent-amber-500"
                />
                <span>তাৎক্ষণিক ভেরিফাইড ব্যাজ প্রদান করুন (Verified Merchant)</span>
              </label>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddSellerOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 font-bold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black px-5 py-2.5 rounded-xl shadow cursor-pointer"
                >
                  সেলার যুক্ত করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: INVOICE PRINT MODAL */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 animate-scaleUp">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2.5">
                <img src="/images/logo.png" alt="Old Rank Logo" className="w-9 h-9 rounded-full object-cover" />
                <div>
                  <span className="font-extrabold text-xl text-slate-900 block leading-tight">Old Rank ইনভয়েস</span>
                  <span className="text-xs font-mono text-amber-700 block font-bold">{selectedInvoice.invoiceId}</span>
                </div>
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

              <div className="divide-y divide-slate-100 max-h-48 overflow-y-auto">
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
                  <span>সর্বমোট প্রদেয় (ক্যাশ অন ডেলিভারি)</span>
                  <span className="text-amber-800">৳ {selectedInvoice.grandTotal?.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => window.print()}
                className="flex-1 bg-[#0b0f19] text-amber-400 hover:bg-slate-900 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow"
              >
                <Printer size={14} /> প্রিন্ট ইনভয়েস
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
