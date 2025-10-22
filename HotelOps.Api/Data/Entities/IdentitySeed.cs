using HotelOps.Api.Data.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;

namespace HotelOps.Api.Data
{
    public static class IdentitySeed
    {
        public static async Task EnsureAdminAsync(IServiceProvider services)
        {
            using var scope = services.CreateScope();
            var cfg         = scope.ServiceProvider.GetRequiredService<IConfiguration>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            // Ensure roles
            foreach (var role in new[] { "Admin", "Hotel", "Corporate" })
            {
                if (!await roleManager.RoleExistsAsync(role))
                    await roleManager.CreateAsync(new IdentityRole(role));
            }

           var email = cfg["Admin:Email"]!;
            var pwd   = cfg["Admin:Password"]!;

            var admin = await userManager.FindByEmailAsync(email);
            if (admin == null)
            {
                admin = new AppUser
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true,

                    // ✅ Required-by-schema fields
                    FullName = "System Admin",
                    TenantId = 1,

                    // optional org cosmetics
                    CompanyCode = "SCI",
                    CompanyName = "Soumy Career Institute",
                };

                var res = await userManager.CreateAsync(admin, pwd);
                if (!res.Succeeded)
                    throw new Exception("Admin creation failed: " + string.Join(";", res.Errors.Select(e => e.Description)));
            }

            if (!await userManager.IsInRoleAsync(admin, "Admin"))
                await userManager.AddToRoleAsync(admin, "Admin");
                    }
    }
}



// using Microsoft.AspNetCore.Identity;
// using Microsoft.Extensions.Configuration;
// using System.Security.Claims;               // <-- add this
// using HotelOps.Api.Data.Entities;          // <-- and this
// using HotelOps.Api.Data.Auth;

// namespace HotelOps.Api.Data
// {
//     public static class IdentitySeed
//     {
//         public static async Task EnsureAdminAsync(IServiceProvider services)
//         {
//             using var scope = services.CreateScope();
//             var cfg         = scope.ServiceProvider.GetRequiredService<IConfiguration>();
//             var db          = scope.ServiceProvider.GetRequiredService<AppDb>();
//             var userManager = scope.ServiceProvider.GetRequiredService<UserManager<AppUser>>();
//             var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

//             await db.Database.EnsureCreatedAsync();

//             // Ensure roles
//             string[] roleNames = { "Admin", "Hotel", "Corporate", "CorporateBooker" };
//             foreach (var rn in roleNames)
//                 if (!await roleManager.RoleExistsAsync(rn))
//                     await roleManager.CreateAsync(new IdentityRole(rn));

//             // Seed admin
//             var email    = cfg["Admin:Email"];
//             var password = cfg["Admin:Password"];
//             if (string.IsNullOrWhiteSpace(email) || string.IsNullOrWhiteSpace(password))
//                 return;

//             var user = await userManager.FindByEmailAsync(email);
//             if (user is null)
//             {
//                 user = new AppUser
//                 {
//                     UserName = email,
//                     Email    = email,
//                     // IMPORTANT: satisfy non-null property
//                     TenantId = 1   // <- set something valid for your schema
//                 };

//                 var createRes = await userManager.CreateAsync(user, password);
//                 if (!createRes.Succeeded)
//                     throw new Exception("Failed to create seed admin: " +
//                         string.Join("; ", createRes.Errors.Select(e => $"{e.Code}:{e.Description}")));
//             }

//             // inside IdentitySeed.RunAsync
//             var email = cfg["Admin:Email"]    ?? "admin@hotelops.local";
//             var pass  = cfg["Admin:Password"] ?? "Admin#12345";

//             if (await userMgr.FindByEmailAsync(email) is null)
//             {
//                 var admin = new AppUser { UserName = email, Email = email, FullName = "System Admin", TenantId = 1 };
//                 var created = await userMgr.CreateAsync(admin, pass);
//                 if (created.Succeeded) await userMgr.AddToRoleAsync(admin, "Admin");
//             }

//             const string adminRole = "Admin";
//             if (!await userManager.IsInRoleAsync(user, adminRole))
//                 await userManager.AddToRoleAsync(user, adminRole);

//             // Optional: add a Role claim (needs System.Security.Claims)
//             var claims = await userManager.GetClaimsAsync(user);
//             if (!claims.Any(c => c.Type == ClaimTypes.Role && c.Value == adminRole))
//                 await userManager.AddClaimAsync(user, new Claim(ClaimTypes.Role, adminRole)); // <-- pass a Claim

//             // Amenity seed (idempotent)  -- needs HotelOps.Api.Data.Entities
//             var amenities = new (string Code, string Name)[]
//             {
//                 ("WIFI","High-speed Wi-Fi"),
//                 ("AC","Air Conditioning"),
//                 ("TV","Television"),
//                 ("BF","Breakfast Included"),
//                 ("PK","Parking"),
//             };

//             foreach (var a in amenities)
//             {
//                 var exists = await db.Amenities.AnyAsync(x => x.Code == a.Code);
//                 if (!exists)
//                     db.Amenities.Add(new Amenity { Code = a.Code, Name = a.Name });
//             }

//             await db.SaveChangesAsync();
//         }
//     }
// }
