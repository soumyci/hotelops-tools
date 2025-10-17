using System.ComponentModel.DataAnnotations;   
namespace HotelOps.Api.Models;

public class Rate
{
    [Key] public Guid Id { get; set; } = Guid.NewGuid();

    // multi-tenant; remove if not used in your app
    public Guid TenantId { get; set; }

    [Required, MaxLength(32)]
    public string RoomCode { get; set; } = default!;

    [Required]
    public DateOnly Date { get; set; }

    [Range(0, 1_000_000)]
    public decimal Price { get; set; }
}