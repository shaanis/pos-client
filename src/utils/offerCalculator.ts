import type { CartItem } from "./cartSession";

export type CalculatedItem = CartItem & {
  discountAmount: number;
};

export const applyOffers = (items: CartItem[]): CalculatedItem[] => {
  return items.map((item) => {
    let discountAmount = 0;

    if (item.offer?.type === "PERCENT" && item.offer.value) {
      discountAmount = (item.price * item.qty * item.offer.value) / 100;
    }

    if (item.offer?.type === "BOGO" && item.qty >= 2) {
      const freeItems = Math.floor(item.qty / 2);
      discountAmount = freeItems * item.price;
    }

    return {
      ...item,
      discountAmount,
    };
  });
};
