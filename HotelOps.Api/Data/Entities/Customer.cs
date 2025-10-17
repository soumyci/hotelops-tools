// Data/Entities/Customer.cs
namespace HotelOps.Api.Data.Entities;
public class Customer
{
    public int Id { get; set; }
    public string Code { get; set; } = default!; // e.g., company code or email
    public string Name { get; set; } = default!;
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public bool Active { get; set; } = true;
}

