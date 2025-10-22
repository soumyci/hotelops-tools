using HotelOps.Api.Contracts.Accounts;
using HotelOps.Api.Data.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Cryptography; // <-- add this
using System.Text;           

namespace HotelOps.Api.Controllers;

[ApiController]
[Route("api/admin/registration")]
[AllowAnonymous] // admins create users
public class RegistrationController : ControllerBase
{
    private readonly UserManager<AppUser> _users;
    private readonly RoleManager<IdentityRole> _roles;

    public RegistrationController(UserManager<AppUser> users, RoleManager<IdentityRole> roles)
    {
        _users = users;
        _roles = roles;
    }
    // AuthController.cs (inside class)
    [HttpGet("jwt-config")]
    [AllowAnonymous]
    public object JwtConfig([FromServices] IConfiguration cfg)
    {
        var issuer   = cfg["Jwt:Issuer"] ?? "";
        var audience = cfg["Jwt:Audience"] ?? "";
        var key      = cfg["Jwt:Key"] ?? "";
        // Only show a safe preview so we avoid extra using statements
        var keyPreview = $"{key.Length}:{(key.Length >= 6 ? key.Substring(0, 6) : key)}…";
        return new { issuer, audience, keyPreview };
    }
[HttpPost("register")]
    public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest dto)
    {
        if (!ModelState.IsValid) return ValidationProblem(ModelState);

        // make sure role exists (idempotent)
        if (!await _roles.RoleExistsAsync(dto.Role))
        {
            var roleCreate = await _roles.CreateAsync(new IdentityRole(dto.Role));
            if (!roleCreate.Succeeded) return BadRequest(roleCreate.Errors);
        }

        var user = new AppUser
        {
            UserName    = dto.UserName,
            Email       = dto.UserName.Contains('@') ? dto.UserName : null,
            FullName    = dto.FullName,
            CompanyName = dto.CompanyName,
            // keep nullable until we build tenants
            TenantId    = 1
        };

        var create = await _users.CreateAsync(user, dto.Password);
        if (!create.Succeeded) return BadRequest(create.Errors);

        await _users.AddToRoleAsync(user, dto.Role);

        return Ok(new RegisterResponse
        {
            UserName = user.UserName!,
            Role     = dto.Role,
            FullName = user.FullName
        });
    }
}
