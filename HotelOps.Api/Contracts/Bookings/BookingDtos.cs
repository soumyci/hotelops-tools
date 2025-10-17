// Contracts/Bookings/BookingDtos.cs
namespace HotelOps.Api.Contracts.Bookings;

public record BookingCreateDto(
    string CustomerCode,
    int RoomTypeId,
    int? RatePlanId,
    DateOnly CheckIn,
    DateOnly CheckOut,
    int Rooms,
    decimal NightlyRate
);

public record BookingListItemDto(
    int Id, string Code, string Customer, string RoomType, DateOnly CheckIn,
    DateOnly CheckOut, int Rooms, decimal Total, string Status
);
