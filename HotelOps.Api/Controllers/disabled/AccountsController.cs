using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HotelOps.Api.Data.Auth;
using HotelOps.Api.Data.Contracts.Accounts;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using JwtToken = System.IdentityModel.Tokens.Jwt.JwtSecurityToken;
using JwtHandler = System.IdentityModel.Tokens.Jwt.JwtSecurityTokenHandler;
using Microsoft.AspNetCore.Authentication.JwtBearer;  // JwtBearerDefaults
using HotelOps.Api.Auth;                               // DemoAuthHandler.Scheme

namespace HotelOps.Api.Controllers;

[ApiController]
[Route("api/accounts")]
public class AccountsController : ControllerBase
{
    private readonly UserManager<AppUser> _users;
    private readonly IConfiguration _cfg;

    public AccountsController(UserManager<AppUser> users, IConfiguration cfg)
    { _users = users; _cfg = cfg; }

    [HttpPost("register")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<ActionResult<UserDto>> Register(RegisterDto dto)
    {
        var user = new AppUser { UserName = dto.Email, Email = dto.Email, DisplayName = dto.DisplayName };
        var result = await _users.CreateAsync(user, dto.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);
        var roles = (await _users.GetRolesAsync(user)).ToArray();
        return new UserDto(user.Id, user.Email!, user.DisplayName, roles);
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<TokenResponse>> Login(LoginDto dto)
    {
        var user = await _users.FindByEmailAsync(dto.Email);
        if (user is null) return Unauthorized();
        var ok = await _users.CheckPasswordAsync(user, dto.Password);
        if (!ok) return Unauthorized();
        var roles = (await _users.GetRolesAsync(user)).ToArray();
        var token = GenerateJwt(user, roles);
        return new TokenResponse(token, user.Email!, user.DisplayName ?? user.Email!, roles);
    }

    [HttpGet("me")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme + "," + DemoAuthHandler.Scheme)]
    public async Task<ActionResult<UserDto>> Me()
    {
        var email =
            User.FindFirstValue(JwtRegisteredClaimNames.Email)
            ?? User.FindFirstValue(ClaimTypes.Email)
            ?? User.FindFirstValue("email")
            ?? User.Identity?.Name;

        if (string.IsNullOrWhiteSpace(email)) return Unauthorized();

        var u = await _users.FindByEmailAsync(email);
        if (u is null) return Unauthorized();

        var roles = (await _users.GetRolesAsync(u)).ToArray();
        return new UserDto(u.Id, u.Email!, u.DisplayName, roles);
    }

    [HttpPost("assign-role")]
    [Authorize(Policy = "AdminOnly")]
    public async Task<ActionResult> AssignRole(AssignRoleDto dto)
    {
        var user = await _users.FindByEmailAsync(dto.Email);
        if (user is null) return NotFound("User not found");
        var result = await _users.AddToRoleAsync(user, dto.Role);
        if (!result.Succeeded) return BadRequest(result.Errors);
        return Ok();
    }

    [HttpPost("change-password")]
    [Authorize]
    public async Task<ActionResult> ChangePassword(ChangePasswordDto dto)
    {
        var email = User.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Email)?.Value
                    ?? User.Identity?.Name;
        if (string.IsNullOrWhiteSpace(email)) return Unauthorized();
        var u = await _users.FindByEmailAsync(email);
        if (u is null) return Unauthorized();
        var result = await _users.ChangePasswordAsync(u, dto.CurrentPassword, dto.NewPassword);
        if (!result.Succeeded) return BadRequest(result.Errors);
        return NoContent();
    }

    private string GenerateJwt(AppUser user, string[] roles)
{
    var jwt = _cfg.GetSection("Jwt");

    // Fully-qualified to avoid collisions
    var key = new Microsoft.IdentityModel.Tokens.SymmetricSecurityKey(
        Encoding.UTF8.GetBytes(jwt["Key"]!)
    );

    var creds = new Microsoft.IdentityModel.Tokens.SigningCredentials(
        key,
        Microsoft.IdentityModel.Tokens.SecurityAlgorithms.HmacSha256
    );

    var claims = new List<System.Security.Claims.Claim>
    {
        new(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub, user.Id),
        new(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Email, user.Email ?? ""),
        new("name", user.DisplayName ?? user.Email ?? "")
    };

    foreach (var r in roles)
        claims.Add(new System.Security.Claims.Claim(System.Security.Claims.ClaimTypes.Role, r));

    var token = new JwtToken(
        issuer: jwt["Issuer"],
        audience: jwt["Audience"],
        claims: claims,
        expires: DateTime.UtcNow.AddHours(12),
        signingCredentials: creds
    );

    return new JwtHandler().WriteToken(token);
}
}
