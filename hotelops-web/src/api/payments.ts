import http from "./http";

export type Payment = {
  id: string;
  bookingId: string;
  amount: number;         // cents or units (match API)
  method: string;         // e.g. "Card", "Cash", "Transfer"
  reference?: string;
  createdAt: string;      // ISO
};

export type CreatePaymentDto = {
  bookingId: string;
  amount: number;
  method: string;
  reference?: string;
  // If your API requires corporate context, include:
  customerCode?: string;
};

// If your API splits corporate/admin, add a base; for now use /api/payments
const base = "/api/payments";

export async function listPayments(): Promise<Payment[]> {
  return http<Payment[]>(`${base}`);
}

export async function createPayment(dto: CreatePaymentDto): Promise<void> {
  await http<void>(`${base}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dto),
  });
}

export async function deletePayment(id: string): Promise<void> {
  await http<void>(`${base}/${id}`, { method: "DELETE" });
}
