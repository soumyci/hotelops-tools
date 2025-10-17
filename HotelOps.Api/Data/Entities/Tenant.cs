namespace HotelOps.Api.Data;
public class Tenant
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;

    // Example: allow many corporates map to multiple tenants later
    public string? CorporateCode { get; set; }
}