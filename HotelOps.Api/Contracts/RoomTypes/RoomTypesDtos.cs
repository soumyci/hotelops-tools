namespace HotelOps.Api.Contracts.RoomTypes;

public record RoomTypeListItemDto(int Id, string Code, string Name, decimal? BasePrice, bool Active);
public record RoomTypeDto(int Id, string Code, string Name, string? Description, decimal? BasePrice, bool Active);
public record RoomTypeCreateDto(string Code, string Name, string? Description, decimal? BasePrice, bool Active);
public record RoomTypeUpdateDto(string Code, string Name, string? Description, decimal? BasePrice, bool Active);
