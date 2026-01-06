// src/services/commonApi.ts
import axios, { type AxiosRequestConfig, type AxiosResponse } from "axios";

/* ================= TYPES ================= */
type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestHeaders {
  [key: string]: string;
}

/* ================= COMMON API FUNCTION ================= */
const commonApi = async <T = any>(
  httpMethod: HttpMethod,
  url: string,
  reqBody?: any,
  reqHeader?: RequestHeaders
): Promise<AxiosResponse<T>> => {
  const reqConfig: AxiosRequestConfig = {
    method: httpMethod,
    url,
    data: reqBody,
    headers: reqHeader || { "Content-Type": "application/json" },
  };

  return await axios(reqConfig);
};

export default commonApi;
