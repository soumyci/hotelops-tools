namespace HotelOps.Api.Contracts.Amenities;
public sealed record AmenityDto(int Id, string Code, string Name, bool IsActive);
public sealed record CreateAmenityDto(string Code, string Name);
public sealed record UpdateAmenityDto(string Code, string Name);
