using System.ComponentModel.DataAnnotations;

namespace HotelOps.Api.Data.Entities;

public class Reservation
{  
  public int Id { get; set; }
    public string Code { get; set; } = default!;      // human-friendly booking code
    public int CustomerId { get; set; }
    public int RoomTypeId { get; set; }
    public int? RatePlanId { get; set; }
    public DateOnly CheckIn { get; set; }
    public DateOnly CheckOut { get; set; }
    public int Rooms { get; set; } = 1;
    public decimal NightlyRate { get; set; }          // snapshot at time of booking
    public decimal Total { get; set; }                // computed and stored
    public string Status { get; set; } = "Confirmed"; // Confirmed/Cancelled/NoShow
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public Customer? Customer { get; set; }
    public RoomType? RoomType { get; set; }
    public RatePlan? RatePlan { get; set; }
    public ICollection<Payment> Payments { get; set; } = new List<Payment>();
}
