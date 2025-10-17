using Microsoft.AspNetCore.Identity;

namespace HotelOps.Api.Data.Auth;

public class AppUser : IdentityUser
{
    public string? DisplayName { get; set; }
    public string? TenantId { get; set; } // optional, for corporate scoping later
}
