using Microsoft.AspNetCore.Identity;

namespace HotelOps.Api.Data;

public class AppUser : IdentityUser
{
    public string TenantId { get; set; }  // multi-tenant prep
    //public string? CorporateId { get; set; }            // set for corporate users
}