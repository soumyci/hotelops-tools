namespace HotelOps.Api.Data;
public class Booking
{
    public Guid Id { get; set; }
    public Guid TenantId { get; set; }
    public Guid? RoomId { get; set; }

    public string RoomCode { get; set; } = string.Empty;
    public string GuestName { get; set; } = string.Empty;

    public DateTimeOffset CheckIn { get; set; }
    public DateTimeOffset CheckOut { get; set; }

    public int Rooms { get; set; } = 1;
    public string? Status { get; set; }     // pending / confirmed / cancelled
}