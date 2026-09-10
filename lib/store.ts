import { create } from "zustand";
import { ICartItem, IProduct, IUser } from "./types";

interface CartStore {
  items: ICartItem[];
  isCartDrawerOpen: boolean;
  addItem: (item: Omit<ICartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variantInfo?: string) => void;
  updateQuantity: (productId: string, quantity: number, variantInfo?: string) => void;
  clearCart: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  toggleCartDrawer: () => void;
  getSubtotal: () => number;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isCartDrawerOpen: false,

  addItem: (item, quantity = 1) => {
    set((state) => {
      const existingIndex = state.items.findIndex(
        (i) => i.productId === item.productId && i.variantInfo === item.variantInfo
      );

      if (existingIndex > -1) {
        const updated = [...state.items];
        updated[existingIndex].quantity += quantity;
        return { items: updated, isCartDrawerOpen: true };
      }

      return {
        items: [...state.items, { ...item, quantity }],
        isCartDrawerOpen: true,
      };
    });
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

