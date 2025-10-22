using Microsoft.AspNetCore.Identity;

namespace HotelOps.Api.Data.Auth;

public class AppUser : IdentityUser
{
       // ✅ Default values prevent nulls at insert time
        public string FullName { get; set; } = "User";
        public int TenantId { get; set; } = 1;

        // Optional org fields — give empty defaults if you keep them non-null
        public string CompanyCode { get; set; } = "";
        public string CompanyName { get; set; } = "";
    public string? DisplayName {get;set;}="";
}
