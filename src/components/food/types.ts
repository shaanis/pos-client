// src/components/food/types.ts

export type OfferType = "PERCENT" | "BOGO";

export interface Offer {
  label: string;
  type: OfferType;
  value?: number; // only for PERCENT
}

export interface Image {
  url: string;
  public_id: string;
}

export interface Food {
  _id: string;
  title: string;
  price: number;
  rating?: number; // ✅ OPTIONAL
  image: Image;
  offer?: Offer;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
}
