// src/services/allApi.ts
import commonApi from "./commonApi";
import serverurl from "./serverurl";
import type { Food } from "../components/food/types";

/* ================= TYPES ================= */
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
}

export type CartItem = {
  title: string;
  image?: string;
  price: number;
  qty: number;
  offer?: {
    label: string;
    type?: "BOGO" | "PERCENT";
    value?: number;
  };
};

export type CheckoutPayload = {
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: "CASH" | "CARD" | "ONLINE";
};

export interface Checkout {
  _id: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: "CASH" | "CARD" | "ONLINE";
  status?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OverviewCards {
  totalOrders: number;
  revenue: number;
  productsSold: number;
  newCustomers: number;
}

export interface SalesData {
  month: string;
  sales: number;
  orders: number;
}

export interface OverviewInsights {
  topSellingProduct: {
    title: string;
    units: number;
  } | null;
  bestRevenueMonth: {
    month: string;
    revenue: number;
  } | null;
}

export interface OverviewResponse {
  success: boolean;
  data: {
    overviewCards: OverviewCards;
    salesData: SalesData[];
    insights: OverviewInsights;
  };
  message?: string;
}


export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  message?: string;
}

/* ================= FOOD APIS ================= */

// GET ALL FOODS
export const getAllFoodsApi = async (): Promise<ApiResponse<Food[]>> => {
  try {
    const res = await commonApi<ApiResponse<Food[]>>(
      "GET",
      `${serverurl}/food/all`
    );
    return res.data || { success: false, message: "No data", data: [] };
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to fetch foods" };
  }
};

// ADD FOOD
export const addFoodApi = async (formData: FormData): Promise<ApiResponse<Food>> => {
  try {
    const res = await commonApi<ApiResponse<Food>>(
      "POST",
      `${serverurl}/food/add`,
      formData,
      { "Content-Type": "multipart/form-data" }
    );
    return res.data;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to add food" };
  }
};

// UPDATE FOOD
export const updateFoodApi = async (id: string, formData: FormData): Promise<ApiResponse<Food>> => {
  try {
    const res = await commonApi<ApiResponse<Food>>(
      "PUT",
      `${serverurl}/food/edit/${id}`,
      formData,
      { "Content-Type": "multipart/form-data" }
    );
    return res.data;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to update food" };
  }
};

// DELETE FOOD
export const deleteFoodApi = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const res = await commonApi<ApiResponse<null>>(
      "DELETE",
      `${serverurl}/food/delete/${id}`
    );
    return res.data;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to delete food" };
  }
};

/* ================= CHECKOUT APIS ================= */

// ADD CHECKOUT
export const addCheckoutApi = async (
  payload: CheckoutPayload
): Promise<ApiResponse<any>> => {
  try {
    const res = await commonApi<ApiResponse<any>>(
      "POST",
      `${serverurl}/checkout`,
      payload
    );
    return res.data;
  } catch (err: any) {
    return { success: false, message: err.message || "Failed to create checkout" };
  }
};

// GET ALL CHECKOUTS WITH PAGINATION
export const getAllCheckoutsApi = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedResponse<Checkout>> => {
  try {
    const res = await commonApi<PaginatedResponse<Checkout>>(
      "GET",
      `${serverurl}/checkout/all?page=${page}&limit=${limit}`
    );

    return res.data || {
      success: false,
      data: [],
      pagination: { total: 0, page, limit, totalPages: 0 },
      message: "No data",
    };
  } catch (err: any) {
    console.error("Fetch checkouts error:", err);
    return {
      success: false,
      data: [],
      pagination: { total: 0, page, limit, totalPages: 0 },
      message: err.message || "Failed to fetch checkouts",
    };
  }
};

// overview data
export const getOverviewApi = async (): Promise<OverviewResponse> => {
  try {
    const res = await commonApi<OverviewResponse>(
      "GET",
      `${serverurl}/overview`
    );

    return res.data || {
      success: false,
      data: {
        overviewCards: {
          totalOrders: 0,
          revenue: 0,
          productsSold: 0,
          newCustomers: 0,
        },
        salesData: [],
        insights: {
          topSellingProduct: null,
          bestRevenueMonth: null,
        },
      },
      message: "No overview data",
    };
  } catch (err: any) {
    console.error("Fetch overview error:", err);
    return {
      success: false,
      data: {
        overviewCards: {
          totalOrders: 0,
          revenue: 0,
          productsSold: 0,
          newCustomers: 0,
        },
        salesData: [],
        insights: {
          topSellingProduct: null,
          bestRevenueMonth: null,
        },
      },
      message: err.message || "Failed to fetch overview data",
    };
  }
};