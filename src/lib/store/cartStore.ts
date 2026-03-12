import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartItem {
  id: string; // Product Variant ID
  productId: string;
  slug: string; // Used for routing back to the product details page
  name: string;
  priceInCents: number;
  quantity: number;
  image?: string;
  size?: string;
  inventoryCount: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  syncPrices: (updates: { id: string; priceInCents: number }[]) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((i) => i.id === item.id);

        if (existingItem) {
          set({
            items: currentItems.map((i) =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          });
        } else {
          set({ items: [...currentItems, item] });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        });
      },
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        return get().items.reduce((total, item) => total + item.priceInCents * item.quantity, 0);
      },
      syncPrices: (updates) => {
        const priceMap = Object.fromEntries(updates.map((u) => [u.id, u.priceInCents]));
        set({
          items: get().items.map((item) =>
            priceMap[item.id] !== undefined && priceMap[item.id] !== item.priceInCents
              ? { ...item, priceInCents: priceMap[item.id] }
              : item
          ),
        });
      },
    }),
    {
      name: "origonae-cart",
    }
  )
);
