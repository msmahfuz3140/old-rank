import { create } from "zustand";
import { ICartItem, IProduct, IUser } from "./types";

export interface CartToastData {
  show: boolean;
  message: string;
  item?: {
    name: string;
    image: string;
    price: number;
    quantity: number;
    variantInfo?: string;
  };
}

interface CartStore {
  items: ICartItem[];
  isCartDrawerOpen: boolean;
  toast: CartToastData | null;
  directBuyItem: ICartItem | null;
  setDirectBuyItem: (item: Omit<ICartItem, "quantity">, quantity?: number) => void;
  clearDirectBuyItem: () => void;
  updateDirectBuyQuantity: (quantity: number) => void;
  addItem: (
    item: Omit<ICartItem, "quantity">,
    quantity?: number,
    openDrawer?: boolean,
    notify?: boolean
  ) => void;
  removeItem: (productId: string, variantInfo?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantInfo?: string) => void;
  clearCart: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  showToast: (message: string, item?: CartToastData["item"]) => void;
  hideToast: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isCartDrawerOpen: false,
  toast: null,
  directBuyItem: null,

  setDirectBuyItem: (item, quantity = 1) => {
    set({
      directBuyItem: { ...item, quantity },
      isCartDrawerOpen: false,
    });
  },

  clearDirectBuyItem: () => {
    set({ directBuyItem: null });
  },

  updateDirectBuyQuantity: (quantity: number) => {
    if (quantity <= 0) {
      set({ directBuyItem: null });
    } else {
      set((state) => ({
        directBuyItem: state.directBuyItem ? { ...state.directBuyItem, quantity } : null,
      }));
    }
  },

  addItem: (item, quantity = 1, openDrawer = false, notify = true) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (i) => i.productId === item.productId && i.variantInfo === item.variantInfo
      );

      let updated: ICartItem[];
      if (existingIndex > -1) {
        updated = [...state.items];
        updated[existingIndex].quantity += quantity;
      } else {
        updated = [...state.items, { ...item, quantity }];
      }

      return {
        items: updated,
        isCartDrawerOpen: openDrawer ? true : false,
        toast: notify
          ? {
              show: true,
              message: "পণ্যটি সফলভাবে কার্টে যোগ হয়েছে!",
              item: {
                name: item.name,
                image: item.image,
                price: item.price,
                quantity,
                variantInfo: item.variantInfo,
              },
            }
          : state.toast,
      };
    });
  },

  showToast: (message, item) => {
    set({
      toast: {
        show: true,
        message,
        item,
      },
    });
  },

  hideToast: () => {
    set({ toast: null });
  },

  removeItem: (productId, variantInfo) => {
    set((state) => ({
      items: state.items.filter(
        (i) => !(i.productId === productId && i.variantInfo === variantInfo)
      ),
    }));
  },

  updateQuantity: (productId, quantity, variantInfo) => {
    if (quantity <= 0) {
      get().removeItem(productId, variantInfo);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.productId === productId && i.variantInfo === variantInfo
          ? { ...i, quantity }
          : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  openCartDrawer: () => set({ isCartDrawerOpen: true }),
  closeCartDrawer: () => set({ isCartDrawerOpen: false }),
  toggleCartDrawer: () => set((state) => ({ isCartDrawerOpen: !state.isCartDrawerOpen })),

  getSubtotal: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));

interface QuickViewStore {
  isOpen: boolean;
  product: IProduct | null;
  openQuickView: (product: IProduct) => void;
  closeQuickView: () => void;
}

export const useQuickViewStore = create<QuickViewStore>((set) => ({
  isOpen: false,
  product: null,
  openQuickView: (product) => set({ isOpen: true, product }),
  closeQuickView: () => set({ isOpen: false, product: null }),
}));

interface AuthStore {
  user: IUser | null;
  isLoggedIn: boolean;
  login: (user: IUser) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => {
  // Initialize from localStorage if on browser
  let initialUser: IUser | null = null;
  let initialLoggedIn = false;

  if (typeof window !== "undefined") {
    try {
      const saved = localStorage.getItem("oldrank_user");
      if (saved) {
        initialUser = JSON.parse(saved);
        initialLoggedIn = true;
      }
    } catch {}
  }

  return {
    user: initialUser,
    isLoggedIn: initialLoggedIn,
    login: (user) => {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem("oldrank_user", JSON.stringify(user));
        } catch {}
      }
      set({ user, isLoggedIn: true });
    },
    logout: () => {
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem("oldrank_user");
        } catch {}
      }
      set({ user: null, isLoggedIn: false });
    },
  };
});

