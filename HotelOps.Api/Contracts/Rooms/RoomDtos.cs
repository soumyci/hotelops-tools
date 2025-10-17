namespace HotelOps.Api.Contracts.Rooms;

public sealed record RoomDto(
    int Id, string Code, string Name,
    int Capacity, decimal BasePrice, int RoomTypeId,
    int[] AmenityIds);

public sealed record CreateRoomDto(
    string Code, string Name,
    int Capacity, decimal BasePrice, int RoomTypeId,
    int[] AmenityIds);

public sealed record UpdateRoomDto(
    string Code, string Name,
    int Capacity, decimal BasePrice, int RoomTypeId,
    int[] AmenityIds);
