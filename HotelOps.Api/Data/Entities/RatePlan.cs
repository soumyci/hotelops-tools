// Data/Entities/RatePlan.cs
using System.ComponentModel.DataAnnotations;

namespace HotelOps.Api.Data.Entities;

public class RatePlan
{
    public int Id { get; set; }

    public required string Code { get; set; } = default!;
    public required string Name { get; set; } = default!;
    public string? Description { get; set; }
    public bool Active { get; set; } = true;

    // optional: default price adjustment fields
    public decimal? PriceModifier { get; set; }   // +/- amount or %
    public bool IsPercent { get; set; }           // if true, treat as %
}
