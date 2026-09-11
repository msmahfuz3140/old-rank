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
  UploadCloud,
  Sparkles,
  Timer,
  Zap,
  Menu,
  ChevronLeft,
  ChevronRight,
  Bell,
  Mail,
  Home,
} from "lucide-react";
import { useAuthStore } from "@/lib/store";
import { api, fallbackProducts, fallbackVendors } from "@/lib/api";
import { IOrder, IIncompleteOrder, IProduct, IVendor } from "@/lib/types";
import ProductImage from "@/components/product/ProductImage";
import {
  SalesBarChart,
  StackedBarChart,
  DonutWheelChart,
  CleanPieChart,
} from "@/components/admin/AnnexCharts";

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

export type AdminTab =
  | "overview"
  | "products"
  | "sellers"
  | "orders"
  | "incomplete"
  | "hotoffer"
  | "settings";

interface NavItem {
  id: AdminTab;
  label: string;
  subtitle: string;
  icon: any;
  badge?: string | number;
  badgeColor?: string;
  isHot?: boolean;
}

interface NavSection {
  group: string;
  items: NavItem[];
}

export default function AdminPage() {
  const router = useRouter();
  const { user, isLoggedIn, login, logout } = useAuthStore();

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Hot Deal / Timer Settings State
  const [hotDealConfig, setHotDealConfig] = useState({
    isOfferActive: true,
    offerTitle: "হট ডিল কালেকশন",
    offerSubtitle: "সবচেয়ে বেশি বিক্রিত পণ্যগুলোতে বিশাল ডিসকাউন্ট অফার",
    offerEndTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString().slice(0, 16),
    discountBadge: "সীমিত স্টক",
  });
  const [isSavingHotDeal, setIsSavingHotDeal] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState("");

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

      // Fetch Hot Deal / Timer settings
      try {
        const hd = await api.getHotDealSettings();
        if (hd) {
          let timeFormatted = hd.offerEndTime;
          try {
            const d = new Date(hd.offerEndTime);
            if (!isNaN(d.getTime())) {
              // Convert to local YYYY-MM-DDTHH:mm
              const offsetMs = d.getTimezoneOffset() * 60000;
              timeFormatted = new Date(d.getTime() - offsetMs).toISOString().slice(0, 16);
            }
          } catch {}
          setHotDealConfig({
            ...hd,
            offerEndTime: timeFormatted,
          });
        }
      } catch {}
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

  // Hot Deal / Timer Management Handlers
  const handleSaveHotDeal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSavingHotDeal(true);
    try {
      const payload = {
        ...hotDealConfig,
        offerEndTime: new Date(hotDealConfig.offerEndTime).toISOString(),
      };
      await api.updateHotDealSettings(payload);
      showToast("🔥 হট অফার ও টাইমার সেটিংস সফলভাবে সেভ হয়েছে!");
    } catch (err: any) {
      showToast("হট অফার সেভ করা সম্ভব হয়নি: " + err.message);
    } finally {
      setIsSavingHotDeal(false);
    }
  };

  const handleToggleGlobalHotOffer = async (active: boolean) => {
    const updated = { ...hotDealConfig, isOfferActive: active };
    setHotDealConfig(updated);
    try {
      await api.updateHotDealSettings({
        ...updated,
        offerEndTime: new Date(updated.offerEndTime).toISOString(),
      });
      showToast(
        active
          ? "🔥 হট অফার সক্রিয় করা হয়েছে (Live Countdown Ticker)!"
          : "⏳ অফার সাময়িক বন্ধ রাখা হয়েছে (Offer Coming Soon মোড)!"
      );
    } catch (err: any) {
      showToast("আপডেট ব্যর্থ হয়েছে: " + err.message);
    }
  };

  const handleApplyPresetTime = (hoursFromNow: number) => {
    const target = new Date(Date.now() + hoursFromNow * 3600 * 1000);
    const offsetMs = target.getTimezoneOffset() * 60000;
    const timeStr = new Date(target.getTime() - offsetMs).toISOString().slice(0, 16);
    setHotDealConfig((prev) => ({ ...prev, offerEndTime: timeStr }));
    showToast(
      `⏱️ অফারের সময় ${
        hoursFromNow >= 24 ? `${Math.round(hoursFromNow / 24)} দিন` : `${hoursFromNow} ঘণ্টা`
      } নির্ধারণ করা হয়েছে!`
    );
  };

  // Cloudinary Image / PDF Upload Handler
  const handleCloudinaryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingImage(true);
    setUploadSuccessMessage("");
    try {
      const res = await api.uploadFile(file);
      if (res.success && res.url) {
        setProductForm((prev) => ({ ...prev, mainImage: res.url }));
        setUploadSuccessMessage(`✅ ক্লাউডিনারিতে আপলোড সফল! (${file.name})`);
        showToast("🎉 ছবি সফলভাবে ক্লাউডিনারিতে আপলোড হয়েছে!");
      } else {
        showToast(res.message || "আপলোড ব্যর্থ হয়েছে।");
      }
    } catch (err: any) {
      showToast("আপলোডে ত্রুটি: " + err.message);
    } finally {
      setIsUploadingImage(false);
    }
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

  // Sidebar Navigation Sections Configuration (Annex Theme)
  const navSections: NavSection[] = [
    {
      group: "MAIN",
      items: [
        {
          id: "overview" as const,
          label: "ড্যাশবোর্ড ও চার্টস",
          subtitle: "Chartist Analytics & KPIs",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      group: "CATALOG & PRODUCTS",
      items: [
        {
          id: "products" as const,
          label: "প্রোডাক্ট পোস্ট ও স্টক",
          subtitle: "পণ্য ম্যানেজ ও ইনভেন্টরি",
          icon: ShoppingBag,
          badge: products.length,
          badgeColor: "bg-blue-50 text-[#5064df] font-bold border border-blue-200/60",
        },
        {
          id: "sellers" as const,
          label: "সেলার ও ভেন্ডর হাব",
          subtitle: "ভেন্ডর একাউন্ট ও পারমিশন",
          icon: Store,
          badge: vendors.length,
          badgeColor: "bg-indigo-50 text-indigo-700 font-bold border border-indigo-200/60",
        },
        {
          id: "hotoffer" as const,
          label: "হট অফার ও টাইমার",
          subtitle: "লাইভ সেল ও কাউন্টডাউন",
          icon: Flame,
          badge: hotDealConfig.isOfferActive ? "LIVE" : "SOON",
          badgeColor: hotDealConfig.isOfferActive
            ? "bg-red-500 text-white font-bold animate-pulse shadow-xs"
            : "bg-slate-100 text-slate-600 font-medium border border-slate-200",
          isHot: true,
        },
      ],
    },
    {
      group: "ORDERS & PIPELINE",
      items: [
        {
          id: "orders" as const,
          label: "সকল কাস্টমার অর্ডার",
          subtitle: "শিপিং ও পেমেন্ট স্ট্যাটাস",
          icon: Package,
          badge: orders.length,
          badgeColor: "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60",
        },
        {
          id: "incomplete" as const,
          label: "ইনকমপ্লিট অর্ডার লিড",
          subtitle: "ড্রপ-অফ ও ফোন ফলোআপ",
          icon: Clock,
          badge: incompleteOrders.length,
          badgeColor: "bg-rose-50 text-rose-700 font-bold border border-rose-200/60",
        },
      ],
    },
    {
      group: "SYSTEM CONFIG",
      items: [
        {
          id: "settings" as const,
          label: "শপ সেটিংস ও চার্জ",
          subtitle: "ডেলিভারি ও হেল্পলাইন",
          icon: Settings,
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#f4f6fb] text-slate-800 font-sans flex w-full max-w-full overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-[#0f172a] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-indigo-400/40 animate-fade-in">
          <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================= DESKTOP STICKY WHITE SIDEBAR (ANNEX STYLE) ================= */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 bg-white border-r border-slate-200/90 text-slate-700 sticky top-0 h-screen transition-all duration-300 z-30 select-none shadow-xs ${
          isSidebarCollapsed ? "w-20" : "w-64 xl:w-72"
        }`}
      >
        {/* Sidebar Brand Header (Starts at absolute top of viewport) */}
        <div className="h-16 px-4 border-b border-slate-100 flex items-center justify-between bg-white shrink-0">
          {!isSidebarCollapsed ? (
            <Link href="/" className="flex items-center gap-3 group">
              <img
                src="/images/logo.png"
                alt="Old Rank Logo"
                className="w-10 h-10 rounded-full object-cover shadow-sm group-hover:scale-105 transition-transform shrink-0 ring-1 ring-slate-200"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-black text-base text-slate-900 tracking-tight leading-none block">
                    Old<span className="text-[#5064df]">Rank</span>
                  </span>
                  <span className="text-[9px] font-extrabold bg-indigo-50 text-[#5064df] px-1.5 py-0.5 rounded border border-indigo-200/60 uppercase">
                    PRO
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase block mt-1">
                  ADMIN CONSOLE
                </span>
              </div>
            </Link>
          ) : (
            <Link href="/" className="mx-auto group flex items-center justify-center" title="Old Rank Store">
              <img
                src="/images/logo.png"
                alt="Old Rank Logo"
                className="w-10 h-10 rounded-full object-cover shadow-sm group-hover:scale-110 transition-transform ring-1 ring-slate-200"
              />
            </Link>
          )}
        </div>

        {/* Sidebar Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5 no-scrollbar">
          {navSections.map((sec, sIdx) => (
            <div key={sIdx} className="space-y-1">
              {!isSidebarCollapsed && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                  {sec.group}
                </span>
              )}
              <div className="space-y-1">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveTab(item.id)}
                      title={isSidebarCollapsed ? item.label : undefined}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer group relative ${
                        isActive
                          ? "bg-indigo-50/90 text-[#5064df] font-bold shadow-2xs"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                      } ${isSidebarCollapsed ? "justify-center px-0" : ""}`}
                    >
                      <Icon
                        size={17}
                        className={`shrink-0 transition-transform group-hover:scale-110 ${
                          isActive
                            ? "text-[#5064df]"
                            : item.isHot
                            ? "text-red-500 animate-pulse"
                            : "text-slate-400 group-hover:text-slate-600"
                        }`}
                      />
                      {!isSidebarCollapsed && (
                        <div className="flex-1 min-w-0 flex items-center justify-between">
                          <span className="text-xs truncate">{item.label}</span>
                          {item.badge !== undefined ? (
                            <span
                              className={`text-[10px] px-2 py-0.5 rounded-full ml-1.5 shrink-0 ${
                                item.badgeColor || "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {item.badge}
                            </span>
                          ) : (
                            <ChevronRight size={13} className="text-slate-300 group-hover:text-slate-400 transition-transform group-hover:translate-x-0.5" />
                          )}
                        </div>
                      )}

                      {isSidebarCollapsed && item.badge !== undefined && (
                        <span className="absolute top-1.5 right-2 w-2 h-2 rounded-full bg-[#5064df] ring-2 ring-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Bottom Profile Card */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          {!isSidebarCollapsed ? (
            <div className="flex items-center justify-between p-2 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#5064df] flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100">
                  {user?.role === "seller" ? <Store size={14} /> : <Crown size={14} />}
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-slate-800 block truncate leading-tight">
                    {user?.name || "Admin"}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold block truncate leading-tight">
                    ● Online (HQ Authority)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={logout}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="লগআউট"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={logout}
              className="w-full flex items-center justify-center p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              title="লগআউট"
            >
              <LogOut size={16} />
            </button>
          )}
        </div>
      </aside>

      {/* ================= MOBILE OVERLAY DRAWER SIDEBAR ================= */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />

          <aside className="fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white border-r border-slate-200 text-slate-700 shadow-2xl flex flex-col z-10 animate-slide-in">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src="/images/logo.png"
                  alt="Old Rank Logo"
                  className="w-10 h-10 rounded-full object-cover shadow-sm shrink-0 ring-1 ring-slate-200"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-black text-sm text-slate-900 tracking-tight">
                      Old<span className="text-[#5064df]">Rank</span>
                    </span>
                    <span className="text-[9px] font-extrabold bg-indigo-50 text-[#5064df] px-1.5 py-0.2 rounded border border-indigo-200/60 uppercase">
                      PRO
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 block font-bold mt-0.5">ADMIN CONSOLE</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(false)}
                className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-4 no-scrollbar">
              {navSections.map((sec, sIdx) => (
                <div key={sIdx} className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 block mb-1">
                    {sec.group}
                  </span>
                  <div className="space-y-1">
                    {sec.items.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => {
                            setActiveTab(item.id);
                            setIsMobileSidebarOpen(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-left transition-all cursor-pointer ${
                            isActive
                              ? "bg-indigo-50 text-[#5064df] font-bold shadow-2xs"
                              : "text-slate-600 hover:text-slate-900 hover:bg-slate-50 font-medium"
                          }`}
                        >
                          <Icon
                            size={18}
                            className={
                              isActive
                                ? "text-[#5064df]"
                                : item.isHot
                                ? "text-red-500 animate-pulse"
                                : "text-slate-400"
                            }
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs block leading-tight truncate">{item.label}</span>
                            <span className="text-[10px] text-slate-400 block truncate">{item.subtitle}</span>
                          </div>
                          {item.badge !== undefined && (
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                item.badgeColor || "bg-slate-100 text-slate-600"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <div className="w-8 h-8 rounded-full bg-indigo-50 text-[#5064df] flex items-center justify-center font-bold text-xs shrink-0 border border-indigo-100">
                  {user?.role === "seller" ? <Store size={14} /> : <Crown size={14} />}
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-slate-800 block truncate">{user?.name || "Admin"}</span>
                  <span className="text-[10px] text-slate-400 block truncate">HQ Authority</span>
                </div>
              </div>
              <button onClick={logout} className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg">
                <LogOut size={16} />
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ================= RIGHT CONTENT COLUMN (HEADER + SUBHEADER + MAIN) ================= */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen w-full max-w-full overflow-x-hidden">
        {/* Annex Vibrant Royal Blue / Indigo Top Header Bar */}
        <header className="sticky top-0 z-20 bg-gradient-to-r from-[#4d62e5] via-[#5064df] to-[#5b6be8] text-white px-3 sm:px-6 py-2 sm:py-3 shadow-md w-full">
          <div className="flex items-center justify-between gap-1.5 sm:gap-3 w-full">
            <div className="flex items-center gap-1.5 sm:gap-3 min-w-0">
              {/* Mobile Hamburger Button */}
              <button
                type="button"
                onClick={() => setIsMobileSidebarOpen(true)}
                className="lg:hidden p-1.5 sm:p-2 rounded-xl text-white/90 hover:text-white hover:bg-white/15 active:scale-95 transition-all cursor-pointer shrink-0"
                title="মেনু খুলুন"
              >
                <Menu size={19} />
              </button>

              {/* Desktop Sidebar Collapse Button */}
              <button
                type="button"
                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                className="hidden lg:flex p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                title={isSidebarCollapsed ? "সাইডবার বড় করুন" : "সাইডবার ছোট করুন"}
              >
                {isSidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
              </button>

              {/* Prominent Brand Logo in Dashboard Header */}
              <Link
                href="/"
                className="flex items-center gap-1.5 sm:gap-2.5 py-1 px-1.5 sm:px-2.5 rounded-xl bg-white/15 hover:bg-white/25 transition-all group shrink-0 border border-white/20 shadow-xs"
                title="Old Rank হোমপেজে যান"
              >
                <img
                  src="/images/logo.png"
                  alt="Old Rank Logo"
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover shadow-sm ring-1 sm:ring-2 ring-white/40 group-hover:scale-105 transition-transform shrink-0"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="font-black text-xs sm:text-base text-white tracking-tight leading-none">
                      Old<span className="text-amber-300">Rank</span>
                    </span>
                    <span className="text-[7px] sm:text-[8px] font-extrabold bg-amber-400 text-slate-950 px-1 py-0.2 rounded uppercase shrink-0">
                      Admin
                    </span>
                  </div>
                  <span className="text-[9px] text-white/70 font-semibold tracking-wider uppercase block mt-0.5 hidden sm:block">
                    Control Center
                  </span>
                </div>
              </Link>

              {/* Annex Pill Search Bar */}
              <div className="relative hidden xl:block">
                <Search size={14} className="absolute left-3.5 top-2.5 text-white/60 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search products, orders..."
                  value={productSearch || searchQuery}
                  onChange={(e) => {
                    setProductSearch(e.target.value);
                    setSearchQuery(e.target.value);
                  }}
                  className="bg-white/15 hover:bg-white/20 focus:bg-white/25 text-white placeholder-white/70 text-xs pl-9 pr-4 py-1.5 rounded-full outline-none transition-all w-36 sm:w-52 focus:w-60 border border-white/10"
                />
              </div>
            </div>

            {/* Right Icons & Homepage Action Button */}
            <div className="flex items-center gap-1 sm:gap-2 shrink-0">
              {/* Prominent Homepage Button */}
              <Link
                href="/"
                className="flex items-center gap-1 text-[11px] sm:text-xs font-black text-slate-950 bg-amber-400 hover:bg-amber-300 active:scale-95 py-1.5 px-2 sm:px-3.5 rounded-xl shadow-xs transition-all shrink-0 border border-amber-300 group cursor-pointer"
                title="মূল ওয়েবসাইটে / হোমপেজে ফিরে যান"
              >
                <Home size={14} className="text-slate-950 group-hover:-translate-y-0.5 transition-transform shrink-0" />
                <span className="hidden sm:inline">হোমপেজে যান</span>
                <span className="sm:hidden hidden xs:inline">হোম</span>
              </Link>

              {/* Notification Bell with Badge */}
              <button
                type="button"
                onClick={() => setActiveTab("orders")}
                className="relative p-1.5 sm:p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer hidden sm:block"
                title="অর্ডার নোটিফিকেশন"
              >
                <Bell size={17} />
                {orders.filter((o) => o.status === "pending").length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-amber-400 text-slate-900 font-bold text-[9px] flex items-center justify-center shadow">
                    {orders.filter((o) => o.status === "pending").length}
                  </span>
                )}
              </button>

              {/* Messages / Incomplete Leads with Badge */}
              <button
                type="button"
                onClick={() => setActiveTab("incomplete")}
                className="relative p-1.5 sm:p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer hidden sm:block"
                title="ড্রপ-অফ লিডস"
              >
                <Mail size={17} />
                {incompleteOrders.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center shadow">
                    {incompleteOrders.length}
                  </span>
                )}
              </button>

              {/* Refresh Data */}
              <button
                onClick={loadData}
                className="p-1.5 sm:p-2 rounded-xl text-white/80 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                title="রিফ্রেশ করুন"
              >
                <RefreshCw size={15} className={isLoading ? "animate-spin text-amber-300" : ""} />
              </button>

              {/* User Avatar & Logout */}
              <div className="flex items-center gap-1.5 sm:gap-2 pl-1.5 sm:pl-2 border-l border-white/20 shrink-0">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white text-[#5064df] flex items-center justify-center font-bold text-[11px] sm:text-xs shadow shrink-0">
                  {user?.name ? user.name[0].toUpperCase() : "A"}
                </div>
                <div className="hidden lg:block text-left">
                  <span className="text-xs font-bold text-white block leading-tight truncate max-w-[100px]">
                    {user?.name || "Admin"}
                  </span>
                  <span className="text-[10px] text-white/70 block leading-tight">
                    HQ Authority
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-white/80 hover:text-rose-200 hover:bg-rose-500/20 transition-colors cursor-pointer shrink-0"
                  title="লগআউট"
                >
                  <LogOut size={15} />
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Annex Subheader / Breadcrumb Bar */}
        <div className="bg-white border-b border-slate-200/80 px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-2xs w-full overflow-hidden">
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-black text-slate-800 tracking-tight flex items-center gap-2 flex-wrap break-words">
              {activeTab === "overview" && "Chartist Chart (ড্যাশবোর্ড ও সেলস ওভারভিউ)"}
              {activeTab === "products" && "প্রোডাক্ট পোস্ট ও স্টক ইনভেন্টরি"}
              {activeTab === "sellers" && "সেলার ও ভেন্ডর ম্যানেজমেন্ট হাব"}
              {activeTab === "orders" && "সকল কাস্টমার অর্ডার ও ইনভয়েস"}
              {activeTab === "incomplete" && "ইনকমপ্লিট অর্ডার ও ড্রপ-অফ লিডস"}
              {activeTab === "hotoffer" && "হট অফার ও রিয়েল-টাইম টাইমার"}
              {activeTab === "settings" && "শপ সেটিংস ও চার্জ কনফিগারেশন"}
            </h1>
            <p className="text-[11px] text-slate-400 mt-0.5 truncate sm:whitespace-normal">
              Old Rank Official Administration Console & E-Commerce Control Center
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-slate-400 font-medium shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1 font-bold text-[#5064df] hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2 sm:px-2.5 py-1 rounded-lg border border-indigo-200/60 transition-colors"
              title="ওয়েবসাইট হোমপেজে যান"
            >
              <Home size={13} />
              <span>হোমপেজ ↗</span>
            </Link>
            <span>/</span>
            <span>Admin</span>
            <span>/</span>
            <span className="text-[#5064df] font-bold">
              {activeTab === "overview" ? "Chartist Chart" : activeTab}
            </span>
          </div>
        </div>

        {/* Main Dashboard Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 overflow-y-auto">
          {/* Role Banner if Seller */}
          {user?.role === "seller" ? (
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
          ) : !isLoggedIn || user?.role !== "admin" ? (
            <div className="bg-indigo-50 border border-indigo-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-indigo-950 text-xs shadow-xs">
              <div className="flex items-center gap-2.5">
                <Crown size={20} className="text-[#5064df] shrink-0" />
                <span>
                  <strong>ডেমো মোড নোটিশ:</strong> আপনি বর্তমানে সরাসরি ভিজিট করেছেন। পূর্ণ কন্ট্রোলের জন্য অ্যাডমিন মোড সক্রিয় করুন।
                </span>
              </div>
              <button
                onClick={handleSwitchToAdmin}
                className="bg-[#5064df] hover:bg-[#3f51b5] text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors shrink-0 cursor-pointer"
              >
                <UserCheck size={14} /> ১-ক্লিকে অ্যাডমিন হিসেবে সক্রিয় হন
              </button>
            </div>
          ) : null}

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* 4 Chartist Cards matching Annex Screenshot (2x2 Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Overlapping bars on mobile */}
              <SalesBarChart
                marketplaceTotal={stats.totalRevenue || 365400}
                lastWeekTotal={Math.round((stats.totalRevenue || 365400) * 0.26)}
                lastMonthTotal={Math.round((stats.totalRevenue || 365400) * 0.82)}
              />

              {/* Card 2: Stacked bar chart */}
              <StackedBarChart
                deliveredCount={stats.deliveredOrders || 3654}
                processingCount={orders.filter((o) => o.status === "processing" || o.status === "shipped").length || 954}
                pendingCount={orders.filter((o) => o.status === "pending").length || 8462}
              />

              {/* Card 3: Animating a Donut with Svg.animate */}
              <DonutWheelChart
                cat1={products.length || 3654}
                cat2={vendors.length || 954}
                cat3={stats.totalOrders || 8462}
              />

              {/* Card 4: Simple pie chart */}
              <CleanPieChart p1={33} p2={42} p3={25} />
            </div>
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

        {/* TAB 7: HOT OFFER & REAL-TIME TIMER MANAGEMENT */}
        {activeTab === "hotoffer" && (
          <div className="space-y-6">
            {/* Header Status Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-white shadow-md ${
                    hotDealConfig.isOfferActive
                      ? "bg-gradient-to-br from-red-500 to-rose-600 shadow-red-500/30 animate-pulse"
                      : "bg-slate-700 shadow-slate-700/20"
                  }`}
                >
                  <Flame size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-black text-slate-900 tracking-tight">
                      হট অফার ও রিয়েল-টাইম কাউন্টডাউন টাইমার কন্ট্রোল
                    </h2>
                    <span
                      className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                        hotDealConfig.isOfferActive
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {hotDealConfig.isOfferActive ? "● অফার লাইভ আছে" : "○ অফার বন্ধ (Coming Soon)"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    অফার সক্রিয়/নিষ্ক্রিয় করুন, শেষ হওয়ার রিয়েল-টাইম টাইমার সেট করুন এবং লাইভ প্রিভিউ দেখুন
                  </p>
                </div>
              </div>

              {/* Instant Status Toggle Button */}
              <div className="flex items-center gap-2 shrink-0">
                {hotDealConfig.isOfferActive ? (
                  <button
                    type="button"
                    onClick={() => handleToggleGlobalHotOffer(false)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 border border-slate-300 transition-colors cursor-pointer"
                  >
                    <Clock size={14} className="text-slate-600" />
                    <span>অফার বন্ধ রাখুন (Coming Soon মোড)</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleToggleGlobalHotOffer(true)}
                    className="bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-red-500/20 transition-transform active:scale-95 cursor-pointer"
                  >
                    <Flame size={14} className="animate-pulse" />
                    <span>১-ক্লিকে অফার সক্রিয় করুন (Go Live)</span>
                  </button>
                )}
              </div>
            </div>

            {/* Form + Live Preview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Form Controls (7 Columns) */}
              <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                    <Sliders size={16} className="text-amber-500" />
                    <span>অফারের বিস্তারিত সেটিংস</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    হোমপেজের হট ডিল সেকশনের টেক্সট এবং কাউন্টডাউন কনফিগার করুন
                  </p>
                </div>

                <form onSubmit={handleSaveHotDeal} className="space-y-4 text-xs">
                  {/* Active Switch */}
                  <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">অফার স্ট্যাটাস (Offer Status)</span>
                      <span className="text-[11px] text-slate-500">
                        {hotDealConfig.isOfferActive
                          ? "হোমপেজে লাল রঙের হট ডিল সেকশন ও টাইমার প্রদর্শিত হবে।"
                          : "হোমপেজে 'Offer Coming Soon (শীঘ্রই নতুন অফার আসছে)' সেকশন দেখাবে।"}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setHotDealConfig({
                          ...hotDealConfig,
                          isOfferActive: !hotDealConfig.isOfferActive,
                        })
                      }
                      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                        hotDealConfig.isOfferActive ? "bg-red-600" : "bg-slate-300"
                      }`}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          hotDealConfig.isOfferActive ? "translate-x-5" : "translate-x-0"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Title & Badge */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        অফারের শিরোনাম (Offer Title) *
                      </label>
                      <input
                        type="text"
                        required
                        value={hotDealConfig.offerTitle}
                        onChange={(e) =>
                          setHotDealConfig({ ...hotDealConfig, offerTitle: e.target.value })
                        }
                        placeholder="হট ডিল কালেকশন"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        ডিসকাউন্ট ব্যাজ (Badge Text)
                      </label>
                      <input
                        type="text"
                        value={hotDealConfig.discountBadge}
                        onChange={(e) =>
                          setHotDealConfig({ ...hotDealConfig, discountBadge: e.target.value })
                        }
                        placeholder="সীমিত স্টক / মেগা সেল"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-red-500"
                      />
                    </div>
                  </div>

                  {/* Subtitle */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      অফারের সাবটাইটেল (Subtitle)
                    </label>
                    <input
                      type="text"
                      value={hotDealConfig.offerSubtitle}
                      onChange={(e) =>
                        setHotDealConfig({ ...hotDealConfig, offerSubtitle: e.target.value })
                      }
                      placeholder="সবচেয়ে বেশি বিক্রিত পণ্যগুলোতে বিশাল ডিসকাউন্ট অফার"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 focus:ring-2 focus:ring-red-500"
                    />
                  </div>

                  {/* End Time Picker */}
                  <div className="space-y-2 pt-1">
                    <label className="block font-bold text-slate-700">
                      অফার শেষ হওয়ার তারিখ ও সময় (Offer End Date & Time) *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={hotDealConfig.offerEndTime}
                      onChange={(e) =>
                        setHotDealConfig({ ...hotDealConfig, offerEndTime: e.target.value })
                      }
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-red-500"
                    />

                    {/* Quick Preset Buttons */}
                    <div className="pt-1">
                      <span className="text-[11px] font-bold text-slate-500 block mb-1.5">
                        ⚡ কুইক প্রিসেট (১-ক্লিকে সময় নির্ধারণ করুন):
                      </span>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => handleApplyPresetTime(6)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          +৬ ঘণ্টা
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPresetTime(12)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          +১২ ঘণ্টা
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPresetTime(24)}
                          className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          +২৪ ঘণ্টা (১ দিন)
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPresetTime(72)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          +৩ দিন
                        </button>
                        <button
                          type="button"
                          onClick={() => handleApplyPresetTime(168)}
                          className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          +৭ দিন (১ সপ্তাহ)
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-3">
                    <button
                      type="submit"
                      disabled={isSavingHotDeal}
                      className="w-full bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 hover:opacity-95 text-white font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-red-500/25 transition-transform active:scale-98 cursor-pointer disabled:opacity-50"
                    >
                      {isSavingHotDeal ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>সংরক্ষণ হচ্ছে...</span>
                        </>
                      ) : (
                        <>
                          <Check size={16} />
                          <span>হট অফার সেটিংস সংরক্ষণ ও হোমপেজে লাইভ করুন</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

              {/* Live Preview Column (5 Columns) */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-xs">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                    <div className="flex items-center gap-2">
                      <Eye size={16} className="text-indigo-600" />
                      <h4 className="font-black text-xs text-slate-900">হোমপেজ লাইভ প্রিভিউ</h4>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400">রিয়েল-টাইম লুক</span>
                  </div>

                  {hotDealConfig.isOfferActive ? (
                    /* Active Preview */
                    <div className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 rounded-2xl p-4 text-white shadow-lg space-y-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-white text-red-600 flex items-center justify-center font-bold shadow shrink-0 animate-pulse">
                          <Zap size={16} className="fill-red-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-black text-xs">{hotDealConfig.offerTitle || "হট ডিল"}</span>
                            <span className="text-[9px] bg-amber-400 text-slate-900 font-bold px-1.5 py-0.2 rounded-full">
                              {hotDealConfig.discountBadge || "সীমিত স্টক"}
                            </span>
                          </div>
                          <p className="text-[10px] text-rose-100 line-clamp-1">
                            {hotDealConfig.offerSubtitle || "ডিসকাউন্ট অফার"}
                          </p>
                        </div>
                      </div>

                      <div className="bg-black/35 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 font-mono text-[11px] font-black flex items-center justify-between">
                        <span className="text-[10px] text-amber-300 font-sans font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                          লাইভ টাইমার:
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="bg-white text-slate-900 px-1 py-0.5 rounded">12h</span> :
                          <span className="bg-white text-slate-900 px-1 py-0.5 rounded">35m</span> :
                          <span className="bg-amber-400 text-slate-950 px-1 py-0.5 rounded animate-pulse">
                            40s
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Coming Soon Preview */
                    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-amber-500/30 rounded-2xl p-4 text-white shadow-lg space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow">
                          <Clock size={18} />
                        </div>
                        <div>
                          <span className="text-[9px] font-black uppercase text-amber-300 bg-amber-400/20 border border-amber-400/30 px-2 py-0.2 rounded-full inline-block mb-0.5">
                            Offer Coming Soon
                          </span>
                          <h5 className="text-xs font-black text-white">শীঘ্রই নতুন অফার আসছে!</h5>
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-300 leading-relaxed">
                        আমাদের পরবর্তী ধামাকা অফারের প্রস্তুতি চলছে। চোখ রাখুন আমাদের ওয়েবসাইটে।
                      </p>
                      <div className="pt-1">
                        <span className="inline-block bg-amber-400 text-slate-950 font-black text-[10px] px-3 py-1 rounded-lg">
                          সব প্রোডাক্ট দেখুন →
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-500 space-y-1">
                    <p className="font-bold text-slate-700">💡 অ্যাডমিন নির্দেশিকা:</p>
                    <p>• অফার অফ রাখলে হোমপেজে সুন্দর "Offer Coming Soon" ব্যানার প্রদর্শিত হবে।</p>
                    <p>• অফার সক্রিয় থাকলে রিয়েল-টাইম ঘড়ির কাঁটার মতো ১ সেকেন্ড পর পর সময় কমতে থাকবে।</p>
                    <p>• নির্ধারিত সময়ে কাউন্টডাউন ০ হয়ে গেলে স্বয়ংক্রিয়ভাবে কামিং সুন মোডে পরিবর্তিত হবে।</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        </main>
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

              {/* Cloudinary Direct File & Document Upload */}
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5 text-xs">
                    <UploadCloud size={16} className="text-amber-600" />
                    <span>ক্লাউডিনারি ফাইল আপলোড (Cloudinary Upload)</span>
                  </label>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    ছবি ও PDF ডকুমেন্টস
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <label className="flex-1 cursor-pointer">
                    <div className="border-2 border-dashed border-amber-300 hover:border-amber-500 bg-white hover:bg-amber-50/40 rounded-xl p-3 text-center transition-all flex flex-col items-center justify-center gap-1">
                      {isUploadingImage ? (
                        <div className="flex items-center gap-2 text-amber-700 font-bold py-1">
                          <div className="w-4 h-4 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
                          <span>ক্লাউডিনারিতে আপলোড হচ্ছে...</span>
                        </div>
                      ) : (
                        <>
                          <UploadCloud size={20} className="text-amber-600 mb-0.5" />
                          <span className="text-xs font-bold text-slate-800">
                            কম্পিউটার বা মোবাইল থেকে ফাইল আপলোড করুন
                          </span>
                          <span className="text-[10px] text-slate-400">
                            JPG, PNG, WEBP অথবা ক্যাটালগ PDF (Cloudinary Secure CDN)
                          </span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleCloudinaryUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                  </label>

                  {productForm.mainImage && (
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-amber-400 shadow-sm shrink-0 bg-slate-100">
                      <img
                        src={productForm.mainImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[8px] text-center font-bold py-0.5">
                        প্রিভিউ
                      </span>
                    </div>
                  )}
                </div>

                {uploadSuccessMessage && (
                  <p className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle2 size={12} /> {uploadSuccessMessage}
                  </p>
                )}
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
