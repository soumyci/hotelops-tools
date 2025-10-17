namespace HotelOps.Api.Data.Entities;
public class Payment
{
    public int Id { get; set; }
    public int ReservationId { get; set; }
    public decimal Amount { get; set; }
    public string Method { get; set; } = "Cash";     // Cash/Card/Bank/UPI…
    public string? Reference { get; set; }           // txn id, cheque no
    public DateTime PaidAt { get; set; } = DateTime.UtcNow;

    public Reservation? Reservation { get; set; }
}