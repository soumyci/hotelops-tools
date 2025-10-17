using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;

namespace HotelOps.Api.Data.Auth;

public static class IdentitySeed
{
    private static readonly string[] Roles = new[]
    {
        "Admin","Staff","CorporateAdmin","CorporateBooker"
    };

    public static async Task RunAsync(IServiceProvider sp)
    {
        var roleMgr = sp.GetRequiredService<RoleManager<IdentityRole>>();
        var userMgr = sp.GetRequiredService<UserManager<AppUser>>();

        foreach (var r in Roles)
            if (!await roleMgr.RoleExistsAsync(r))
                await roleMgr.CreateAsync(new IdentityRole(r));

        var cfg = sp.GetRequiredService<IConfiguration>();
        var adminEmail = cfg["Admin:Email"] ?? "admin@hotelops.local";
        var adminPass  = cfg["Admin:Password"] ?? "Admin#12345";
        
        var admin = await userMgr.FindByEmailAsync(adminEmail);
        if (admin is null)
        {
            admin = new AppUser { UserName = adminEmail, Email = adminEmail, DisplayName = "Super Admin" };
            var created = await userMgr.CreateAsync(admin, adminPass);
            if (created.Succeeded)
                await userMgr.AddToRoleAsync(admin, "Admin");
        }
        
    }
}
