// Data/Entities/RoomType.cs
using System.ComponentModel.DataAnnotations;


namespace HotelOps.Api.Data.Entities;

public class RoomType
{
    public int Id { get; set; }

    public required string Code { get; set; } = default!;      // e.g., "DLX"
    public required string Name { get; set; } = default!;      // e.g., "Deluxe"
    public decimal BasePrice { get; set; }
    public string? Description { get; set; }
    public bool Active { get; set; } = true;
}
