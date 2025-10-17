namespace HotelOps.Api.Contracts.RatePlans;

public record RatePlanListItemDto(int Id, string Code, string Name, bool Active);
public record RatePlanDto(int Id, string Code, string Name, string? Description, bool Active, decimal? PriceModifier, bool IsPercent);
public record RatePlanCreateDto(string Code, string Name, string? Description, bool Active, decimal? PriceModifier, bool IsPercent);
public record RatePlanUpdateDto(string Code, string Name, string? Description, bool Active, decimal? PriceModifier, bool IsPercent);
