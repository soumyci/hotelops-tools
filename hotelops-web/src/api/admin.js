// src/api/admin.js
import api from "@/lib/api";
import { getToken, getDevRole } from "@/auth";

function buildAuthHeader() {
  const token = getToken();
  const devRole = getDevRole();
  if (token && token.trim() !== "") return `Bearer ${token}`;
  if (devRole) return `Demo role=${devRole}; name=Dev User; email=dev@example.com`;
  return "";
}

// ---- rooms ----

// API -> UI
const normalizeRoom = x => ({
  id: x.id ?? x.Id ?? 0,
  code: x.code ?? x.Code ?? "",
  name: x.name ?? x.Name ?? "",
  type: x.type ?? x.Type ?? "",
  capacity: x.capacity ?? x.Capacity ?? 0,
  basePrice: x.basePrice ?? x.BasePrice ?? 0,
  amenitiesCsv: x.amenitiesCsv ?? x.AmenitiesCsv ?? "",
  imageUrl: x.imageUrl ?? x.ImageUrl ?? "",
});

export async function listRooms() {
  const { data } = await api.get("/admin/rooms");
  return (Array.isArray(data) ? data : []).map(normalizeRoom);
}

export async function createRoom(ui) {
  // UI (camelCase) -> API (PascalCase)
  const payload = {
    Code: ui.code,
    Name: ui.name,
    Type: ui.type,
    Capacity: Number(ui.capacity) || 0,
    BasePrice: Number(ui.basePrice) || 0,
    AmenitiesCsv: ui.amenitiesCsv ?? "",
    ImageUrl: ui.imageUrl ?? null,
  };
  const { data } = await api.post("/admin/rooms", payload);
  return normalizeRoom(data);
}

// Accept id (number) or code (string) and call the right endpoint
export async function deleteRoom(key) {
  const useId = Number.isFinite(Number(key));
  const path = useId
    ? `/admin/rooms/${encodeURIComponent(key)}`
    : `/admin/rooms/by-code/${encodeURIComponent(key)}`;
  await api.delete(path);
}
// src/api/admin.js
export async function uploadRoomImage(file) {
  const fd = new FormData();
  fd.append("file", file); // key MUST be "file"

  try {
    // goes through vite proxy: /api -> https://localhost:7212
    const { data } = await api.post("/admin/rooms/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data.url;
  } catch {
    // direct fallback
    const res = await fetch("https://localhost:7212/api/admin/rooms/upload", {
      method: "POST",
      headers: { Authorization: buildAuthHeader() }, // don't set Content-Type
      body: fd,
    });
    if (!res.ok) throw new Error(await res.text());
    const json = await res.json();
    return json.url;
  }
}



// (kept for future edit form)
export async function updateRoom(id, ui) {
  const payload = {
    Code: ui.code,
    Name: ui.name,
    Type: ui.type,
    Capacity: Number(ui.capacity) || 0,
    BasePrice: Number(ui.basePrice) || 0,
    AmenitiesCsv: ui.amenitiesCsv ?? "",
    ImageUrl: ui.imageUrl ?? null,
  };
  const { data } = await api.put(`/admin/rooms/${encodeURIComponent(id)}`, payload);
  return normalizeRoom(data);
}
// ----- Room Types -----
const normalizeRoomType = x => ({
  id: x.id ?? x.Id ?? 0,
  code: x.code ?? x.Code ?? "",
  name: x.name ?? x.Name ?? "",
  basePrice: x.basePrice ?? x.BasePrice ?? 0,
  description: x.description ?? x.Description ?? "",
  active: x.active ?? x.Active ?? true,
});

export async function listRoomTypes() {
  const { data } = await api.get("/admin/roomtypes");
  return (Array.isArray(data) ? data : []).map(normalizeRoomType);
}

export async function createRoomType(ui) {
  const payload = {
    Code: ui.code?.trim() ?? "",
    Name: ui.name?.trim() ?? "",
    BasePrice: Number(ui.basePrice) || 0,
    Description: ui.description ?? "",
    Active: !!ui.active,
  };
  const { data } = await api.post("/admin/roomtypes", payload);
  return normalizeRoomType(data);
}

export async function deleteRoomType(id) {
  await api.delete(`/admin/roomtypes/${encodeURIComponent(id)}`);
}

// ----- Rate Plans -----
const normalizeRatePlan = x => ({
  id: x.id ?? x.Id ?? 0,
  code: x.code ?? x.Code ?? "",
  name: x.name ?? x.Name ?? "",
  // be forgiving with backend naming
  price: x.price ?? x.Price ?? x.basePrice ?? x.BasePrice ?? 0,
  description: x.description ?? x.Description ?? "",
  active: x.active ?? x.Active ?? true,
});

export async function listRatePlans() {
  const { data } = await api.get("/admin/rateplans");
  return (Array.isArray(data) ? data : []).map(normalizeRatePlan);
}

export async function createRatePlan(ui) {
  const payload = {
    Code: ui.code?.trim() ?? "",
    Name: ui.name?.trim() ?? "",
    Price: Number(ui.price) || 0,          // if your API uses BasePrice, it will ignore Price; swap if needed
    Description: ui.description ?? "",
    Active: !!ui.active,
  };
  const { data } = await api.post("/admin/rateplans", payload);
  return normalizeRatePlan(data);
}

export async function deleteRatePlan(id) {
  await api.delete(`/admin/rateplans/${encodeURIComponent(id)}`);
}
