import axios, { InternalAxiosRequestConfig } from "axios";
// If this alias isn't configured, use a relative import instead:
// import { getToken, getDevRole } from "../auth/auth";
import { getToken, getDevRole } from "@/auth"; // only if alias '@' -> '/src' is set

export const api = axios.create({
  baseURL: "/api",         // goes through Vite proxy
  withCredentials: false,
});

// default headers (optional)
(api.defaults.headers.common as any)["Accept"] = "application/json";
(api.defaults.headers.post   as any)["Content-Type"] = "application/json";
(api.defaults.headers.put    as any)["Content-Type"] = "application/json";


api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  // add headers if you want
  return config;
});
export type Amenity = { id: number; code: string; name: string; isActive?: boolean };
export type RoomType = { id: number; code: string; name: string; basePrice?: number; active?: boolean };
// If you already have a fetch wrapper here, feel free to reuse it.
// These use native fetch so they’re drop-in anywhere.
export async function getAmenities(): Promise<Amenity[]> {
  const r = await fetch("/api/admin/amenities");
  if (!r.ok) throw new Error("amenities load failed");
  return r.json();
}

export async function getRoomTypes(): Promise<RoomType[]> {
  const r = await fetch("/api/admin/roomtypes"); // adjust path if your route differs
  if (!r.ok) throw new Error("room types load failed");
  return r.json();
}
export default api;