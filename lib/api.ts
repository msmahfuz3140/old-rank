import { ICategory, IProduct, IVendor, IDeliveryZone } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";

// Rich fallback data for immediate demo resilience
export const fallbackCategories: ICategory[] = [
  {
    _id: "c1",
    name: "Electronics & Gadgets",
    slug: "electronics",
    icon: "Cpu",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=500&auto=format&fit=crop&q=60",
    level: 1,
    subcategories: [
      { _id: "sc1", name: "PC & Laptops", slug: "laptop", level: 2 },
      { _id: "sc2", name: "Smart TV & Monitor", slug: "tv-monitor", level: 2 },
      { _id: "sc3", name: "Headphones & Audio", slug: "audio", level: 2 },
    ],
  },
  {
    _id: "c6",
    name: "Women's Fashion",
    slug: "womens-fashion",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500&auto=format&fit=crop&q=80",
    level: 1,
    subcategories: [
      { _id: "sc6", name: "Traditional Saree", slug: "saree", level: 2 },
      { _id: "sc7", name: "Salwar Kameez", slug: "salwar-kameez", level: 2 },
      { _id: "sc8", name: "Ladies Bags & Shoes", slug: "bags-shoes", level: 2 },
    ],
  },
  {
    _id: "c7",
    name: "Baby & Kids",
    slug: "baby-kids",
    icon: "Smile",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&auto=format&fit=crop&q=80",
    level: 1,
    subcategories: [
      { _id: "sc9", name: "Baby Clothing", slug: "baby-clothing", level: 2 },
      { _id: "sc10", name: "Feeding & Care", slug: "feeding-care", level: 2 },
      { _id: "sc11", name: "Toys & Strollers", slug: "toys-strollers", level: 2 },
    ],
  },
  {
    _id: "c8",
    name: "Home & Kitchen Electric",
    slug: "home-appliances",
    icon: "Zap",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=500&auto=format&fit=crop&q=80",
    level: 1,
    subcategories: [
      { _id: "sc12", name: "Air Fryer & Cooker", slug: "air-fryer", level: 2 },
      { _id: "sc13", name: "Blender & Grinder", slug: "blender", level: 2 },
      { _id: "sc14", name: "Robot Vacuum & Iron", slug: "vacuum-iron", level: 2 },
    ],
  },
  {
    _id: "c2",
    name: "Men's Fashion",
    slug: "fashion",
    icon: "Shirt",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=500&auto=format&fit=crop&q=60",
    level: 1,
    subcategories: [
      { _id: "sc4", name: "Casual & Formal Shirt", slug: "shirt", level: 2 },
      { _id: "sc5", name: "Chino & Denim Pant", slug: "pant", level: 2 },
    ],
  },
  {
    _id: "c9",
    name: "Beauty & Cosmetics",
    slug: "beauty-cosmetics",
    icon: "Heart",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&auto=format&fit=crop&q=80",
    level: 1,
  },
  {
    _id: "c3",
    name: "Smart Watch",
    slug: "smart-watch",
    icon: "Watch",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
    level: 1,
  },
  {
    _id: "c5",
    name: "Digital Items",
    slug: "digital-items",
    icon: "Sparkles",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500&auto=format&fit=crop&q=60",
    level: 1,
  },
];

export const fallbackProducts: IProduct[] = [
  // ============================================
  // 1. ELECTRONICS & GADGETS
  // ============================================
  {
    _id: "p1",
    name: "Intel Core i5 Desktop Computer Full Setup Gaming PC",
    slug: "intel-core-i5-desktop-computer-full-setup",
    shortDescription: "Customizable 16GB RAM, 512GB NVMe SSD, 1TB HDD & 24 Inch IPS Frameless Monitor",
    description: "Experience ultra-fast computing and gaming with Intel Core i5 processor. Features high-speed DDR4 RAM, lightning fast M.2 NVMe SSD, dedicated cooling fans, RGB gaming casing, and 3 Years official warranty.",
    category: { _id: "c1", name: "Electronics & Gadgets", slug: "electronics" },
    vendor: { _id: "v1", shopName: "Gadget King BD", slug: "gadget-king", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&auto=format&fit=crop&q=80",
    ],
    basePrice: 42500,
    oldPrice: 48000,
    discountPercentage: 11,
    sku: "PC-I5-2026",
    stock: 15,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 28,
    tags: ["pc", "desktop", "gaming", "intel", "computer"],
    variants: [
      { colorName: "Matte Black", colorHex: "#000000", sizeName: "16GB RAM / 512GB SSD", price: 42500, stock: 10, sku: "PC-BLK-16" },
      { colorName: "RGB White", colorHex: "#ffffff", sizeName: "32GB RAM / 1TB SSD", price: 49500, stock: 5, sku: "PC-WHT-32" },
    ],
  },
  {
    _id: "p_e2",
    name: "Active Noise Cancelling (ANC) Wireless Bluetooth Earbuds Pro",
    slug: "active-noise-cancelling-wireless-earbuds-pro",
    shortDescription: "35dB Active Noise Cancellation, 40H Battery Life, Deep Bass & Fast Wireless Charging",
    description: "Premium studio sound with 13mm composite titanium diaphragm drivers. Features environmental noise cancellation for crystal clear calls, touch controls, and ultra-low gaming latency mode.",
    category: { _id: "c1", name: "Electronics & Gadgets", slug: "electronics" },
    vendor: { _id: "v1", shopName: "Gadget King BD", slug: "gadget-king", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80",
    ],
    basePrice: 1850,
    oldPrice: 2600,
    discountPercentage: 29,
    sku: "ANC-EAR-01",
    stock: 65,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 115,
    tags: ["earbuds", "audio", "bluetooth", "wireless", "anc"],
    variants: [
      { colorName: "Pure White", colorHex: "#ffffff", sizeName: "Standard", price: 1850, stock: 40, sku: "ANC-WHT" },
      { colorName: "Carbon Black", colorHex: "#111827", sizeName: "Standard", price: 1850, stock: 25, sku: "ANC-BLK" },
    ],
  },
  {
    _id: "p_e3",
    name: "Smart 4K HDR Frameless Android Voice Control LED TV 43 Inch",
    slug: "smart-4k-frameless-android-led-tv-43-inch",
    shortDescription: "Official Google Certified Android 13, Dolby Audio, Dual Band WiFi & Bluetooth Remote",
    description: "Ultra-vivid 4K Ultra HD IPS display with HDR10+ support. Comes with pre-installed Netflix, YouTube, Prime Video, Google Assistant voice search, and 20W box speakers with Dolby Atmos support.",
    category: { _id: "c1", name: "Electronics & Gadgets", slug: "electronics" },
    vendor: { _id: "v1", shopName: "Gadget King BD", slug: "gadget-king", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80",
    galleryImages: [],
    basePrice: 26500,
    oldPrice: 32000,
    discountPercentage: 17,
    sku: "TV-43-4K",
    stock: 20,
    isHotDeal: false,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 53,
    tags: ["tv", "smart tv", "4k", "android", "led", "entertainment"],
  },
  {
    _id: "p_e4",
    name: "65W Super Fast PD Power Bank 20000mAh with Digital LED Display",
    slug: "65w-super-fast-pd-power-bank-20000mah",
    shortDescription: "Laptop & Smartphone Fast Charging with 3 Outputs, Aircraft Safe & Multi-Protection",
    description: "High-capacity 20,000mAh polymer battery capable of charging iPhones up to 50% in just 25 minutes. Features Type-C 65W bidirectional fast charge, real-time battery percentage display, and durable aluminum alloy shell.",
    category: { _id: "c1", name: "Electronics & Gadgets", slug: "electronics" },
    vendor: { _id: "v1", shopName: "Gadget King BD", slug: "gadget-king", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1609592426809-54876b567d16?w=800&auto=format&fit=crop&q=80",
    basePrice: 2200,
    oldPrice: 2900,
    discountPercentage: 24,
    sku: "PB-65W-20K",
    stock: 45,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 84,
    tags: ["powerbank", "fast charging", "battery", "laptop charger"],
  },
  {
    _id: "p_e8",
    name: "Rechargeable 360° Portable Bladeless Silent Neck Fan",
    slug: "rechargeable-portable-bladeless-silent-neck-fan",
    shortDescription: "Hands-Free Cooling with 3 Speed Modes, 4000mAh Battery & All-Day Comfort",
    description: "Innovative twin turbine design delivers gentle 360-degree cool breeze around your neck and face without hair tangling. Whisper-quiet brushless motor lasts up to 10 hours on a single USB Type-C charge.",
    category: { _id: "c1", name: "Electronics & Gadgets", slug: "electronics" },
    vendor: { _id: "v1", shopName: "Gadget King BD", slug: "gadget-king", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&auto=format&fit=crop&q=80",
    basePrice: 890,
    oldPrice: 1350,
    discountPercentage: 34,
    sku: "FAN-NECK-01",
    stock: 80,
    isHotDeal: true,
    isFeatured: false,
    rating: 4.7,
    reviewCount: 79,
    tags: ["fan", "summer", "portable", "neck fan", "rechargeable"],
  },
  {
    _id: "p2",
    name: "Ultra Modern Smartwatch Series 9 with AMOLED Display",
    slug: "ultra-modern-smartwatch-series-9",
    shortDescription: "Bluetooth Calling, Heart Rate, SpO2 & Wireless Fast Charging",
    description: "Premium smartwatch with crisp 2.04 inch AMOLED curved display. Supports dual-mode Bluetooth calling, 100+ sports modes, 7-day battery life, and IP68 waterproof rating.",
    category: { _id: "c3", name: "Smart Watch", slug: "smart-watch" },
    vendor: { _id: "v1", shopName: "Gadget King BD", slug: "gadget-king", isVerified: true, rating: 4.8 },
    mainImage: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80",
    ],
    basePrice: 2850,
    oldPrice: 3800,
    discountPercentage: 25,
    sku: "WATCH-S9-PRO",
    stock: 40,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 65,
    tags: ["watch", "smartwatch", "fitness", "bluetooth calling"],
    variants: [
      { colorName: "Midnight Black", colorHex: "#111827", sizeName: "45mm", price: 2850, stock: 20, sku: "SW-BLK" },
      { colorName: "Starlight Silver", colorHex: "#e5e7eb", sizeName: "45mm", price: 2850, stock: 15, sku: "SW-SLV" },
    ],
  },

  // ============================================
  // 2. WOMEN'S FASHION & BEAUTY (মেয়েদের আইটেম)
  // ============================================
  {
    _id: "p_w1",
    name: "Exclusive Traditional Handwoven Silk Jamdani Saree (হাতে বোনা জামদানি শাড়ি)",
    slug: "exclusive-traditional-handwoven-silk-jamdani-saree",
    shortDescription: "Pure Resham Silk with Elegant Golden Zari Weaving & Matching Blouse Piece",
    description: "Mastercrafted by traditional weavers of Dhaka. Features authentic intricate floral boota work with soft, breathable pure silk drape. Perfect for weddings, formal festivals, and celebratory occasions.",
    category: { _id: "c6", name: "Women's Fashion", slug: "womens-fashion" },
    vendor: { _id: "v3", shopName: "Aarong Luxury Mart", slug: "aarong-luxury", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80",
    galleryImages: [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80",
    ],
    basePrice: 3850,
    oldPrice: 5200,
    discountPercentage: 26,
    sku: "SAR-JAM-01",
    stock: 25,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 64,
    tags: ["saree", "jamdani", "traditional", "women", "silk", "eid collection"],
    variants: [
      { colorName: "Crimson Red", colorHex: "#dc2626", sizeName: "Free Size (12 Haat)", price: 3850, stock: 10, sku: "SAR-RED" },
      { colorName: "Royal Navy", colorHex: "#1e3a8a", sizeName: "Free Size (12 Haat)", price: 3850, stock: 8, sku: "SAR-NVY" },
      { colorName: "Emerald Green", colorHex: "#059669", sizeName: "Free Size (12 Haat)", price: 3850, stock: 7, sku: "SAR-GRN" },
    ],
  },
  {
    _id: "p_w2",
    name: "Designer Embroidered Georgette Salwar Kameez 3-Piece (জর্জেট পার্টি থ্রি-পিস)",
    slug: "designer-embroidered-georgette-salwar-kameez-3-piece",
    shortDescription: "Heavy Thread & Sequence Work with Butter Silk Inner & Chiffon Dupatta",
    description: "Stunning three-piece suit designed with premium georgette fabric and luxurious embroidery on neck, sleeves, and daman. Includes comfortable santoon bottom and digital printed dupatta.",
    category: { _id: "c6", name: "Women's Fashion", slug: "womens-fashion" },
    vendor: { _id: "v3", shopName: "Aarong Luxury Mart", slug: "aarong-luxury", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80",
    basePrice: 2950,
    oldPrice: 3800,
    discountPercentage: 22,
    sku: "SK-GEORG-02",
    stock: 35,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 47,
    tags: ["three-piece", "salwar", "kameez", "women", "party wear"],
    variants: [
      { colorName: "Pastel Lavender", colorHex: "#c084fc", sizeName: "M (Chest 38)", price: 2950, stock: 12, sku: "SK-LAV-M" },
      { colorName: "Pastel Lavender", colorHex: "#c084fc", sizeName: "L (Chest 40)", price: 2950, stock: 10, sku: "SK-LAV-L" },
      { colorName: "Blush Pink", colorHex: "#f472b6", sizeName: "L (Chest 40)", price: 2950, stock: 13, sku: "SK-PNK-L" },
    ],
  },
  {
    _id: "p_w3",
    name: "Italian Vegan Leather Luxury Ladies Shoulder & Tote Bag (লেডিস লাক্সারি হ্যান্ডব্যাগ)",
    slug: "italian-vegan-leather-luxury-ladies-tote-bag",
    shortDescription: "Spacious Multi-Pocket Design, Gold Plated Hardware & Detachable Shoulder Strap",
    description: "Chic luxury everyday tote handbag crafted from water-resistant scratch-proof vegan leather. Features main zipper compartment, interior tablet sleeve, mobile slots, and sturdy handle.",
    category: { _id: "c6", name: "Women's Fashion", slug: "womens-fashion" },
    vendor: { _id: "v2", shopName: "Shapno Lifestyle", slug: "shapno", isVerified: true, rating: 4.8 },
    mainImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80",
    basePrice: 1850,
    oldPrice: 2600,
    discountPercentage: 28,
    sku: "BAG-TOTE-01",
    stock: 40,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 82,
    tags: ["handbag", "bag", "tote", "women", "accessories"],
    variants: [
      { colorName: "Caramel Brown", colorHex: "#92400e", sizeName: "Medium", price: 1850, stock: 20, sku: "BAG-BRN" },
      { colorName: "Midnight Black", colorHex: "#000000", sizeName: "Medium", price: 1850, stock: 20, sku: "BAG-BLK" },
    ],
  },
  {
    _id: "p_w4",
    name: "Vitamin C Glow + Hyaluronic Acid Brightening Facial Serum 30ml (ফেস সিরাম)",
    slug: "vitamin-c-glow-hyaluronic-acid-brightening-facial-serum",
    shortDescription: "20% Pure Vitamin C, Niacinamide & Ferulic Acid for Glowing Spotless Skin",
    description: "Dermatologist tested anti-aging and skin brightening serum. Fades dark spots, reduces acne marks, evens skin tone, and deeply hydrates for an all-day natural radiance.",
    category: { _id: "c9", name: "Beauty & Cosmetics", slug: "beauty-cosmetics" },
    vendor: { _id: "v2", shopName: "Shapno Lifestyle", slug: "shapno", isVerified: true, rating: 4.8 },
    mainImage: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&auto=format&fit=crop&q=80",
    basePrice: 790,
    oldPrice: 1200,
    discountPercentage: 34,
    sku: "SERUM-VITC",
    stock: 90,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 120,
    tags: ["skincare", "serum", "vitamin c", "glow", "cosmetics", "women"],
  },
  {
    _id: "p_w5",
    name: "Matte Velvet Waterproof 6-Color Nude Lipstick Gift Set (লিপস্টিক গিফট সেট)",
    slug: "matte-velvet-waterproof-6-color-nude-lipstick-set",
    shortDescription: "Long Lasting 16H Wear, Non-Drying Vitamin E Formula with Velvet Smooth Finish",
    description: "Set of 6 best-selling everyday nude and party red shades. Waterproof, transfer-proof, richly pigmented formula enriched with Shea Butter to keep lips soft and nourished.",
    category: { _id: "c9", name: "Beauty & Cosmetics", slug: "beauty-cosmetics" },
    vendor: { _id: "v2", shopName: "Shapno Lifestyle", slug: "shapno", isVerified: true, rating: 4.8 },
    mainImage: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&auto=format&fit=crop&q=80",
    basePrice: 950,
    oldPrice: 1450,
    discountPercentage: 34,
    sku: "LIP-SET-06",
    stock: 50,
    isHotDeal: false,
    isFeatured: false,
    rating: 4.7,
    reviewCount: 38,
    tags: ["lipstick", "makeup", "beauty", "cosmetics", "women"],
  },
  {
    _id: "p_w6",
    name: "Elegant Block Heel Party Footwear for Women (লেডিস পার্টি হিল স্যান্ডেল)",
    slug: "elegant-block-heel-party-footwear-for-women",
    shortDescription: "2.5 Inch Comfortable Stable Block Heel, Cushioned Insole & Non-Slip Sole",
    description: "Designed for all-day festive comfort. Features high quality metallic finish, padded memory foam footbed, ankle buckle strap, and anti-slip rubber grip.",
    category: { _id: "c6", name: "Women's Fashion", slug: "womens-fashion" },
    vendor: { _id: "v3", shopName: "Aarong Luxury Mart", slug: "aarong-luxury", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80",
    basePrice: 1650,
    oldPrice: 2250,
    discountPercentage: 26,
    sku: "SHOE-HEEL-01",
    stock: 30,
    isHotDeal: false,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 29,
    tags: ["shoes", "sandals", "heels", "women", "footwear"],
    variants: [
      { colorName: "Shimmer Gold", colorHex: "#eab308", sizeName: "37", price: 1650, stock: 10, sku: "HL-GLD-37" },
      { colorName: "Shimmer Gold", colorHex: "#eab308", sizeName: "38", price: 1650, stock: 10, sku: "HL-GLD-38" },
      { colorName: "Rose Gold", colorHex: "#f43f5e", sizeName: "38", price: 1650, stock: 10, sku: "HL-ROSE-38" },
    ],
  },

  // ============================================
  // 3. BABY & KIDS CARE (বেবি ও বাচ্চাদের আইটেম)
  // ============================================
  {
    _id: "p_b1",
    name: "100% Organic Soft Combed Cotton Newborn Baby Romper 3-Pack (নবজাতক বেবি রম্পার ৩-প্যাক)",
    slug: "organic-cotton-newborn-baby-romper-3-pack",
    shortDescription: "Ultra-Soft Breathable Fabric with Nickel-Free Snap Buttons for Easy Diaper Change",
    description: "Made from 100% certified organic combed cotton that is hypoallergenic and ultra-gentle on delicate infant skin. Includes 3 adorable printed rompers with expandable lap shoulder necklines.",
    category: { _id: "c7", name: "Baby & Kids", slug: "baby-kids" },
    vendor: { _id: "v4", shopName: "Kids Paradise BD", slug: "kids-paradise", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&auto=format&fit=crop&q=80",
    basePrice: 980,
    oldPrice: 1450,
    discountPercentage: 32,
    sku: "ROM-BABY-03",
    stock: 50,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 73,
    tags: ["baby", "kids", "romper", "infant", "clothes", "cotton"],
    variants: [
      { colorName: "Pastel Animal Print", sizeName: "0-3 Months", price: 980, stock: 20, sku: "ROM-03M" },
      { colorName: "Pastel Animal Print", sizeName: "3-6 Months", price: 980, stock: 20, sku: "ROM-06M" },
      { colorName: "Pastel Animal Print", sizeName: "6-12 Months", price: 980, stock: 10, sku: "ROM-12M" },
    ],
  },
  {
    _id: "p_b2",
    name: "Anti-Colic BPA-Free Baby Feeding Bottle & Nipple Set 240ml (বেবি ফিডিং বোতল)",
    slug: "anti-colic-bpa-free-baby-feeding-bottle-set",
    shortDescription: "Natural Latch Silicone Teat, Air Ventilation System to Prevent Gas & Colic",
    description: "Ergonomic wide-neck baby feeding bottle made of medical grade polypropylene. Mimics maternal breastfeeding to ease transition, with anti-leak cap and measurement scales.",
    category: { _id: "c7", name: "Baby & Kids", slug: "baby-kids" },
    vendor: { _id: "v4", shopName: "Kids Paradise BD", slug: "kids-paradise", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1584839462886-455b6c8dc5f4?w=800&auto=format&fit=crop&q=80",
    basePrice: 650,
    oldPrice: 950,
    discountPercentage: 31,
    sku: "BOT-FEED-240",
    stock: 60,
    isHotDeal: false,
    isFeatured: true,
    rating: 4.8,
    reviewCount: 55,
    tags: ["baby", "feeding", "feeder", "bottle", "anti colic"],
  },
  {
    _id: "p_b3",
    name: "Ultra-Lightweight Portable Folding Baby Stroller & Pram (ফোল্ডিং বেবি স্ট্রোলার)",
    slug: "ultra-lightweight-portable-folding-baby-stroller",
    shortDescription: "1-Hand Easy Compact Fold, Shock Absorbing Wheels, Adjustable Recline & UV Canopy",
    description: "Travel-friendly airplane cabin size stroller with aluminum alloy chassis. Features 5-point safety harness, 175-degree sleep recline, bottom storage basket, and 360-degree front swivel wheels.",
    category: { _id: "c7", name: "Baby & Kids", slug: "baby-kids" },
    vendor: { _id: "v4", shopName: "Kids Paradise BD", slug: "kids-paradise", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1591088398332-8a7791972843?w=800&auto=format&fit=crop&q=80",
    basePrice: 5800,
    oldPrice: 7500,
    discountPercentage: 22,
    sku: "STROLL-FOLD-01",
    stock: 18,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 41,
    tags: ["stroller", "pram", "trolley", "baby", "travel"],
    variants: [
      { colorName: "Charcoal Grey", colorHex: "#374151", sizeName: "Universal", price: 5800, stock: 10, sku: "STR-GRY" },
      { colorName: "Denim Navy", colorHex: "#1e3a8a", sizeName: "Universal", price: 5800, stock: 8, sku: "STR-NAV" },
    ],
  },
  {
    _id: "p_b4",
    name: "Montessori Wooden Educational Animal & Shape Puzzle Board (কাঠের শিক্ষণীয় পাজল খেলনা)",
    slug: "montessori-wooden-educational-puzzle-board",
    shortDescription: "Natural Pine Wood, Non-Toxic Water Paint & Motor Skill Development Toy",
    description: "Brain-boosting Montessori activity toy for toddlers aged 1 to 5. Enhances hand-eye coordination, color identification, and logical thinking with safe rounded smooth wooden edges.",
    category: { _id: "c7", name: "Baby & Kids", slug: "baby-kids" },
    vendor: { _id: "v4", shopName: "Kids Paradise BD", slug: "kids-paradise", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&auto=format&fit=crop&q=80",
    basePrice: 750,
    oldPrice: 1100,
    discountPercentage: 31,
    sku: "TOY-MONT-PUZ",
    stock: 45,
    isHotDeal: false,
    isFeatured: false,
    rating: 4.9,
    reviewCount: 88,
    tags: ["toy", "wooden", "montessori", "kids", "puzzle", "learning"],
  },
  {
    _id: "p_b5",
    name: "Soft Plush Cute Bunny Teddy Bear Cuddle Pillow Toy (কিউট প্লাশ বানি টেডি বেয়ার)",
    slug: "soft-plush-cute-bunny-teddy-bear-toy",
    shortDescription: "Extra Soft PP Cotton Filling, Washable & Huggable Sleeping Buddy for Kids",
    description: "Irresistibly cuddly rabbit plush toy crafted with baby-safe ultra-soft velvet fur. No shedding, no hard parts, and 100% machine washable.",
    category: { _id: "c7", name: "Baby & Kids", slug: "baby-kids" },
    vendor: { _id: "v4", shopName: "Kids Paradise BD", slug: "kids-paradise", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=800&auto=format&fit=crop&q=80",
    basePrice: 690,
    oldPrice: 950,
    discountPercentage: 27,
    sku: "TOY-BUNNY-40",
    stock: 55,
    isHotDeal: true,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 62,
    tags: ["toy", "teddy", "plush", "baby", "gift", "kids"],
  },

  // ============================================
  // 4. HOME & KITCHEN ELECTRIC APPLIANCES (হোম ও কিচেন)
  // ============================================
  {
    _id: "p_e1",
    name: "Digital Touchscreen 6L Oil-Free Healthy Electric Air Fryer (স্মার্ট ইলেকট্রিক এয়ার ফ্রায়ার)",
    slug: "digital-touchscreen-6l-oil-free-electric-air-fryer",
    shortDescription: "1800W 360° Rapid Air Circulation, 8 Preset Cooking Menus & Non-Stick Basket",
    description: "Enjoy crispy french fries, roasted chicken, and baked snacks with 85% less oil. Features one-touch digital LED panel, temperature control from 80°C to 200°C, and dishwasher safe basket.",
    category: { _id: "c8", name: "Home & Kitchen Electric", slug: "home-appliances" },
    vendor: { _id: "v5", shopName: "Smart Living Appliances", slug: "smart-living", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1585515320310-259814833e62?w=800&auto=format&fit=crop&q=80",
    basePrice: 5450,
    oldPrice: 7200,
    discountPercentage: 24,
    sku: "AF-DIG-6L",
    stock: 25,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 95,
    tags: ["air fryer", "kitchen", "electric", "appliances", "cooking"],
  },
  {
    _id: "p_e5",
    name: "Heavy Duty 750W 3-in-1 Stainless Steel Kitchen Mixer Grinder & Blender (মিক্সার গ্রাইন্ডার ও ব্লেন্ডার)",
    slug: "heavy-duty-750w-stainless-steel-mixer-grinder",
    shortDescription: "100% Copper Motor, 3 Hardened Stainless Steel Jars for Wet, Dry & Chutney Grinding",
    description: "Powerful kitchen powerhouse built for tough Indian and Bengali spice grinding. Features 3-speed rotary control with pulse mode, overload circuit breaker, and razor-sharp cutting blades.",
    category: { _id: "c8", name: "Home & Kitchen Electric", slug: "home-appliances" },
    vendor: { _id: "v5", shopName: "Smart Living Appliances", slug: "smart-living", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=800&auto=format&fit=crop&q=80",
    basePrice: 3250,
    oldPrice: 4100,
    discountPercentage: 20,
    sku: "MIX-750W-3J",
    stock: 30,
    isHotDeal: false,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 66,
    tags: ["blender", "mixer", "grinder", "kitchen", "appliances"],
  },
  {
    _id: "p_e6",
    name: "Ceramic Non-Stick Heavy Steam Iron 2200W with Anti-Drip (ইলেকট্রিক স্টিম আয়রন)",
    slug: "ceramic-non-stick-heavy-steam-iron-2200w",
    shortDescription: "Powerful Continuous Steam Boost, Self-Cleaning Function & 350ml Water Tank",
    description: "Effortlessly glide over stubborn wrinkles on cotton, silk, and linen. Equipped with scratch-resistant ceramic soleplate, vertical steaming mode for curtains and suits, and auto shut-off safety.",
    category: { _id: "c8", name: "Home & Kitchen Electric", slug: "home-appliances" },
    vendor: { _id: "v5", shopName: "Smart Living Appliances", slug: "smart-living", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=800&auto=format&fit=crop&q=80",
    basePrice: 1750,
    oldPrice: 2400,
    discountPercentage: 27,
    sku: "IRON-STM-22",
    stock: 45,
    isHotDeal: true,
    isFeatured: false,
    rating: 4.8,
    reviewCount: 43,
    tags: ["iron", "steam iron", "appliances", "home"],
  },
  {
    _id: "p_e7",
    name: "Smart WiFi Robotic Vacuum Cleaner with Auto Mopping & LiDAR Navigation (রোবট ক্লিনার)",
    slug: "smart-wifi-robotic-vacuum-cleaner-auto-mopping",
    shortDescription: "4000Pa Strong Suction, Smartphone App & Voice Control, Anti-Fall Sensors",
    description: "Completely automate home floor cleaning. Uses advanced laser mapping to scan rooms in real time, vacuums carpets, sweeps tiles, and wet mops hardwood floors with auto recharge dock.",
    category: { _id: "c8", name: "Home & Kitchen Electric", slug: "home-appliances" },
    vendor: { _id: "v5", shopName: "Smart Living Appliances", slug: "smart-living", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
    basePrice: 15500,
    oldPrice: 19500,
    discountPercentage: 20,
    sku: "ROBOT-VAC-01",
    stock: 12,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 31,
    tags: ["robot", "vacuum", "cleaner", "smart home", "appliances"],
  },

  // ============================================
  // 5. MEN'S FASHION & DIGITAL
  // ============================================
  {
    _id: "p3",
    name: "Premium Oxford Cotton Long Sleeve Casual Shirt for Men",
    slug: "premium-oxford-cotton-casual-shirt",
    shortDescription: "100% Breathable Export Quality Cotton with Modern Slim Fit",
    description: "Made from 100% combed Oxford cotton. Features button-down collar, wrinkle-free smooth texture, fine stitching, and tailored fit for both office and casual occasions.",
    category: { _id: "c2", name: "Men's Fashion", slug: "fashion" },
    vendor: { _id: "v2", shopName: "Shapno Lifestyle", slug: "shapno", isVerified: true, rating: 4.9 },
    mainImage: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80",
    galleryImages: [],
    basePrice: 1250,
    oldPrice: 1750,
    discountPercentage: 28,
    sku: "SHIRT-OXF-01",
    stock: 55,
    isHotDeal: true,
    isFeatured: true,
    rating: 4.9,
    reviewCount: 88,
    tags: ["shirt", "cotton", "men", "formal", "casual"],
    variants: [
      { colorName: "Navy Blue", colorHex: "#1e3a8a", sizeName: "M", price: 1250, stock: 15, sku: "SH-NAV-M" },
      { colorName: "Navy Blue", colorHex: "#1e3a8a", sizeName: "L", price: 1250, stock: 20, sku: "SH-NAV-L" },
      { colorName: "White", colorHex: "#ffffff", sizeName: "L", price: 1250, stock: 10, sku: "SH-WHT-L" },
    ],
  },
  {
    _id: "p4",
    name: "Comfort Narrow Fit Stretchable Chino Pant for Men",
    slug: "comfort-narrow-fit-stretchable-chino-pant",
    shortDescription: "Premium Twill Cotton Spandex with Flex Waistband",
    description: "Premium twill fabric with 2% elastane for maximum comfort and flexibility. Deep side pockets, reinforced belt loops, and rich color fastness.",
    category: { _id: "c2", name: "Men's Fashion", slug: "fashion" },
    vendor: { _id: "v2", shopName: "Shapno Lifestyle", slug: "shapno", isVerified: true, rating: 4.7 },
    mainImage: "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800&auto=format&fit=crop&q=80",
    basePrice: 1450,
    oldPrice: 1950,
    discountPercentage: 25,
    sku: "PANT-CHINO-02",
    stock: 35,
    isHotDeal: false,
    isFeatured: true,
    rating: 4.7,
    reviewCount: 42,
    tags: ["pant", "chino", "cotton", "men"],
  },
  {
    _id: "p5",
    name: "Canva Pro Lifetime Owner Access (Digital Activation)",
    slug: "canva-pro-lifetime-owner-access",
    shortDescription: "Original Brand Kit, 100M+ Stock Assets & AI Magic Studio",
    description: "100% private brand kit account. Unlimited cloud storage, background remover in 1-click, resize designs instantly, and full access to AI magic write & expand tools.",
    category: { _id: "c5", name: "Digital Items", slug: "digital-items" },
    vendor: { _id: "v1", shopName: "Gadget King BD", slug: "gadget-king", isVerified: true, rating: 5.0 },
    mainImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80",
    basePrice: 499,
    oldPrice: 1500,
    discountPercentage: 66,
    sku: "DIGI-CANVA",
    stock: 999,
    isHotDeal: true,
    isFeatured: true,
    isDigital: true,
    rating: 5.0,
    reviewCount: 310,
    tags: ["canva", "digital", "design", "pro"],
  },
];

export const fallbackVendors: IVendor[] = [
  {
    _id: "v1",
    shopName: "Gadget King BD",
    slug: "gadget-king",
    logo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1200&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewCount: 98,
    isVerified: true,
    totalProducts: 35,
    phone: "01822334455",
    address: "Multiplan Center, Elephant Road, Dhaka",
    description: "Original electronics, gadgets, and tech accessories with warranty.",
  },
  {
    _id: "v2",
    shopName: "Shapno Lifestyle",
    slug: "shapno",
    logo: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&auto=format&fit=crop&q=80",
    rating: 4.8,
    reviewCount: 142,
    isVerified: true,
    totalProducts: 48,
    phone: "01711223344",
    address: "Dhanmondi 7, Dhaka",
    description: "Authentic premium fashion and lifestyle products direct from manufacturer.",
  },
  {
    _id: "v3",
    shopName: "Aarong Luxury Mart",
    slug: "aarong-luxury",
    logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=1200&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewCount: 210,
    isVerified: true,
    totalProducts: 64,
    phone: "01844556677",
    address: "Uttara Sector 3, Dhaka",
    description: "Exclusive traditional sarees, designer salwar kameez, and ladies luxury accessories.",
  },
  {
    _id: "v4",
    shopName: "Kids Paradise BD",
    slug: "kids-paradise",
    logo: "https://images.unsplash.com/photo-1544717305-2782549b5136?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewCount: 185,
    isVerified: true,
    totalProducts: 52,
    phone: "01933445566",
    address: "Bashundhara City, Panthapath, Dhaka",
    description: "Safe, organic and high quality baby care, newborn clothes, strollers and educational toys.",
  },
  {
    _id: "v5",
    shopName: "Smart Living Appliances",
    slug: "smart-living",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
    banner: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=1200&auto=format&fit=crop&q=80",
    rating: 4.9,
    reviewCount: 160,
    isVerified: true,
    totalProducts: 40,
    phone: "01622334455",
    address: "Mirpur 10, Dhaka",
    description: "Original smart kitchen and home electric appliances with official manufacturer warranty.",
  },
];

export const fallbackDeliveryZones: IDeliveryZone[] = [
  { division: "Dhaka", district: "Dhaka City", deliveryCharge: 60, estimatedDelivery: "24-48 Hours" },
  { division: "Dhaka", district: "Gazipur", deliveryCharge: 100, estimatedDelivery: "2-3 Days" },
  { division: "Dhaka", district: "Narayanganj", deliveryCharge: 100, estimatedDelivery: "2-3 Days" },
  { division: "Chittagong", district: "Chittagong City", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { division: "Chittagong", district: "Cox's Bazar", deliveryCharge: 130, estimatedDelivery: "3-4 Days" },
  { division: "Sylhet", district: "Sylhet City", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { division: "Rajshahi", district: "Rajshahi City", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { division: "Khulna", district: "Khulna City", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
  { division: "Barisal", district: "Barisal City", deliveryCharge: 120, estimatedDelivery: "3-4 Days" },
  { division: "Rangpur", district: "Rangpur City", deliveryCharge: 120, estimatedDelivery: "3-4 Days" },
  { division: "Mymensingh", district: "Mymensingh City", deliveryCharge: 120, estimatedDelivery: "2-3 Days" },
];

// Fast fetch helper with 800ms timeout to prevent any server hang
async function fetchFast(url: string, options: RequestInit = {}, timeoutMs: number = 800): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(id);
    return res;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export const api = {
  async getProducts(params?: { category?: string; search?: string; isHotDeal?: boolean }): Promise<IProduct[]> {
    try {
      const query = new URLSearchParams();
      if (params?.category) query.set("category", params.category);
      if (params?.search) query.set("search", params.search);
      if (params?.isHotDeal) query.set("isHotDeal", "true");

      const res = await fetchFast(`${API_BASE}/products?${query.toString()}`, { cache: "no-store" }, 800);
      if (!res.ok) throw new Error("Failed to fetch products");
      const json = await res.json();
      return json.data || fallbackProducts;
    } catch {
      let filtered = [...fallbackProducts];
      if (params?.category) {
        filtered = filtered.filter((p) => (typeof p.category === "object" ? p.category.slug : p.category) === params.category);
      }
      if (params?.search) {
        const q = params.search.toLowerCase();
        filtered = filtered.filter((p) => p.name.toLowerCase().includes(q) || Boolean(p.tags?.some((t) => t.includes(q))));
      }
      if (params?.isHotDeal) {
        filtered = filtered.filter((p) => p.isHotDeal);
      }
      return filtered;
    }
  },

  async getProductBySlug(slug: string): Promise<{ product: IProduct; relatedProducts: IProduct[] }> {
    try {
      const res = await fetchFast(`${API_BASE}/products/slug/${slug}`, { cache: "no-store" }, 800);
      if (!res.ok) throw new Error("Failed to fetch product");
      const json = await res.json();
      return json.data;
    } catch {
      const product = fallbackProducts.find((p) => p.slug === slug) || fallbackProducts[0];
      const relatedProducts = fallbackProducts.filter((p) => p.slug !== product.slug).slice(0, 4);
      return { product, relatedProducts };
    }
  },

  async getCategories(): Promise<ICategory[]> {
    try {
      const res = await fetchFast(`${API_BASE}/products/categories`, { cache: "no-store" }, 800);
      if (!res.ok) throw new Error("Failed to fetch categories");
      const json = await res.json();
      return json.data || fallbackCategories;
    } catch {
      return fallbackCategories;
    }
  },

  async getDeliveryZones(): Promise<IDeliveryZone[]> {
    try {
      const res = await fetchFast(`${API_BASE}/delivery/zones`, { cache: "no-store" }, 800);
      if (!res.ok) throw new Error("Failed to fetch zones");
      const json = await res.json();
      return json.data?.raw || fallbackDeliveryZones;
    } catch {
      return fallbackDeliveryZones;
    }
  },

  async getVendors(): Promise<IVendor[]> {
    try {
      const res = await fetchFast(`${API_BASE}/vendors`, { cache: "no-store" }, 800);
      if (!res.ok) throw new Error("Failed to fetch vendors");
      const json = await res.json();
      return json.data || fallbackVendors;
    } catch {
      return fallbackVendors;
    }
  },

  async saveIncompleteOrder(data: any): Promise<void> {
    try {
      await fetch(`${API_BASE}/incomplete-orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } catch (e) {
      console.warn("Incomplete order save failed:", e);
    }
  },

  async validateCoupon(code: string, subtotal: number): Promise<{ success: boolean; discount: number; message: string }> {
    try {
      const res = await fetch(`${API_BASE}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const json = await res.json();
      return json;
    } catch {
      if (code.toUpperCase() === "SAVE10") {
        return { success: true, discount: Math.round(subtotal * 0.1), message: "10% ছাড় সফলভাবে যুক্ত হয়েছে!" };
      }
      return { success: false, discount: 0, message: "কুপন কোডটি বৈধ নয়" };
    }
  },

  async submitOrder(orderData: any): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      const json = await res.json();
      return json;
    } catch (e: any) {
      // Resilient fallback simulation
      const invoiceId = `SG-${Math.floor(10000 + Math.random() * 90000)}`;
      return {
        success: true,
        message: "আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে!",
        data: {
          order: {
            ...orderData,
            invoiceId,
            status: "pending",
          },
        },
      };
    }
  },


  async trackOrder(query: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/orders/track?query=${encodeURIComponent(query)}`);
      return await res.json();
    } catch {
      return {
        success: true,
        data: [
          {
            invoiceId: query.startsWith("SG-") ? query : "SG-10025",
            customer: { name: "Sample Customer", phone: query, address: "Dhaka", district: "Dhaka City" },
            items: [{ name: fallbackProducts[0].name, price: fallbackProducts[0].basePrice, quantity: 1 }],
            grandTotal: fallbackProducts[0].basePrice + 60,
            status: "processing",
            timeline: [
              { status: "Order Placed", timestamp: new Date(Date.now() - 3600000 * 5), note: "অর্ডার সফলভাবে গ্রহণ করা হয়েছে।" },
              { status: "Order Confirmed", timestamp: new Date(Date.now() - 3600000 * 3), note: "অর্ডার কনফার্ম করা হয়েছে এবং প্যাকিং চলছে।" },
              { status: "In Transit", timestamp: new Date(Date.now() - 3600000 * 1), note: "ডেলিভারির জন্য কুরিয়ারে হস্তান্তর করা হয়েছে।" },
            ],
          },
        ],
      };
    }
  },

  async getSalesNotifications(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/notifications/sales`);
      const json = await res.json();
      return json.items || [];
    } catch {
      return [
        { name: "Tanvir from Mirpur", product_name: "Ultra Modern Smartwatch Series 9", time: "2 minutes ago", image: fallbackProducts[1].mainImage, product_url: `/product/${fallbackProducts[1].slug}` },
        { name: "Sabbir from Dhanmondi", product_name: "Premium Oxford Cotton Casual Shirt", time: "5 minutes ago", image: fallbackProducts[2].mainImage, product_url: `/product/${fallbackProducts[2].slug}` },
        { name: "Nusrat from Uttara", product_name: "Canva Pro Lifetime Owner Access", time: "8 minutes ago", image: fallbackProducts[4].mainImage, product_url: `/product/${fallbackProducts[4].slug}` },
      ];
    }
  },

  async getAllOrders(status?: string, search?: string): Promise<any[]> {
    try {
      const params = new URLSearchParams();
      if (status && status !== "all") params.set("status", status);
      if (search) params.set("search", search);

      const res = await fetch(`${API_BASE}/orders?${params.toString()}`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch orders");
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },

  async getAdminStats(): Promise<{
    totalRevenue: number;
    totalOrders: number;
    pendingOrders: number;
    confirmedOrders: number;
    deliveredOrders: number;
    incompleteCount: number;
  }> {
    try {
      const res = await fetch(`${API_BASE}/orders/admin/stats`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch stats");
      const json = await res.json();
      return json.data;
    } catch {
      return {
        totalRevenue: 48909,
        totalOrders: 5,
        pendingOrders: 1,
        confirmedOrders: 1,
        deliveredOrders: 2,
        incompleteCount: 3,
      };
    }
  },

  async updateOrderStatus(invoiceId: string, status: string, note?: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/orders/${invoiceId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, note }),
      });
      return await res.json();
    } catch {
      return { success: true, message: "অর্ডার স্ট্যাটাস আপডেট সফল" };
    }
  },

  async updatePaymentStatus(invoiceId: string, paymentStatus: string): Promise<any> {
    try {
      const res = await fetch(`${API_BASE}/orders/${invoiceId}/payment-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentStatus }),
      });
      return await res.json();
    } catch {
      return { success: true, message: "পেমেন্ট স্ট্যাটাস আপডেট সফল" };
    }
  },

  async getIncompleteOrders(): Promise<any[]> {
    try {
      const res = await fetch(`${API_BASE}/incomplete-orders`, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch incomplete orders");
      const json = await res.json();
      return json.data || [];
    } catch {
      return [];
    }
  },
};

