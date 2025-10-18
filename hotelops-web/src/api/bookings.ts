// src/api/bookings.ts
import http from "../api/http";

export type Booking = {
  id: string;
  guestName: string;
  checkIn: string;   // ISO
  checkOut: string;  // ISO
};

export async function listBookings(): Promise<Booking[]> {
  // Corporate endpoint commonly requires a corporate role;
  // our Demo header includes CorporateAdmin to unblock it.
  return await http<Booking[]>("/api/corporate/bookings");
}

export async function createBooking(input: {
  guestName: string;
  checkIn: string;   // ISO date
  checkOut: string;  // ISO date
}): Promise<Booking> {
  return await http<Booking>("/api/corporate/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}
