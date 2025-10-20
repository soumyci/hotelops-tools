using Microsoft.AspNetCore.Identity;

namespace HotelOps.Api.Data.Auth;

public class AppUser : IdentityUser
{
    public string FullName { get; set; } = default!;
    public int TenantId { get; set; } = 1;           // you had a non-null warning earlier
    public string? CompanyCode { get; set; }         // optional placeholder
}
