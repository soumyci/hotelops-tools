using Microsoft.AspNetCore.Identity;
namespace HotelOps.Api.Data.Auth;
public class AppUser : IdentityUser
{
    public string? DisplayName { get; set; }
    public int? TenantId { get; set; }        // OK to keep nullable for now
    public string? FullName { get; set; }
    public string? CompanyName { get; set; }
}
