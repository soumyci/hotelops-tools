export type RoomType = { id: string; name: string };
export type RatePlan = {
  code: string; name: string; currency: string;
  baseByRoomTypeJson: Record<string, number> | string;
  dateOverridesJson: Record<string, Record<string, number>> | string;
};

export type CorporateSearchRow = {
  roomTypeId: string; roomTypeName: string;
  plan: string; basePrice: number; finalPrice: number; currency: string;
};

export type Booking = {
  id: number; corporateId: string; roomTypeId: string;
  ratePlanCode: string; checkIn: string; checkOut: string;
  guestName: string; phone?: string; pricePerNight: number; total: number;
};
