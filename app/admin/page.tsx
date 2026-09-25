"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  TrendingUp,
  TrendingDown,
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
  ArrowRight,
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
  User,
  Shield,
  Key,
  Lock,
  EyeOff,
  MapPin,
  Calendar,
  Smartphone,
  Globe,
  Award,
  Copy,
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

// Preset luxury jewelry images for 1-click rapid posting
const PRESET_GALLERY_IMAGES = [
  { label: "Bridal Choker Necklace Set", url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80" },
  { label: "Royal Emerald Drop Earrings", url: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80" },
  { label: "Antique Kundan Floral Ring", url: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&auto=format&fit=crop&q=80" },
  { label: "Gold Plated Textured Bangles", url: "https://images.unsplash.com/photo-1611591475152-473549605898?w=800&auto=format&fit=crop&q=80" },
  { label: "Pearl & Ruby Statement Necklace", url: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&auto=format&fit=crop&q=80" },
  { label: "Traditional Matte Gold Jhumka", url: "https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&auto=format&fit=crop&q=80" },
  { label: "Diamond-Cut CZ Tennis Bracelet", url: "https://images.unsplash.com/photo-1611591475152-473549605898?w=800&auto=format&fit=crop&q=80" },
  { label: "Old Rank Official Store Banner", url: "/images/old-rank-banner.jpg" },
];

export type AdminTab =
  | "overview"
  | "products"
  | "sellers"
  | "orders"
  | "incomplete"
  | "hotoffer"
  | "settings"
  | "profile"
  | "profitloss";

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
    totalRevenue: 0,
    totalOrders: 0,
    pendingOrders: 0,
    confirmedOrders: 0,
    deliveredOrders: 0,
    incompleteCount: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedInvoice, setSelectedInvoice] = useState<IOrder | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Custom Confirmation Dialog Modal State (Replaces browser alert/confirm)
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    isDanger?: boolean;
    onConfirm: () => Promise<void> | void;
  } | null>(null);
  const [isConfirmLoading, setIsConfirmLoading] = useState(false);

  // Master Admin Authentication Gate (Exclusive for Niloy - niloy@gmail.com / niloy3140)
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState("");

  // Admin Profile Information State
  const [adminProfile, setAdminProfile] = useState({
    name: "Niloy",
    email: "niloy@gmail.com",
    phone: "01956016119",
    role: "Master Administrator & Store Owner",
    designation: "চিফ এক্সিকিউটিভ ও সিস্টেম ওনার (HQ Control)",
    address: "মিরপুর, ঢাকা - ১২১৬, বাংলাদেশ",
    bio: "Old Rank এক্সক্লুসিভ জুয়েলারি ও ই-কমার্স প্ল্যাটফর্মের প্রধান নিয়ন্ত্রক ও ডেটাবেজ সুপার অ্যাডমিন।",
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  // Show/Hide password toggles for profile password manager
  const [showProfileCurrentPass, setShowProfileCurrentPass] = useState(false);
  const [showProfileNewPass, setShowProfileNewPass] = useState(false);
  const [showProfileConfirmPass, setShowProfileConfirmPass] = useState(false);

  // Change Admin Password state
  const [changePasswordForm, setChangePasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Website Entry Promo Popup toggle state (Default: false / OFF)
  const [isPromoPopupActive, setIsPromoPopupActive] = useState(false);

  useEffect(() => {
    // Check if admin is previously logged in
    const isLoggedAdmin = localStorage.getItem("oldrank_admin_logged") === "true";
    const storedName = localStorage.getItem("oldrank_admin_name") || "Niloy";
    const storedEmail = localStorage.getItem("oldrank_admin_email") || "niloy@gmail.com";
    const storedPhone = localStorage.getItem("oldrank_admin_phone") || "01956016119";
    const storedAddress = localStorage.getItem("oldrank_admin_address") || "মিরপুর, ঢাকা - ১২১৬, বাংলাদেশ";
    const storedBio = localStorage.getItem("oldrank_admin_bio") || "Old Rank এক্সক্লুসিভ জুয়েলারি ও ই-কমার্স প্ল্যাটফর্মের প্রধান নিয়ন্ত্রক ও ডেটাবেজ সুপার অ্যাডমিন।";

    setAdminProfile((prev) => ({
      ...prev,
      name: storedName,
      email: storedEmail,
      phone: storedPhone,
      address: storedAddress,
      bio: storedBio,
    }));

    if (isLoggedAdmin) {
      setIsAdminAuthenticated(true);
      login({
        id: "usr_niloy",
        name: `${storedName} (Admin)`,
        email: storedEmail,
        phone: storedPhone,
        role: "admin",
      });
    }

    // Check promo modal status
    const promoActive = localStorage.getItem("oldrank_promo_active") === "true";
    setIsPromoPopupActive(promoActive);

    // Check tab query parameter
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get("tab") as AdminTab;
      if (tabParam && ["overview", "products", "sellers", "orders", "incomplete", "hotoffer", "settings", "profile"].includes(tabParam)) {
        setActiveTab(tabParam);
      }
    }
  }, []);

  const handleAdminLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthError("");
    const storedEmail = (localStorage.getItem("oldrank_admin_email") || "niloy@gmail.com").trim().toLowerCase();
    const storedPass = localStorage.getItem("oldrank_admin_password") || "niloy3140";
    const storedName = localStorage.getItem("oldrank_admin_name") || "Niloy";

    if (adminEmail.trim().toLowerCase() === storedEmail && adminPassword === storedPass) {
      localStorage.setItem("oldrank_admin_logged", "true");
      setIsAdminAuthenticated(true);
      login({
        id: "usr_niloy",
        name: `${storedName} (Admin)`,
        email: storedEmail,
        phone: localStorage.getItem("oldrank_admin_phone") || "01956016119",
        role: "admin",
      });
      showToast("👑 স্বাগতম নিলয়! অ্যাডমিন প্যানেলে সফলভাবে লগইন হয়েছে।");
    } else {
      setAdminAuthError("❌ ভুল ইমেইল বা পাসওয়ার্ড! অনুগ্রহ করে সঠিক অ্যাডমিন তথ্য প্রদান করুন।");
    }
  };

  const handleAdminLogout = () => {
    localStorage.removeItem("oldrank_admin_logged");
    setIsAdminAuthenticated(false);
    logout();
    showToast("সফলভাবে লগআউট হয়েছেন।");
  };

  const handleSaveAdminProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminProfile.name.trim()) {
      showToast("❌ অ্যাডমিনের নাম খালি রাখা যাবে না!");
      return;
    }
    if (!adminProfile.email.trim() || !adminProfile.email.includes("@")) {
      showToast("❌ অনুগ্রহ করে সঠিক ইমেইল প্রদান করুন!");
      return;
    }
    setIsSavingProfile(true);
    setTimeout(() => {
      localStorage.setItem("oldrank_admin_name", adminProfile.name.trim());
      localStorage.setItem("oldrank_admin_email", adminProfile.email.trim().toLowerCase());
      localStorage.setItem("oldrank_admin_phone", adminProfile.phone.trim());
      localStorage.setItem("oldrank_admin_address", adminProfile.address.trim());
      localStorage.setItem("oldrank_admin_bio", adminProfile.bio.trim());

      login({
        id: "usr_niloy",
        name: `${adminProfile.name.trim()} (Admin)`,
        email: adminProfile.email.trim().toLowerCase(),
        phone: adminProfile.phone.trim(),
        role: "admin",
      });

      setIsSavingProfile(false);
      setIsEditingProfile(false);
      showToast("🎉 অ্যাডমিন প্রোফাইল সফলভাবে আপডেট হয়েছে!");
    }, 400);
  };

  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "প্রবেশ করাননি", color: "bg-slate-200", textColor: "text-slate-400", width: "0%" };
    let score = 0;
    if (pass.length >= 4) score += 1;
    if (pass.length >= 7) score += 1;
    if (/\d/.test(pass) && /[a-zA-Z]/.test(pass)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: "দুর্বল (Weak)", color: "bg-rose-500", textColor: "text-rose-600", width: "33%" };
    if (score <= 2) return { score: 2, label: "মাঝারি (Medium)", color: "bg-amber-500", textColor: "text-amber-600", width: "66%" };
    return { score: 3, label: "শক্তিশালী (Strong)", color: "bg-emerald-500", textColor: "text-emerald-600", width: "100%" };
  };

  const handleChangeAdminPassword = (e: React.FormEvent) => {
    e.preventDefault();
    const storedPass = localStorage.getItem("oldrank_admin_password") || "niloy3140";
    if (changePasswordForm.currentPassword !== storedPass) {
      showToast("❌ বর্তমান পাসওয়ার্ড ভুল হয়েছে!");
      return;
    }
    if (changePasswordForm.newPassword.length < 4) {
      showToast("❌ নতুন পাসওয়ার্ড অন্তত ৪ অক্ষরের হতে হবে!");
      return;
    }
    if (changePasswordForm.newPassword !== changePasswordForm.confirmPassword) {
      showToast("❌ নতুন পাসওয়ার্ড দুটি মিলছে না!");
      return;
    }
    localStorage.setItem("oldrank_admin_password", changePasswordForm.newPassword);
    setChangePasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    showToast("🎉 অ্যাডমিন পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে!");
  };

  const handleTogglePromoPopup = (active: boolean) => {
    localStorage.setItem("oldrank_promo_active", active ? "true" : "false");
    setIsPromoPopupActive(active);
    showToast(active ? "✅ ওয়েবসাইট এন্ট্রি অফার পপআপ চালু করা হয়েছে!" : "⏸️ অফার পপআপ বন্ধ রাখা হয়েছে!");
  };


  // Product Modals & Filters
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<IProduct | null>(null);
  const [productSearch, setProductSearch] = useState("");
  const [productCategoryFilter, setProductCategoryFilter] = useState("all");

  // New Product Form State
  const [productForm, setProductForm] = useState({
    name: "",
    shortDescription: "",
    category: "jewelry",
    categoryName: "জুয়েলারি ও অলংকার",
    vendor: "Old Rank Jewelry",
    basePrice: "",
    costPrice: "",
    oldPrice: "",
    stock: "50",
    isHotDeal: true,
    isFeatured: true,
    mainImage: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&auto=format&fit=crop&q=80",
    selectedSizes: ["Free Size"],
    colorName: "Gold Polish",
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
      // Immediately refresh live server stats so revenue and metrics update
      api.getAdminStats().then(setStats).catch(() => {});
      if (newStatus === "confirmed") {
        showToast(`🎉 অর্ডার ${invoiceId} কনফার্ম করা হয়েছে এবং মূল হিসাবে যুক্ত করা হয়েছে!`);
      } else {
        showToast(`অর্ডার ${invoiceId} এর স্ট্যাটাস '${newStatus}' এ পরিবর্তন করা হয়েছে।`);
      }
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
      api.getAdminStats().then(setStats).catch(() => {});
      showToast(`ইনভয়েস ${invoiceId} এর পেমেন্ট ভেরিফাই হয়েছে ও কনফার্ম হিসাবে যুক্ত হয়েছে!`);
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
        costPrice: Number(productForm.costPrice) || 0,
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
        category: "jewelry",
        categoryName: "জুয়েলারি ও অলংকার",
        vendor: "Old Rank Official",
        basePrice: "",
        costPrice: "",
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

  const handleDeleteProduct = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: "প্রোডাক্ট ডিলিট নিশ্চিতকরণ",
      message: `আপনি কি নিশ্চিতভাবে "${name}" প্রোডাক্টটি শপ থেকে সম্পূর্ণ মুছে ফেলতে চান? এটি মুছে ফেললে ক্যাটালগে আর প্রদর্শিত হবে না।`,
      confirmText: "হ্যাঁ, ডিলিট করুন",
      cancelText: "বাতিল",
      isDanger: true,
      onConfirm: async () => {
        setIsConfirmLoading(true);
        try {
          await api.deleteProduct(id);
          setProducts((prev) => prev.filter((p) => p._id !== id));
          showToast(`"${name}" প্রোডাক্টটি সফলভাবে মুছে ফেলা হয়েছে।`);
        } catch {
          showToast("ডিলিট করা সম্ভব হয়নি।");
        } finally {
          setIsConfirmLoading(false);
          setConfirmModal(null);
        }
      },
    });
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

  const handleDeleteSeller = (vendorId: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: "সেলার শপ মুছে ফেলার নিশ্চিতকরণ",
      message: `আপনি কি নিশ্চিতভাবে "${name}" সেলার শপটি মুছে ফেলতে চান? এর ফলে সংশ্লিষ্ট ভেন্ডরের সকল মার্চেন্ট অ্যাক্সেস স্থায়ীভাবে বাতিল হবে।`,
      confirmText: "হ্যাঁ, মুছে ফেলুন",
      cancelText: "বাতিল",
      isDanger: true,
      onConfirm: async () => {
        setIsConfirmLoading(true);
        try {
          await api.deleteVendor(vendorId);
          setVendors((prev) => prev.filter((v) => v._id !== vendorId));
          showToast(`সেলার "${name}" সফলভাবে মুছে ফেলা হয়েছে।`);
        } catch {
          showToast("মুছে ফেলা সম্ভব হয়নি।");
        } finally {
          setIsConfirmLoading(false);
          setConfirmModal(null);
        }
      },
    });
  };

  // ================= PROFIT & LOSS REAL-TIME TIMEFRAME CALCULATOR =================
  type ProfitLossTimeframe =
    | "today"
    | "yesterday"
    | "last7days"
    | "lastWeek"
    | "last30days"
    | "thisMonth"
    | "all";

  const [plFilter, setPlFilter] = useState<ProfitLossTimeframe>("all");

  const getItemUnitCost = (item: any): number => {
    if (item.costPrice && Number(item.costPrice) > 0) return Number(item.costPrice);
    const matched = products.find((p) => p._id === item.productId || p.name === item.name);
    if (matched?.costPrice && Number(matched.costPrice) > 0) return Number(matched.costPrice);
    if (item.price && Number(item.price) > 0) return Math.round(Number(item.price) * 0.6);
    return 0;
  };

  const getOrdersByTimeframe = (ordersList: IOrder[], timeframe: ProfitLossTimeframe) => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0);
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999);

    const yesterdayStart = new Date(todayStart);
    yesterdayStart.setDate(yesterdayStart.getDate() - 1);
    const yesterdayEnd = new Date(todayEnd);
    yesterdayEnd.setDate(yesterdayEnd.getDate() - 1);

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dayOfWeek = now.getDay() || 7;
    const thisWeekStart = new Date(todayStart);
    thisWeekStart.setDate(thisWeekStart.getDate() - (dayOfWeek - 1));
    const lastWeekStart = new Date(thisWeekStart);
    lastWeekStart.setDate(lastWeekStart.getDate() - 7);
    const lastWeekEnd = new Date(thisWeekStart);
    lastWeekEnd.setMilliseconds(-1);

    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);

    return ordersList.filter((ord) => {
      const orderDate = new Date(ord.createdAt);
      if (isNaN(orderDate.getTime())) return true;

      switch (timeframe) {
        case "today":
          return orderDate >= todayStart && orderDate <= todayEnd;
        case "yesterday":
          return orderDate >= yesterdayStart && orderDate <= yesterdayEnd;
        case "last7days":
          return orderDate >= sevenDaysAgo && orderDate <= now;
        case "lastWeek":
          return orderDate >= lastWeekStart && orderDate <= lastWeekEnd;
        case "last30days":
          return orderDate >= thirtyDaysAgo && orderDate <= now;
        case "thisMonth":
          return orderDate >= thisMonthStart && orderDate <= now;
        case "all":
        default:
          return true;
      }
    });
  };

  const plOrders = useMemo(() => {
    return getOrdersByTimeframe(orders, plFilter);
  }, [orders, plFilter]);

  const plMetrics = useMemo(() => {
    let grossRevenue = 0;
    let totalCogs = 0;
    let totalDelivery = 0;
    let totalDiscount = 0;
    let validOrdersCount = 0;
    let deliveredRevenue = 0;
    let deliveredProfit = 0;

    let pendingOrdersCount = 0;
    let pendingPotentialRevenue = 0;

    plOrders.forEach((ord) => {
      if (ord.status === "cancelled") return;

      // Pending orders stay waiting and are NOT added to business calculations until admin confirms
      if (ord.status === "pending") {
        pendingOrdersCount++;
        pendingPotentialRevenue += Number(ord.grandTotal) || Number(ord.subtotal) || 0;
        return;
      }

      // ONLY confirmed, processing, shipped, delivered orders count in real business calculations
      validOrdersCount++;
      const sale = Number(ord.grandTotal) || Number(ord.subtotal) || 0;
      grossRevenue += sale;
      totalDelivery += Number(ord.deliveryCharge) || 0;
      totalDiscount += Number(ord.discount) || 0;

      const orderCost =
        ord.items?.reduce((iSum, item) => {
          return iSum + getItemUnitCost(item) * (Number(item.quantity) || 1);
        }, 0) || 0;

      totalCogs += orderCost;

      if (ord.status === "delivered") {
        deliveredRevenue += sale;
        deliveredProfit += (Number(ord.subtotal) || sale) - orderCost;
      }
    });

    const netProfit = grossRevenue - totalCogs - totalDelivery;
    const isNetProfit = netProfit >= 0;
    const profitMargin = grossRevenue > 0 ? ((netProfit / grossRevenue) * 100).toFixed(1) : "0.0";
    const avgProfitPerOrder = validOrdersCount > 0 ? Math.round(netProfit / validOrdersCount) : 0;
    const avgOrderValue = validOrdersCount > 0 ? Math.round(grossRevenue / validOrdersCount) : 0;

    return {
      grossRevenue,
      totalCogs,
      totalDelivery,
      totalDiscount,
      netProfit,
      isNetProfit,
      profitMargin,
      avgProfitPerOrder,
      avgOrderValue,
      totalOrdersCount: plOrders.length,
      validOrdersCount,
      deliveredRevenue,
      deliveredProfit,
      pendingOrdersCount,
      pendingPotentialRevenue,
    };
  }, [plOrders, products]);

  // Overall lifetime totalCost & netProfit for compatibility (strictly excludes pending and cancelled)
  const totalCost = orders
    .filter((ord) => ["confirmed", "processing", "shipped", "delivered"].includes(ord.status))
    .reduce((sum, ord) => {
      const ordCost = ord.items?.reduce((itemSum, item) => {
        return itemSum + getItemUnitCost(item) * (Number(item.quantity) || 1);
      }, 0) || 0;
      return sum + ordCost;
    }, 0);

  const totalNetProfit = Math.max(0, (stats.totalRevenue || 0) - totalCost);

  const TIMEFRAME_OPTIONS: Array<{
    id: ProfitLossTimeframe;
    label: string;
    shortLabel: string;
    description: string;
    icon: string;
  }> = [
    { id: "today", label: "আজ (Today)", shortLabel: "আজ", description: "আজকের লাইভ বিক্রয়", icon: "⚡" },
    { id: "yesterday", label: "গতকাল (Yesterday)", shortLabel: "গতকাল", description: "গতকালের সমাপ্ত হিসাব", icon: "⏳" },
    { id: "last7days", label: "গত ৭ দিন (7 Days)", shortLabel: "৭ দিন", description: "বিগত ৭ দিনের হিসাব", icon: "📅" },
    { id: "lastWeek", label: "গত সপ্তাহ (Last Week)", shortLabel: "গত সপ্তাহ", description: "পূর্ববর্তী পুরো সপ্তাহ", icon: "🗓️" },
    { id: "last30days", label: "গত ৩০ দিন (30 Days)", shortLabel: "৩০ দিন", description: "বিগত ৩০ দিনের হিসেব", icon: "📆" },
    { id: "thisMonth", label: "এই মাস (This Month)", shortLabel: "এই মাস", description: "চলতি মাসের হিসাব", icon: "📊" },
    { id: "all", label: "সকল সময় (All Time)", shortLabel: "সব সময়", description: "লাইফটাইম মোট লাভ-ক্ষতি", icon: "🌐" },
  ];


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
      group: "FINANCE & PROFIT/LOSS",
      items: [
        {
          id: "profitloss" as const,
          label: "লাভ-ক্ষতির হিসাব ও মার্জিন",
          subtitle: "রিয়েল-টাইম প্রফিট ও মার্জিন",
          icon: TrendingUp,
          badge: plMetrics.profitMargin !== "0.0" ? `${plMetrics.profitMargin}%` : "মার্জিন",
          badgeColor: plMetrics.isNetProfit
            ? "bg-emerald-50 text-emerald-700 font-bold border border-emerald-200/60"
            : "bg-rose-50 text-rose-700 font-bold border border-rose-200/60",
        },
      ],
    },
    {
      group: "ADMIN & SECURITY",
      items: [
        {
          id: "profile" as const,
          label: "অ্যাডমিন প্রোফাইল ও সিকিউরিটি",
          subtitle: "ব্যক্তিগত তথ্য ও পাসওয়ার্ড",
          icon: User,
          badge: "HQ",
          badgeColor: "bg-amber-100 text-amber-900 font-extrabold border border-amber-300",
        },
        {
          id: "settings" as const,
          label: "শপ সেটিংস ও চার্জ",
          subtitle: "ডেলিভারি ও হেল্পলাইন",
          icon: Settings,
        },
      ],
    },
  ];

  // ================= MASTER ADMIN LOGIN GATE =================
  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0f172a] to-indigo-950 flex items-center justify-center p-4">
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-[#0f172a] text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 text-xs font-bold border border-indigo-400/40 animate-fade-in">
            <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-6 sm:p-8 space-y-6 animate-scale-up">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#303d6e] text-amber-400 flex items-center justify-center mx-auto shadow-lg border border-indigo-200">
              <Crown size={32} />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Old Rank অ্যাডমিন পোর্টাল
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              অ্যাডমিন ছাড়া অন্য কারো জন্য এই প্যানেলে প্রবেশ সম্পূর্ণ নিষিদ্ধ।
            </p>
          </div>

          {adminAuthError && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-3.5 text-xs text-rose-700 flex items-start gap-2.5">
              <AlertCircle size={16} className="shrink-0 mt-0.5 text-rose-600" />
              <span>{adminAuthError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
                অ্যাডমিন ইমেইল (Admin Email)
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-600 text-xs"
                />
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
                অ্যাডমিন পাসওয়ার্ড (Password)
              </label>
              <div className="relative">
                <input
                  type={showAdminPassword ? "text" : "password"}
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 text-xs tracking-wider"
                />
                <ShieldCheck size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  <Eye size={16} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#303d6e] hover:bg-indigo-900 text-white font-black py-3.5 px-4 rounded-xl shadow-lg shadow-indigo-950/20 text-xs transition-all active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2"
            >
              <Crown size={15} className="text-amber-400" />
              <span>লগইন করুন ও ড্যাশবোর্ডে প্রবেশ করুন</span>
            </button>
          </form>

          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <span className="text-slate-400">Old Rank Security Gate</span>
            <Link href="/" className="font-bold text-[#303d6e] hover:underline flex items-center gap-1">
              <Home size={12} /> হোমপেজে ফিরুন
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
            <div
              onClick={() => setActiveTab("profile")}
              className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                activeTab === "profile"
                  ? "bg-indigo-50 border-indigo-200 text-indigo-900 shadow-xs"
                  : "bg-white border-slate-200/80 shadow-2xs hover:bg-slate-50"
              }`}
              title="অ্যাডমিন প্রোফাইল ও সিকিউরিটি সেটিংস"
            >
              <div className="flex items-center gap-2.5 truncate">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  <Crown size={14} />
                </div>
                <div className="truncate text-left">
                  <span className="text-xs font-bold text-slate-800 block truncate leading-tight">
                    {adminProfile.name || "Niloy"}
                  </span>
                  <span className="text-[10px] text-emerald-600 font-semibold block truncate leading-tight">
                    ● Online (সুপার অ্যাডমিন)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdminLogout();
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                title="লগআউট"
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAdminLogout}
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

            <div
              onClick={() => {
                setActiveTab("profile");
                setIsMobileSidebarOpen(false);
              }}
              className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <div className="flex items-center gap-2 truncate">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                  <Crown size={14} />
                </div>
                <div className="truncate">
                  <span className="text-xs font-bold text-slate-800 block truncate">{adminProfile.name || "Niloy"}</span>
                  <span className="text-[10px] text-emerald-600 font-semibold block truncate">● Online (সুপার অ্যাডমিন)</span>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdminLogout();
                }}
                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg cursor-pointer"
                title="লগআউট"
              >
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
                <button
                  type="button"
                  onClick={() => setActiveTab("profile")}
                  className={`flex items-center gap-1.5 sm:gap-2 p-1 rounded-xl transition-all cursor-pointer text-left ${
                    activeTab === "profile" ? "bg-white/20 ring-1 ring-white/30" : "hover:bg-white/10"
                  }`}
                  title="অ্যাডমিন প্রোফাইল ও সিকিউরিটি হাব"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-[11px] sm:text-xs shadow shrink-0">
                    <Crown size={14} />
                  </div>
                  <div className="hidden lg:block text-left">
                    <span className="text-xs font-bold text-white block leading-tight truncate max-w-[100px]">
                      {adminProfile.name || "Niloy"}
                    </span>
                    <span className="text-[10px] text-amber-300 block leading-tight font-semibold">
                      সুপার অ্যাডমিন
                    </span>
                  </div>
                </button>
                <button
                  onClick={handleAdminLogout}
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
              {activeTab === "profile" && "অ্যাডমিন প্রোফাইল ও সিকিউরিটি কন্ট্রোল সেন্টার"}
              {activeTab === "profitloss" && "লাভ-ক্ষতি ও আর্থিক মার্জিন পূর্ণ বিবরণী"}
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
              {activeTab === "overview" ? "Chartist Chart" : activeTab === "profile" ? "Admin Profile" : activeTab === "profitloss" ? "Profit & Loss" : activeTab}
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
          ) : null}

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* 4 Chartist Cards matching Annex Screenshot (2x2 Grid) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Card 1: Overlapping bars on mobile */}
              <SalesBarChart
                marketplaceTotal={stats.totalRevenue || 0}
                lastWeekTotal={Math.round((stats.totalRevenue || 0) * 0.26)}
                lastMonthTotal={Math.round((stats.totalRevenue || 0) * 0.82)}
              />

              {/* Card 2: Stacked bar chart */}
              <StackedBarChart
                deliveredCount={stats.deliveredOrders || 0}
                processingCount={orders.filter((o) => o.status === "processing" || o.status === "shipped").length || 0}
                pendingCount={orders.filter((o) => o.status === "pending").length || 0}
              />

              {/* Card 3: Animating a Donut with Svg.animate */}
              <DonutWheelChart
                cat1={products.length || 0}
                cat2={vendors.length || 0}
                cat3={stats.totalOrders || 0}
              />

              {/* Card 4: Simple pie chart */}
              <CleanPieChart p1={33} p2={42} p3={25} />
            </div>
            {/* Live Profit & Loss Timeframe Filter Bar */}
            <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <TrendingUp size={16} className="text-emerald-600" />
                    <span>লাভ-ক্ষতি ও আর্থিক মার্জিন বিশ্লেষণ (Live Profit & Loss)</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    ফিল্টার নির্বাচন করে নির্ধারিত সময়সীমার নিট লাভ ও খরচ যাচাই করুন
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("profitloss")}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5064df] hover:underline cursor-pointer"
                >
                  <span>পূর্ণাঙ্গ অডিট টেবিল দেখুন</span>
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Timeframe pill filter buttons */}
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {TIMEFRAME_OPTIONS.map((opt) => {
                  const isActive = plFilter === opt.id;
                  const countInOpt = getOrdersByTimeframe(orders, opt.id).length;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPlFilter(opt.id)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border ${
                        isActive
                          ? "bg-[#303d6e] text-white border-[#303d6e] shadow-xs"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
                      }`}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.shortLabel}</span>
                      <span
                        className={`text-[9px] px-1 py-0.2 rounded-full font-black ${
                          isActive
                            ? "bg-amber-400 text-slate-950"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {countInOpt}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Pending Orders Notice Banner */}
              {plMetrics.pendingOrdersCount > 0 && (
                <div className="bg-amber-50/90 border border-amber-200/90 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 text-amber-900">
                    <Clock size={15} className="text-amber-600 shrink-0" />
                    <span>
                      <strong>{plMetrics.pendingOrdersCount} টি পেন্ডিং অর্ডার</strong> (সম্ভাব্য বিক্রয় ৳ {plMetrics.pendingPotentialRevenue.toLocaleString()}) — আপনার নির্দেশ অনুযায়ী এগুলো এখনও হিসাবে যোগ হয়নি। অর্ডার কনফার্ম করলেই মূল হিসাবে যুক্ত হবে।
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveTab("orders")}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 underline shrink-0 cursor-pointer"
                  >
                    <span>অর্ডার কনফার্ম করুন →</span>
                  </button>
                </div>
              )}
            </div>

            {/* KPI Cards (Dynamic Real Database Tracking with Live Timeframe) */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">মোট বিক্রয়</span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <DollarSign size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">৳ {plMetrics.grossRevenue.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-[11px] text-blue-600 font-bold mt-2">
                  <span>{TIMEFRAME_OPTIONS.find((t) => t.id === plFilter)?.shortLabel}-এর বিক্রয়</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-amber-200/80 bg-amber-50/20 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-800">মোট খরচ (COGS)</span>
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                    <CreditCard size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-amber-950">৳ {plMetrics.totalCogs.toLocaleString()}</div>
                <div className="flex items-center gap-1 text-[11px] text-amber-700 font-semibold mt-2">
                  <span>পণ্যের ক্রয় ও সোর্সিং ব্যয়</span>
                </div>
              </div>

              <div
                className={`bg-white rounded-2xl p-5 border shadow-xs ${
                  plMetrics.isNetProfit ? "border-emerald-200/80 bg-emerald-50/20" : "border-rose-200/80 bg-rose-50/20"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-xs font-bold uppercase tracking-wider ${
                      plMetrics.isNetProfit ? "text-emerald-800" : "text-rose-800"
                    }`}
                  >
                    {plMetrics.isNetProfit ? "মোট নিট লাভ" : "মোট নিট ক্ষতি"}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                      plMetrics.isNetProfit ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {plMetrics.isNetProfit ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                  </div>
                </div>
                <div
                  className={`text-2xl font-black ${
                    plMetrics.isNetProfit ? "text-emerald-700" : "text-rose-600"
                  }`}
                >
                  ৳ {plMetrics.isNetProfit ? "+" : "-"}{Math.abs(plMetrics.netProfit).toLocaleString()}
                </div>
                <div
                  className={`flex items-center gap-1 text-[11px] font-bold mt-2 ${
                    plMetrics.isNetProfit ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  <span>মার্জিন: {plMetrics.profitMargin}%</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ফিল্টারকৃত অর্ডার</span>
                  <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Package size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{plMetrics.totalOrdersCount} টি</div>
                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium mt-2">
                  <span>মোট ডাটাবেজ: {orders.length} টি</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">লাইভ প্রোডাক্ট</span>
                  <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
                    <ShoppingBag size={18} />
                  </div>
                </div>
                <div className="text-2xl font-black text-slate-900">{products.length} টি আইটেম</div>
                <div className="flex items-center gap-1 text-[11px] text-purple-600 font-bold mt-2">
                  <span>স্টক রানিং</span>
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
                      <th className="py-3 px-4">বিক্রয় মূল্য</th>
                      <th className="py-3 px-4">ক্রয় ও খরচ (অ্যাডমিন)</th>
                      <th className="py-3 px-4">সম্ভাব্য লাভ</th>
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
                            <span className="font-bold text-amber-900 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200/70 inline-block text-xs">
                              ৳ {(p.costPrice || 0).toLocaleString()}
                            </span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">ক্রয় + খরচ</span>
                          </td>

                          <td className="py-3 px-4">
                            <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200 inline-block text-xs">
                              +৳ {Math.max(0, (p.basePrice || 0) - (p.costPrice || 0)).toLocaleString()}
                            </span>
                            <span className="text-[9px] text-slate-400 block mt-0.5">মার্জিন</span>
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
                    <th className="py-3 px-4">বিক্রয় মূল্য</th>
                    <th className="py-3 px-4">ক্রয় খরচ (অ্যাডমিন)</th>
                    <th className="py-3 px-4">নিট লাভ</th>
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
                          {(() => {
                            const ordCost = ord.items?.reduce((sum, item) => {
                              const unitCost = Number(item.costPrice) || Number(products.find((p) => p._id === item.productId || p.name === item.name)?.costPrice) || 0;
                              return sum + unitCost * (Number(item.quantity) || 1);
                            }, 0) || 0;
                            return (
                              <div>
                                <span className="font-bold text-amber-900 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-xs inline-block">
                                  ৳ {ordCost.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-slate-400 block mt-0.5">পণ্য ক্রয় ও ভাড়া</span>
                              </div>
                            );
                          })()}
                        </td>

                        <td className="py-3.5 px-4">
                          {(() => {
                            const ordCost = ord.items?.reduce((sum, item) => {
                              const unitCost = Number(item.costPrice) || Number(products.find((p) => p._id === item.productId || p.name === item.name)?.costPrice) || 0;
                              return sum + unitCost * (Number(item.quantity) || 1);
                            }, 0) || 0;
                            const profit = Math.max(0, (Number(ord.grandTotal) || 0) - (Number(ord.deliveryCharge) || 0) - ordCost);

                            if (ord.status === "pending") {
                              return (
                                <div>
                                  <span className="font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-xs inline-block">
                                    সম্ভাব্য ৳ {profit.toLocaleString()}
                                  </span>
                                  <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">⏳ কনফার্মের অপেক্ষায়</span>
                                </div>
                              );
                            }

                            if (ord.status === "cancelled") {
                              return (
                                <div>
                                  <span className="font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-200 text-xs inline-block">
                                    ৳ 0
                                  </span>
                                  <span className="text-[10px] text-rose-500 font-semibold block mt-0.5">বাতিল (বাদ)</span>
                                </div>
                              );
                            }

                            return (
                              <div>
                                <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 text-xs inline-block">
                                  +৳ {profit.toLocaleString()}
                                </span>
                                <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">লাভ (হিসাবে যুক্ত)</span>
                              </div>
                            );
                          })()}
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
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

                            {ord.status === "pending" && (
                              <button
                                type="button"
                                onClick={() => handleStatusChange(ord.invoiceId, "confirmed")}
                                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-xs cursor-pointer transition-all shrink-0"
                                title="অর্ডার কনফার্ম করে লাভ-ক্ষতি ও মূল হিসাবে যোগ করুন"
                              >
                                <CheckCircle2 size={12} />
                                <span>কনফার্ম</span>
                              </button>
                            )}
                          </div>
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
          <div className="max-w-2xl space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-6">
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
                className="w-full mt-4 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 px-4 rounded-xl text-sm transition-all shadow-md cursor-pointer">
                সংরক্ষণ করুন
              </button>
            </div>
          </div>

            {/* Admin Security: Password Change Section */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <ShieldCheck size={18} className="text-indigo-600" />
                  <span>অ্যাডমিন পাসওয়ার্ড পরিবর্তন (Change Admin Password)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  অ্যাডমিন অ্যাকাউন্টের নিরাপত্তা নিশ্চিত করতে নিয়মিত পাসওয়ার্ড আপডেট করুন
                </p>
              </div>

              <form onSubmit={handleChangeAdminPassword} className="space-y-3.5 text-xs">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">
                    বর্তমান পাসওয়ার্ড (Current Password) *
                  </label>
                  <input
                    type="password"
                    required
                    value={changePasswordForm.currentPassword}
                    onChange={(e) =>
                      setChangePasswordForm({ ...changePasswordForm, currentPassword: e.target.value })
                    }
                    placeholder="বর্তমান পাসওয়ার্ড লিখুন"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      নতুন পাসওয়ার্ড (New Password) *
                    </label>
                    <input
                      type="password"
                      required
                      value={changePasswordForm.newPassword}
                      onChange={(e) =>
                        setChangePasswordForm({ ...changePasswordForm, newPassword: e.target.value })
                      }
                      placeholder="কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      নতুন পাসওয়ার্ড নিশ্চিত করুন *
                    </label>
                    <input
                      type="password"
                      required
                      value={changePasswordForm.confirmPassword}
                      onChange={(e) =>
                        setChangePasswordForm({ ...changePasswordForm, confirmPassword: e.target.value })
                      }
                      placeholder="পাসওয়ার্ড পুনরায় লিখুন"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:ring-2 focus:ring-indigo-600"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="bg-[#303d6e] hover:bg-indigo-900 text-white font-black py-2.5 px-5 rounded-xl text-xs transition-all shadow cursor-pointer flex items-center gap-1.5"
                >
                  <Check size={14} /> পাসওয়ার্ড আপডেট করুন
                </button>
              </form>
            </div>

            {/* Offer Popup Modal Toggle (Website Entry Event) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                  <Sparkles size={18} className="text-amber-500" />
                  <span>ওয়েবসাইট এন্ট্রি অফার পপআপ (Website Entry Offer Modal)</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  গ্রাহক ওয়েবসাইটে প্রবেশ করলেই অফারের পপআপ ব্যানার দেখানো হবে কিনা তা এখান থেকে নিয়ন্ত্রণ করুন
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="font-bold text-slate-800 text-xs block">
                    অফার পপআপ স্ট্যাটাস: {isPromoPopupActive ? "🟢 সক্রিয় (Active)" : "🔴 বন্ধ (Inactive)"}
                  </span>
                  <span className="text-[11px] text-slate-500 mt-0.5 block">
                    {isPromoPopupActive
                      ? "বর্তমানে ওয়েবসাইটে ঢুকলে কাস্টমারদের স্পেশাল মেগা অফার পপআপ দেখানো হচ্ছে।"
                      : "পপআপ বর্তমানে বন্ধ রয়েছে। কাস্টমারদের সামনে কোনো অফার পপআপ আসবে না।"}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleTogglePromoPopup(!isPromoPopupActive)}
                  className={`px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shrink-0 ${
                    isPromoPopupActive
                      ? "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200"
                      : "bg-emerald-600 text-white hover:bg-emerald-700 shadow"
                  }`}
                >
                  {isPromoPopupActive ? "পপআপ বন্ধ করুন" : "পপআপ চালু করুন"}
                </button>
              </div>
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

        {/* TAB 8: ADMIN PROFILE & SECURITY MASTER CENTER */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-fadeIn pb-8">
            {/* 1. Luxury Cover Banner & Super Admin Profile Header */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#1e1b4b] border border-indigo-900/40 p-6 sm:p-8 shadow-xl text-white">
              {/* Subtle background glow effect */}
              <div className="absolute -right-16 -top-16 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                  {/* Large Avatar with Gold Crown Badge */}
                  <div className="relative shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-tr from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-black text-3xl shadow-xl ring-4 ring-amber-400/30">
                      <Crown size={38} className="text-slate-950 drop-shadow" />
                    </div>
                    <span
                      className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0f172a] flex items-center justify-center shadow"
                      title="অ্যাডমিন সেশন লাইভ সক্রিয়"
                    >
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    </span>
                  </div>

                  {/* Admin Names & Verification Badges */}
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                        {adminProfile.name}
                      </h2>
                      <span className="inline-flex items-center gap-1 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/40 shadow-xs">
                        <Crown size={12} /> সুপার অ্যাডমিন (HQ)
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                        ● অনলাইন সক্রিয়
                      </span>
                    </div>

                    <p className="text-xs text-indigo-200/90 font-medium flex items-center gap-2 flex-wrap">
                      <span>{adminProfile.designation}</span>
                      <span>•</span>
                      <span>{adminProfile.email}</span>
                      <span>•</span>
                      <span>{adminProfile.phone}</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-slate-300">
                      <span className="bg-white/10 px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-1">
                        <Shield size={12} className="text-emerald-400" /> AES-256 Bit সিকিউর সেশন
                      </span>
                      <span className="bg-white/10 px-2.5 py-1 rounded-xl border border-white/10 flex items-center gap-1">
                        <Globe size={12} className="text-amber-400" /> MongoDB Atlas লাইভ ডাটাবেজ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                    className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer shadow-sm active:scale-95"
                  >
                    <Edit3 size={14} className="text-amber-300" />
                    <span>{isEditingProfile ? "সম্পাদনা বন্ধ করুন" : "প্রোফাইল এডিট করুন"}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const passSection = document.getElementById("admin-password-section");
                      if (passSection) {
                        passSection.scrollIntoView({ behavior: "smooth" });
                      }
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer active:scale-95"
                  >
                    <Key size={14} />
                    <span>পাসওয়ার্ড পরিবর্তন</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleAdminLogout}
                    className="p-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 transition-colors cursor-pointer"
                    title="লগআউট করুন"
                  >
                    <LogOut size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Admin Quick KPI Metrics Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:border-indigo-300 transition-all">
                <div className="w-11 h-11 rounded-xl bg-indigo-50 text-[#5064df] flex items-center justify-center shrink-0 border border-indigo-100">
                  <ShoppingBag size={20} />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                    জুয়েলারি প্রোডাক্টস
                  </span>
                  <p className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                    {products.length} <span className="text-xs font-semibold text-slate-500">টি লাইভ</span>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:border-emerald-300 transition-all">
                <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                  <Package size={20} />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                    সর্বমোট কাস্টমার অর্ডার
                  </span>
                  <p className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                    {orders.length} <span className="text-xs font-semibold text-slate-500">টি প্রসেসড</span>
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:border-amber-300 transition-all">
                <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                  <DollarSign size={20} />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                    সর্বমোট সেলস ভলিউম
                  </span>
                  <p className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                    ৳{stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs flex items-center gap-3.5 hover:border-purple-300 transition-all">
                <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-100">
                  <Store size={20} />
                </div>
                <div className="min-w-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                    রেজিস্টার্ড ভেন্ডর হাব
                  </span>
                  <p className="text-lg sm:text-xl font-black text-slate-900 mt-0.5">
                    {vendors.length} <span className="text-xs font-semibold text-slate-500">টি পার্টনার</span>
                  </p>
                </div>
              </div>
            </div>

            {/* 3. Main 2-Column Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Personal Information & System Authority (Col-span 7) */}
              <div className="lg:col-span-7 space-y-6">
                {/* Card A: Admin Profile Details Form */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-5">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#5064df] flex items-center justify-center">
                        <User size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 tracking-tight">
                          অ্যাডমিন ব্যক্তিগত ও যোগাযোগের তথ্য
                        </h3>
                        <p className="text-xs text-slate-400">
                          সুপার অ্যাডমিনের পরিচয় ও অফিসিয়াল প্রোফাইল বিস্তারিত
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(!isEditingProfile)}
                      className="text-xs font-bold text-[#5064df] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 size={13} />
                      <span>{isEditingProfile ? "ক্যানসেল" : "এডিট করুন"}</span>
                    </button>
                  </div>

                  <form onSubmit={handleSaveAdminProfile} className="space-y-4 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Name */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
                          অ্যাডমিন পূর্ণ নাম (Full Name) *
                        </label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            required
                            value={adminProfile.name}
                            onChange={(e) =>
                              setAdminProfile({ ...adminProfile, name: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                          />
                        ) : (
                          <div className="px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-900 flex items-center justify-between">
                            <span>{adminProfile.name}</span>
                            <span className="text-[10px] font-extrabold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-full">
                              HQ Owner
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Designation */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
                          অফিসিয়াল পদবী (Designation)
                        </label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={adminProfile.designation}
                            onChange={(e) =>
                              setAdminProfile({ ...adminProfile, designation: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                          />
                        ) : (
                          <div className="px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-900">
                            {adminProfile.designation}
                          </div>
                        )}
                      </div>

                      {/* Official Email */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
                          অফিসিয়াল ইমেইল (Admin Email) *
                        </label>
                        {isEditingProfile ? (
                          <input
                            type="email"
                            required
                            value={adminProfile.email}
                            onChange={(e) =>
                              setAdminProfile({ ...adminProfile, email: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                          />
                        ) : (
                          <div className="px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-900 flex items-center justify-between">
                            <span className="truncate">{adminProfile.email}</span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(adminProfile.email);
                                showToast("📋 ইমেইল কপি করা হয়েছে!");
                              }}
                              className="text-slate-400 hover:text-indigo-600 p-1 cursor-pointer"
                              title="কপি করুন"
                            >
                              <Copy size={13} />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Official Phone */}
                      <div>
                        <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
                          অ্যাডমিন ফোন নম্বর (Phone)
                        </label>
                        {isEditingProfile ? (
                          <input
                            type="text"
                            value={adminProfile.phone}
                            onChange={(e) =>
                              setAdminProfile({ ...adminProfile, phone: e.target.value })
                            }
                            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                          />
                        ) : (
                          <div className="px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 font-bold text-slate-900 flex items-center justify-between">
                            <span>{adminProfile.phone}</span>
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(adminProfile.phone);
                                showToast("📋 ফোন নম্বর কপি করা হয়েছে!");
                              }}
                              className="text-slate-400 hover:text-indigo-600 p-1 cursor-pointer"
                              title="কপি করুন"
                            >
                              <Copy size={13} />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Address & HQ */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
                        অফিসিয়াল ঠিকানা ও লোকেশন (HQ Address)
                      </label>
                      {isEditingProfile ? (
                        <input
                          type="text"
                          value={adminProfile.address}
                          onChange={(e) =>
                            setAdminProfile({ ...adminProfile, address: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                        />
                      ) : (
                        <div className="px-3.5 py-2.5 bg-slate-50 rounded-xl border border-slate-200 font-semibold text-slate-800 flex items-center gap-2">
                          <MapPin size={15} className="text-rose-500 shrink-0" />
                          <span>{adminProfile.address}</span>
                        </div>
                      )}
                    </div>

                    {/* Bio / Description */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
                        অ্যাডমিন পরিচিতি ও নোট (About Bio)
                      </label>
                      {isEditingProfile ? (
                        <textarea
                          rows={3}
                          value={adminProfile.bio}
                          onChange={(e) =>
                            setAdminProfile({ ...adminProfile, bio: e.target.value })
                          }
                          className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:ring-2 focus:ring-indigo-600 focus:outline-none"
                        />
                      ) : (
                        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-600 leading-relaxed">
                          {adminProfile.bio}
                        </div>
                      )}
                    </div>

                    {/* Save Button when in editing mode */}
                    {isEditingProfile && (
                      <div className="pt-2 flex items-center gap-3">
                        <button
                          type="submit"
                          disabled={isSavingProfile}
                          className="bg-[#303d6e] hover:bg-indigo-900 text-white font-black py-2.5 px-6 rounded-xl text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2 disabled:opacity-50"
                        >
                          {isSavingProfile ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              <span>সংরক্ষণ হচ্ছে...</span>
                            </>
                          ) : (
                            <>
                              <Check size={14} />
                              <span>প্রোফাইল তথ্য সংরক্ষণ করুন</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsEditingProfile(false)}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          বাতিল করুন
                        </button>
                      </div>
                    )}
                  </form>
                </div>

                {/* Card B: Master Permissions & Access Matrix */}
                <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <ShieldCheck size={18} className="text-emerald-600" />
                        <span>সিস্টেম পারমিশন ও এক্সেস প্রিভিলেজ</span>
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        সুপার অ্যাডমিন অ্যাকাউন্টের সম্পূর্ণ নিয়ন্ত্রণ ও এক্সেস ক্ষমতা
                      </p>
                    </div>
                    <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                      আনলিমিটেড এক্সেস
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900">ক্লাউড ডাটাবেজ এক্সেস</p>
                        <p className="text-[11px] text-slate-500">
                          MongoDB Atlas ক্লাস্টার সরাসরি রিড, রাইট ও অটো সিঙ্ক
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900">প্রোডাক্ট ও ইনভেন্টরি কন্ট্রোল</p>
                        <p className="text-[11px] text-slate-500">
                          জুয়েলারি পোস্ট, স্টক আপডেট ও স্থায়ী রিমুভ করার অধিকার
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900">অর্ডার ও ইনভয়েস ম্যানেজমেন্ট</p>
                        <p className="text-[11px] text-slate-500">
                          কাস্টমার ডেলিভারি স্ট্যাটাস পরিবর্তন ও প্রিন্ট ইনভয়েস
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900">সেলার ও ভেন্ডর অথরাইজেশন</p>
                        <p className="text-[11px] text-slate-500">
                          নতুন মার্চেন্ট দোকান যাচাই, এক্টিভেশন ও সাসপেন্ড
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900">হট অফার ও লাইভ টাইমার</p>
                        <p className="text-[11px] text-slate-500">
                          হোমপেজের ধামাকা অফার কাউন্টডাউন চালু বা বন্ধ রাখা
                        </p>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 border border-slate-200/80 rounded-2xl flex items-start gap-2.5">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-slate-900">পাসওয়ার্ড ও সিকিউরিটি গেট</p>
                        <p className="text-[11px] text-slate-500">
                          অ্যাডমিন মাস্টার পাসওয়ার্ড পরিবর্তন ও সেশন লকআউট
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Password Change & Account Security (Col-span 5) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Card C: Change Password Form (Prominent & Luxury) */}
                <div
                  id="admin-password-section"
                  className="bg-white rounded-3xl p-6 sm:p-7 border border-amber-200/80 shadow-md space-y-5 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-400/10 rounded-full blur-2xl pointer-events-none" />

                  <div className="border-b border-slate-100 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                        <Lock size={20} />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                          <span>অ্যাডমিন পাসওয়ার্ড পরিবর্তন</span>
                          <span className="text-[9px] font-extrabold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                            সিকিউর
                          </span>
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          আপনার অ্যাডমিন অ্যাকাউন্টের গোপনীয় পাসওয়ার্ড পরিবর্তন করুন
                        </p>
                      </div>
                    </div>
                  </div>

                  <form onSubmit={handleChangeAdminPassword} className="space-y-4 text-xs">
                    {/* Current Password */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
                        বর্তমান পাসওয়ার্ড (Current Password) *
                      </label>
                      <div className="relative">
                        <input
                          type={showProfileCurrentPass ? "text" : "password"}
                          required
                          value={changePasswordForm.currentPassword}
                          onChange={(e) =>
                            setChangePasswordForm({
                              ...changePasswordForm,
                              currentPassword: e.target.value,
                            })
                          }
                          placeholder="বর্তমান পাসওয়ার্ডটি লিখুন"
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs"
                        />
                        <Key size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <button
                          type="button"
                          onClick={() => setShowProfileCurrentPass(!showProfileCurrentPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showProfileCurrentPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>
                    </div>

                    {/* New Password */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
                        নতুন পাসওয়ার্ড (New Password) *
                      </label>
                      <div className="relative">
                        <input
                          type={showProfileNewPass ? "text" : "password"}
                          required
                          value={changePasswordForm.newPassword}
                          onChange={(e) =>
                            setChangePasswordForm({
                              ...changePasswordForm,
                              newPassword: e.target.value,
                            })
                          }
                          placeholder="কমপক্ষে ৪ অক্ষরের নতুন পাসওয়ার্ড"
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs"
                        />
                        <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <button
                          type="button"
                          onClick={() => setShowProfileNewPass(!showProfileNewPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showProfileNewPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>

                      {/* Password Strength Indicator */}
                      {changePasswordForm.newPassword && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="font-semibold text-slate-500">পাসওয়ার্ড শক্তি:</span>
                            <span
                              className={`font-black ${
                                getPasswordStrength(changePasswordForm.newPassword).textColor
                              }`}
                            >
                              {getPasswordStrength(changePasswordForm.newPassword).label}
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-300 ${
                                getPasswordStrength(changePasswordForm.newPassword).color
                              }`}
                              style={{
                                width: getPasswordStrength(changePasswordForm.newPassword).width,
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Confirm New Password */}
                    <div>
                      <label className="block font-bold text-slate-700 mb-1.5 uppercase text-[10px] tracking-wider">
                        নতুন পাসওয়ার্ড নিশ্চিত করুন (Confirm Password) *
                      </label>
                      <div className="relative">
                        <input
                          type={showProfileConfirmPass ? "text" : "password"}
                          required
                          value={changePasswordForm.confirmPassword}
                          onChange={(e) =>
                            setChangePasswordForm({
                              ...changePasswordForm,
                              confirmPassword: e.target.value,
                            })
                          }
                          placeholder="নতুন পাসওয়ার্ডটি পুনরায় লিখুন"
                          className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-amber-500 focus:outline-none text-xs"
                        />
                        <ShieldCheck size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                        <button
                          type="button"
                          onClick={() => setShowProfileConfirmPass(!showProfileConfirmPass)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                        >
                          {showProfileConfirmPass ? <EyeOff size={15} /> : <Eye size={15} />}
                        </button>
                      </div>

                      {/* Password Match Status */}
                      {changePasswordForm.confirmPassword && (
                        <div className="mt-1 text-[11px] font-bold">
                          {changePasswordForm.newPassword === changePasswordForm.confirmPassword ? (
                            <span className="text-emerald-600 flex items-center gap-1">
                              ✓ পাসওয়ার্ড দুটি মিলেছে
                            </span>
                          ) : (
                            <span className="text-rose-500 flex items-center gap-1">
                              ✕ পাসওয়ার্ড দুটি মিলছে না
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Submit Buttons */}
                    <div className="pt-2 flex items-center gap-3">
                      <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-98 transition-transform cursor-pointer"
                      >
                        <Check size={15} />
                        <span>পাসওয়ার্ড আপডেট করুন</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setChangePasswordForm({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          })
                        }
                        className="px-3.5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold transition-colors cursor-pointer"
                        title="ফর্ম রিসেট"
                      >
                        ক্লিয়ার
                      </button>
                    </div>
                  </form>
                </div>

                {/* Card D: Active Session & Security Overview */}
                <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-2xs space-y-4">
                  <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                    <div>
                      <h4 className="font-black text-sm text-slate-900 flex items-center gap-2">
                        <Smartphone size={16} className="text-indigo-600" />
                        <span>বর্তমান সেশন ও ডিভাইস নিরাপত্তা</span>
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        অ্যাকাউন্টে সংযুক্ত ডিভাইস ও লাইভ নিরাপত্তা লগ
                      </p>
                    </div>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>

                  <div className="space-y-2.5 text-xs">
                    <div className="p-3 rounded-2xl bg-indigo-50/60 border border-indigo-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-white text-[#5064df] flex items-center justify-center font-bold text-xs shadow-xs">
                          💻
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">Chrome (Windows 11)</p>
                          <p className="text-[10px] text-slate-500">বর্তমান সক্রিয় সেশন • ঢাকা, বাংলাদেশ</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                        Active Now
                      </span>
                    </div>

                    <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-white text-slate-600 flex items-center justify-center font-bold text-xs shadow-xs">
                          🛡️
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">নিরাপত্তা এনক্রিপশন</p>
                          <p className="text-[10px] text-slate-500">TLS 1.3 / HTTPS End-to-End Secure</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-700 bg-indigo-100 px-2 py-0.5 rounded-full">
                        Verified
                      </span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => showToast("🔄 সকল সক্রিয় সেশন রিফ্রেশ করা হয়েছে!")}
                      className="text-xs font-bold text-[#5064df] hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw size={13} />
                      <span>সেশন রিফ্রেশ করুন</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleAdminLogout}
                      className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <LogOut size={13} />
                      <span>লগআউট করুন</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* TAB 9: PROFIT & LOSS MASTER FINANCIAL STATEMENT */}
        {activeTab === "profitloss" && (
          <div className="space-y-6 animate-fadeIn pb-8">
            {/* 1. Header Banner & Financial Audit Cover */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#064e3b] border border-emerald-900/40 p-6 sm:p-8 shadow-xl text-white">
              <div className="absolute -right-16 -top-16 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -left-16 -bottom-16 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                      <TrendingUp size={22} />
                    </div>
                    <div>
                      <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                        <span>লাভ-ক্ষতি ও আর্থিক মার্জিন পূর্ণ বিবরণী</span>
                        <span className="text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/40">
                          লাইভ অডিট
                        </span>
                      </h2>
                      <p className="text-xs text-emerald-200/90 font-medium">
                        রিয়েল-টাইম বিক্রয়, ক্রয় ব্যয়, কুরিয়ার চার্জ এবং নিট মুনাফা বিশ্লেষণ
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300">
                    <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl border border-white/10">
                      <span>নির্বাচিত সময়:</span>
                      <strong className="text-amber-300">
                        {TIMEFRAME_OPTIONS.find((t) => t.id === plFilter)?.label}
                      </strong>
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl border border-white/10">
                      <span>মোট অর্ডার:</span>
                      <strong className="text-emerald-300">{plMetrics.totalOrdersCount} টি</strong>
                    </span>
                    <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1 rounded-xl border border-white/10">
                      <span>নিট মার্জিন:</span>
                      <strong className={plMetrics.isNetProfit ? "text-emerald-300" : "text-rose-300"}>
                        {plMetrics.profitMargin}%
                      </strong>
                    </span>
                  </div>
                </div>

                {/* Print & Refresh Buttons */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs flex items-center gap-2 border border-white/20 transition-all cursor-pointer shadow-sm active:scale-95"
                    title="প্রিন্ট বা PDF হিসেবে সংরক্ষণ করুন"
                  >
                    <Printer size={15} />
                    <span>স্টেটমেন্ট প্রিন্ট</span>
                  </button>

                  <button
                    type="button"
                    onClick={loadData}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all cursor-pointer active:scale-95"
                    title="ডাটাবেজ থেকে রিলোড করুন"
                  >
                    <RefreshCw size={15} className={isLoading ? "animate-spin" : ""} />
                    <span>রিফ্রেশ</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Interactive Timeframe Filter Bar (৭টি অপশন) */}
            <div className="bg-white rounded-2xl p-3 sm:p-4 border border-slate-200/90 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2.5">
                <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Clock size={14} className="text-[#303d6e]" />
                  <span>সময়সীমা নির্বাচন করুন (Select Timeframe Filter):</span>
                </span>
                <span className="text-[11px] text-slate-500">
                  ফিল্টার ক্লিক করলেই লাভ-ক্ষতি তাৎক্ষণিক পরিবর্তন হবে
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {TIMEFRAME_OPTIONS.map((opt) => {
                  const isActive = plFilter === opt.id;
                  const countInOpt = getOrdersByTimeframe(orders, opt.id).length;
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setPlFilter(opt.id)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 cursor-pointer border ${
                        isActive
                          ? "bg-[#303d6e] text-white border-[#303d6e] shadow-md shadow-indigo-950/20 scale-[1.02]"
                          : "bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200/80"
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{opt.icon}</span>
                        <span>{opt.shortLabel}</span>
                      </div>
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                          isActive
                            ? "bg-amber-400 text-slate-950"
                            : "bg-slate-200 text-slate-600"
                        }`}
                      >
                        {countInOpt} টি অর্ডার
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Pending Notice in Profit & Loss Tab */}
            {plMetrics.pendingOrdersCount > 0 && (
              <div className="bg-amber-50/90 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs">
                <div className="flex items-center gap-2.5 text-amber-900">
                  <div className="w-8 h-8 rounded-xl bg-amber-200/80 text-amber-800 flex items-center justify-center shrink-0">
                    <Clock size={16} />
                  </div>
                  <div>
                    <p className="font-bold text-amber-950">
                      {plMetrics.pendingOrdersCount} টি অর্ডার এখনও পেন্ডিং (সম্ভাব্য বিক্রয় ৳ {plMetrics.pendingPotentialRevenue.toLocaleString()})
                    </p>
                    <p className="text-[11px] text-amber-700 mt-0.5">
                      আপনার চাওয়া অনুযায়ী এগুলো পেন্ডিং অবস্থায় রয়েছে এবং হিসাবে যোগ হয়নি। আপনি অর্ডার কনফার্ম করলেই এগুলো মোট বিক্রয় ও নিট লাভে যোগ হবে।
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("orders")}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shrink-0 cursor-pointer shadow-xs transition-colors"
                >
                  <span>পেন্ডিং অর্ডার কনফার্ম করুন →</span>
                </button>
              </div>
            )}

            {/* 3. 5 Core Financial Summary Metric Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
              {/* Card 1: Gross Sales Revenue */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:border-indigo-300 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                    মোট বিক্রয় রেভিনিউ
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <DollarSign size={17} />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-slate-900">
                  ৳ {plMetrics.grossRevenue.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-blue-600 font-semibold mt-1.5">
                  <span>গ্রাহকদের মোট ক্রয় মূল্য</span>
                </div>
              </div>

              {/* Card 2: Cost of Goods Sold (COGS) */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-amber-200/80 bg-amber-50/15 shadow-2xs hover:border-amber-300 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block truncate">
                    পণ্যের ক্রয় ও সোর্সিং খরচ
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <CreditCard size={17} />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-950">
                  ৳ {plMetrics.totalCogs.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-amber-700 font-semibold mt-1.5">
                  <span>পাইকারি বা তৈরির মোট ব্যয়</span>
                </div>
              </div>

              {/* Card 3: Courier Delivery Charge */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-purple-200/80 bg-purple-50/15 shadow-2xs hover:border-purple-300 transition-all">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-purple-800 block truncate">
                    কুরিয়ার ডেলিভারি চার্জ
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                    <Truck size={17} />
                  </div>
                </div>
                <div className="text-xl sm:text-2xl font-black text-purple-950">
                  ৳ {plMetrics.totalDelivery.toLocaleString()}
                </div>
                <div className="flex items-center gap-1 text-[10px] text-purple-700 font-semibold mt-1.5">
                  <span>শিপিং পার্টনারদের প্রদেয় চার্জ</span>
                </div>
              </div>

              {/* Card 4: Net Profit or Net Loss */}
              <div
                className={`rounded-2xl p-4 sm:p-5 border shadow-2xs transition-all ${
                  plMetrics.isNetProfit
                    ? "bg-emerald-50/40 border-emerald-300 text-emerald-950"
                    : "bg-rose-50/40 border-rose-300 text-rose-950"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[11px] font-bold uppercase tracking-wider block truncate ${
                      plMetrics.isNetProfit ? "text-emerald-800" : "text-rose-800"
                    }`}
                  >
                    {plMetrics.isNetProfit ? "মোট নিট লাভ (Net Profit)" : "মোট নিট ক্ষতি (Net Loss)"}
                  </span>
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      plMetrics.isNetProfit
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-rose-100 text-rose-700"
                    }`}
                  >
                    {plMetrics.isNetProfit ? <TrendingUp size={17} /> : <TrendingDown size={17} />}
                  </div>
                </div>
                <div
                  className={`text-xl sm:text-2xl font-black ${
                    plMetrics.isNetProfit ? "text-emerald-700" : "text-rose-600"
                  }`}
                >
                  ৳ {plMetrics.isNetProfit ? "+" : "-"}
                  {Math.abs(plMetrics.netProfit).toLocaleString()}
                </div>
                <div
                  className={`flex items-center gap-1 text-[10px] font-bold mt-1.5 ${
                    plMetrics.isNetProfit ? "text-emerald-700" : "text-rose-700"
                  }`}
                >
                  <span>{plMetrics.isNetProfit ? "লাভ = বিক্রয় - ক্রয় - ডেলিভারি" : "খরচ বিক্রয়ের চেয়ে বেশি"}</span>
                </div>
              </div>

              {/* Card 5: Net Profit Margin % */}
              <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all col-span-2 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block truncate">
                    নিট লাভের মার্জিন
                  </span>
                  <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <Percent size={17} />
                  </div>
                </div>
                <div
                  className={`text-xl sm:text-2xl font-black ${
                    Number(plMetrics.profitMargin) >= 30
                      ? "text-emerald-600"
                      : Number(plMetrics.profitMargin) > 0
                      ? "text-amber-600"
                      : "text-slate-600"
                  }`}
                >
                  {plMetrics.profitMargin}%
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 font-semibold mt-1.5">
                  <span>
                    {Number(plMetrics.profitMargin) >= 30
                      ? "উচ্চ মুনাফা সম্পন্ন"
                      : Number(plMetrics.profitMargin) > 0
                      ? "স্বাভাবিক মুনাফা"
                      : "কোনো মুনাফা নেই"}
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Visual Financial Split Bar (প্রতি ১০০ টাকার বণ্টন) */}
            {plMetrics.grossRevenue > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-black text-slate-800 flex items-center gap-2">
                    <span>📊 বিক্রয়মূল্যের শতকরা বণ্টন (Revenue & Cost Split):</span>
                  </span>
                  <span className="text-slate-500 text-[11px]">
                    মোট রাজস্ব: ৳{plMetrics.grossRevenue.toLocaleString()}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-100 rounded-full h-3.5 flex overflow-hidden shadow-inner">
                  {/* COGS Portion */}
                  <div
                    className="bg-amber-500 transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((plMetrics.totalCogs / plMetrics.grossRevenue) * 100)
                      )}%`,
                    }}
                    title={`পণ্যের ক্রয় খরচ: ৳${plMetrics.totalCogs}`}
                  />
                  {/* Delivery Portion */}
                  <div
                    className="bg-purple-500 transition-all"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.round((plMetrics.totalDelivery / plMetrics.grossRevenue) * 100)
                      )}%`,
                    }}
                    title={`ডেলিভারি খরচ: ৳${plMetrics.totalDelivery}`}
                  />
                  {/* Net Profit Portion */}
                  {plMetrics.isNetProfit && (
                    <div
                      className="bg-emerald-500 transition-all"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((plMetrics.netProfit / plMetrics.grossRevenue) * 100)
                        )}%`,
                      }}
                      title={`নিট লাভ: ৳${plMetrics.netProfit}`}
                    />
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-between text-[11px] font-bold text-slate-600 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span>
                      পণ্যের ক্রয় খরচ:{" "}
                      {Math.round((plMetrics.totalCogs / plMetrics.grossRevenue) * 100)}% (৳
                      {plMetrics.totalCogs.toLocaleString()})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                    <span>
                      কুরিয়ার শিপিং:{" "}
                      {Math.round((plMetrics.totalDelivery / plMetrics.grossRevenue) * 100)}% (৳
                      {plMetrics.totalDelivery.toLocaleString()})
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-emerald-700">
                      নিট লাভ: {plMetrics.profitMargin}% (৳
                      {plMetrics.netProfit.toLocaleString()})
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* 5. Granular Order-by-Order Profit Breakdown Table */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-2xs overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
                <div>
                  <h3 className="font-black text-base text-slate-900 tracking-tight flex items-center gap-2">
                    <Package size={18} className="text-[#303d6e]" />
                    <span>অর্ডারভিত্তিক লাভ-ক্ষতি অডিট লগ (Order-by-Order Breakdown)</span>
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    নির্বাচিত সময়সীমা ({TIMEFRAME_OPTIONS.find((t) => t.id === plFilter)?.label})-এর প্রতিটি অর্ডারের সঠিক হিসাব
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-indigo-50 text-[#5064df] px-3 py-1.5 rounded-xl border border-indigo-200/60">
                    ফিল্টারকৃত মোট: {plOrders.length} টি অর্ডার
                  </span>
                </div>
              </div>

              {plOrders.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100/70 border-b border-slate-200 text-slate-600 font-black uppercase text-[10px] tracking-wider">
                        <th className="py-3.5 px-4">ইনভয়েস ও তারিখ</th>
                        <th className="py-3.5 px-4">গ্রাহকের নাম ও ফোন</th>
                        <th className="py-3.5 px-4">আইটেম সংখ্যা</th>
                        <th className="py-3.5 px-4 text-right">বিক্রয় মূল্য</th>
                        <th className="py-3.5 px-4 text-right">ক্রয় খরচ (COGS)</th>
                        <th className="py-3.5 px-4 text-right">ডেলিভারি</th>
                        <th className="py-3.5 px-4 text-right">নিট লাভ / ক্ষতি</th>
                        <th className="py-3.5 px-4 text-center">মার্জিন</th>
                        <th className="py-3.5 px-4 text-center">স্ট্যাটাস</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {plOrders.map((ord, idx) => {
                        const orderSale = Number(ord.grandTotal) || Number(ord.subtotal) || 0;
                        const orderCost =
                          ord.items?.reduce((iSum, item) => {
                            return iSum + getItemUnitCost(item) * (Number(item.quantity) || 1);
                          }, 0) || 0;
                        const orderDelivery = Number(ord.deliveryCharge) || 0;
                        const orderNet = (Number(ord.subtotal) || orderSale) - orderCost;
                        const isOrderProfit = orderNet >= 0;
                        const orderMargin =
                          orderSale > 0 ? ((orderNet / orderSale) * 100).toFixed(1) : "0.0";

                        const orderDate = new Date(ord.createdAt);
                        const formattedDate = !isNaN(orderDate.getTime())
                          ? orderDate.toLocaleDateString("bn-BD", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })
                          : "আজ";

                        return (
                          <tr
                            key={ord._id || ord.invoiceId || idx}
                            className="hover:bg-slate-50/80 transition-colors"
                          >
                            {/* Invoice & Date */}
                            <td className="py-3.5 px-4">
                              <span className="font-mono font-black text-slate-900 block">
                                {ord.invoiceId}
                              </span>
                              <span className="text-[11px] text-slate-400 block mt-0.5">
                                {formattedDate}
                              </span>
                            </td>

                            {/* Customer */}
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-slate-800 block">
                                {ord.customer?.name || "গ্রাহক"}
                              </span>
                              <span className="text-[11px] text-slate-500 font-mono block">
                                {ord.customer?.phone || "-"}
                              </span>
                            </td>

                            {/* Items count */}
                            <td className="py-3.5 px-4">
                              <span className="font-bold text-slate-700">
                                {ord.items?.length || 1} টি পণ্য
                              </span>
                            </td>

                            {/* Sales Price */}
                            <td className="py-3.5 px-4 text-right font-black text-slate-900">
                              ৳ {orderSale.toLocaleString()}
                            </td>

                            {/* COGS Cost */}
                            <td className="py-3.5 px-4 text-right font-bold text-amber-800">
                              ৳ {orderCost.toLocaleString()}
                            </td>

                            {/* Delivery Charge */}
                            <td className="py-3.5 px-4 text-right font-semibold text-purple-800">
                              ৳ {orderDelivery.toLocaleString()}
                            </td>

                            {/* Net Profit / Loss */}
                            <td className="py-3.5 px-4 text-right">
                              {ord.status === "pending" ? (
                                <div>
                                  <span className="inline-block font-bold text-xs px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 border border-amber-200">
                                    সম্ভাব্য ৳ {Math.abs(orderNet).toLocaleString()}
                                  </span>
                                  <span className="text-[10px] text-amber-700 font-semibold block mt-0.5">
                                    ⏳ কনফার্মের অপেক্ষায়
                                  </span>
                                </div>
                              ) : ord.status === "cancelled" ? (
                                <div>
                                  <span className="inline-block font-medium text-xs px-2.5 py-1 rounded-lg bg-slate-100 text-slate-500">
                                    ৳ 0
                                  </span>
                                  <span className="text-[10px] text-rose-500 font-semibold block mt-0.5">
                                    বাতিল (হিসাবে নেই)
                                  </span>
                                </div>
                              ) : (
                                <div>
                                  <span
                                    className={`inline-block font-black text-xs px-2.5 py-1 rounded-lg ${
                                      isOrderProfit
                                        ? "bg-emerald-100 text-emerald-800"
                                        : "bg-rose-100 text-rose-800"
                                    }`}
                                  >
                                    {isOrderProfit ? "+" : "-"}৳ {Math.abs(orderNet).toLocaleString()}
                                  </span>
                                  <span className="text-[10px] text-emerald-600 font-bold block mt-0.5">
                                    হিসাবে যুক্ত
                                  </span>
                                </div>
                              )}
                            </td>

                            {/* Margin % */}
                            <td className="py-3.5 px-4 text-center">
                              <span
                                className={`text-[11px] font-black ${
                                  ord.status === "pending"
                                    ? "text-amber-600"
                                    : Number(orderMargin) >= 30
                                    ? "text-emerald-600"
                                    : Number(orderMargin) > 0
                                    ? "text-amber-600"
                                    : "text-rose-600"
                                }`}
                              >
                                {orderMargin}% {ord.status === "pending" && <span className="text-[9px] block text-amber-600 font-normal">(সম্ভাব্য)</span>}
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4 text-center">
                              <div className="flex flex-col items-center gap-1.5">
                                <span
                                  className={`inline-block text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                                    ord.status === "delivered"
                                      ? "bg-emerald-100 text-emerald-800"
                                      : ord.status === "pending"
                                      ? "bg-amber-100 text-amber-800"
                                      : ord.status === "cancelled"
                                      ? "bg-rose-100 text-rose-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {ord.status === "delivered"
                                    ? "ডেলিভার্ড"
                                    : ord.status === "pending"
                                    ? "পেন্ডিং"
                                    : ord.status === "cancelled"
                                    ? "বাতিল"
                                    : "প্রসেসিং"}
                                </span>

                                {ord.status === "pending" && (
                                  <button
                                    type="button"
                                    onClick={() => handleStatusChange(ord.invoiceId, "confirmed")}
                                    className="px-2 py-0.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[10px] cursor-pointer transition-colors shadow-2xs flex items-center gap-0.5"
                                    title="অর্ডার কনফার্ম করে হিসাবে যোগ করুন"
                                  >
                                    <CheckCircle2 size={10} />
                                    <span>কনফার্ম</span>
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-12 text-center space-y-3">
                  <div className="w-16 h-16 rounded-3xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                    <TrendingUp size={28} />
                  </div>
                  <h4 className="text-base font-bold text-slate-800">
                    এই সময়সীমার মধ্যে কোনো অর্ডার পাওয়া যায়নি
                  </h4>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    {TIMEFRAME_OPTIONS.find((t) => t.id === plFilter)?.label} ফিল্টারের আওতায় কোনো অর্ডার ডাটাবেজে জমা নেই। অন্য কোনো সময়সীমা (যেমন: 'সকল সময়') নির্বাচন করে দেখুন।
                  </p>
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setPlFilter("all")}
                      className="bg-indigo-50 hover:bg-indigo-100 text-[#5064df] font-bold px-4 py-2 rounded-xl text-xs border border-indigo-200 cursor-pointer"
                    >
                      সকল সময় (All Time) দেখুন
                    </button>
                  </div>
                </div>
              )}
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
                  <label className="block font-bold text-slate-700 mb-1">বিক্রয় মূল্য (৳)</label>
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
                  <label className="block font-bold text-slate-700 mb-1">
                    ক্রয় ও খরচ মূল্য (৳)
                    <span className="text-[10px] text-amber-700 font-bold ml-1">(অ্যাডমিন)</span>
                  </label>
                  <input
                    type="number"
                    value={editingProduct.costPrice || ""}
                    onChange={(e) =>
                      setEditingProduct({ ...editingProduct, costPrice: Number(e.target.value) })
                    }
                    placeholder="পণ্য ক্রয় + গাড়িভাড়া/খরচ"
                    className="w-full px-3 py-2 bg-amber-50/70 border border-amber-300 rounded-xl font-bold text-amber-950"
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

      {/* CONFIRMATION DIALOG MODAL (Replaces native browser confirm/alert) */}
      {confirmModal?.isOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 text-center space-y-4 animate-scaleUp">
            <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center mx-auto shadow-xs">
              <Trash2 size={26} className="text-rose-600" />
            </div>

            <div>
              <h3 className="font-black text-lg text-slate-900 tracking-tight">
                {confirmModal.title}
              </h3>
              <p className="text-xs text-slate-500 mt-2 leading-relaxed px-1">
                {confirmModal.message}
              </p>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200/80 text-[11px] text-amber-800 font-medium text-left flex items-center gap-2">
              <AlertCircle size={15} className="shrink-0 text-amber-600" />
              <span>সতর্কতা: মুছে ফেলার পর এই তথ্য আর ফিরিয়ে আনা যাবে না।</span>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100">
              <button
                type="button"
                disabled={isConfirmLoading}
                onClick={() => setConfirmModal(null)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {confirmModal.cancelText || "বাতিল"}
              </button>
              <button
                type="button"
                disabled={isConfirmLoading}
                onClick={() => confirmModal.onConfirm()}
                className="flex-1 py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-95 text-white font-bold text-xs shadow-md shadow-rose-600/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isConfirmLoading ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>মুছে ফেলা হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={14} />
                    <span>{confirmModal.confirmText || "মুছে ফেলুন"}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
