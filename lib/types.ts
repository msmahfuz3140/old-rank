export interface IProductVariant {
  id?: string;
  colorName?: string;
  colorHex?: string;
  sizeName?: string;
  price: number;
  stock: number;
  sku?: string;
}

export interface IWholesalePrice {
  minQuantity: number;
  price: number;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  description: string;
  category: { _id: string; name: string; slug: string } | string;
  subCategory?: { _id: string; name: string; slug: string } | string;
  vendor?: {
    _id: string;
    shopName: string;
    slug: string;
    logo?: string;
    rating?: number;
    isVerified?: boolean;
  };
  mainImage: string;
  galleryImages?: string[];
  basePrice: number;
  oldPrice?: number;
  discountPercentage?: number;
  sku: string;
  stock: number;
  isHotDeal?: boolean;
  isFeatured?: boolean;
  isDigital?: boolean;
  variants?: IProductVariant[];
  wholesalePrices?: IWholesalePrice[];
  rating: number;
  reviewCount: number;
  tags?: string[];
}

export interface ICategory {
  _id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  level: number;
  subcategories?: Array<ICategory & { children?: ICategory[] }>;
}

export interface IVendor {
  _id: string;
  shopName: string;
  slug: string;
  logo: string;
  banner: string;
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  totalProducts: number;
  phone: string;
  address: string;
  description: string;
}

export interface ICartItem {
  productId: string;
  name: string;
  image: string;
  variantInfo?: string;
  colorName?: string;
  sizeName?: string;
  price: number;
  quantity: number;
  slug: string;
}

export interface IDeliveryZone {
  division: string;
  district: string;
  deliveryCharge: number;
  estimatedDelivery?: string;
}

export interface IUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  role: "admin" | "seller" | "customer";
  shopName?: string;
  avatar?: string;
}


export interface IOrder {
  _id: string;
  invoiceId: string;
  customer: {
    name: string;
    phone: string;
    address: string;
    division: string;
    district: string;
    note?: string;
  };
  items: Array<{
    productId?: string;
    name: string;
    price: number;
    quantity: number;
    image?: string;
    variantInfo?: string;
  }>;
  subtotal: number;
  deliveryCharge: number;
  discount: number;
  grandTotal: number;
  paymentMethod: string;
  paymentStatus: "pending" | "paid" | "pending_verification" | "failed";
  manualPaymentDetails?: {
    trxId?: string;
    senderNumber?: string;
  };
  status: "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled";
  timeline?: Array<{
    status: string;
    timestamp: string | Date;
    note?: string;
  }>;
  createdAt: string;
}

export interface IIncompleteOrder {
  _id: string;
  phone: string;
  name?: string;
  address?: string;
  division?: string;
  district?: string;
  items?: any[];
  subtotal?: number;
  deliveryCharge?: number;
  isConverted: boolean;
  createdAt: string;
  updatedAt: string;
}

