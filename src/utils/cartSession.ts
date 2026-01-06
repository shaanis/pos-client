export type CartItem = {
  title: string;
  image?: string; // ✅ image optional
  price: number;
  qty: number;
  offer?: {
    label: string;
    type?: "BOGO" | "PERCENT";
    value?: number;
  };
};

const STORAGE_KEY = "pos_cart";

export const getCart = (): CartItem[] => {
  const data = sessionStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveCart = (cart: CartItem[]) => {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated")); // 🔥 notify OrderPanel
};

export const addToCart = (item: CartItem) => {
  const cart = getCart();
  const existing = cart.find((c) => c.title === item.title);

  if (existing) {
    existing.qty += item.qty; // use incoming qty
    if (item.image) existing.image = item.image; // update image if provided
  } else {
    cart.push({ ...item }); // include image
  }

  saveCart(cart);
};
