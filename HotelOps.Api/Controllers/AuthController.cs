using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using HotelOps.Api.Contracts.Auth;
using HotelOps.Api.Data.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.Security.Cryptography;

namespace HotelOps.Api.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<AppUser> _userManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly IConfiguration _cfg;

        public AuthController(
            UserManager<AppUser> userManager,
            SignInManager<AppUser> signInManager,
            IConfiguration cfg)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _cfg = cfg;
        }

       

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResultDto>> Register(RegisterDto dto)
        {
            // Allowed roles (avoid arbitrary elevation)
            var allowed = new[] { "Hotel", "Corporate" /* you can allow "Admin" only for seeders */ };
            if (!allowed.Contains(dto.Role))
                return BadRequest("Role not allowed for self-registration.");

            var existing = await _userManager.FindByEmailAsync(dto.Email);
            if (existing != null) return Conflict("Email already registered.");

            var user = new AppUser { UserName = dto.Email, Email = dto.Email, EmailConfirmed = true };
            var res = await _userManager.CreateAsync(user, dto.Password);
            if (!res.Succeeded)
                return BadRequest(string.Join("; ", res.Errors.Select(e => e.Description)));

            await _userManager.AddToRoleAsync(user, dto.Role);

            var token = await CreateJwtAsync(user);
            return Ok(token);
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResultDto>> Login(LoginDto dto)
        {
            var user = await _userManager.FindByEmailAsync(dto.Email);
            if (user == null) return Unauthorized("Invalid credentials.");

            var res = await _signInManager.CheckPasswordSignInAsync(user, dto.Password, false);
            if (!res.Succeeded) return Unauthorized("Invalid credentials.");

            var token = await CreateJwtAsync(user);
            return Ok(token);
        }

        private async Task<AuthResultDto> CreateJwtAsync(AppUser user)
        {
            var jwt = _cfg.GetSection("Jwt");
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!));

            var roles = (await _userManager.GetRolesAsync(user)).ToArray();

            var claims = new List<Claim>
            {
                new(JwtRegisteredClaimNames.Sub, user.Id),
                new(JwtRegisteredClaimNames.UniqueName, user.UserName ?? user.Email ?? user.Id),
                new(ClaimTypes.NameIdentifier, user.Id),
                new(ClaimTypes.Name, user.UserName ?? user.Email ?? user.Id)
            };
            claims.AddRange(roles.Select(r => new Claim(ClaimTypes.Role, r)));

            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            var expires = DateTime.UtcNow.AddHours(8);

            var token = new JwtSecurityToken(
                issuer: jwt["Issuer"],
                audience: jwt["Audience"],
                claims: claims,
                expires: expires,
                signingCredentials: creds
            );

            var accessToken = new JwtSecurityTokenHandler().WriteToken(token);
            return new AuthResultDto(accessToken, expires, roles);
        }

        [HttpGet("ping")]
[AllowAnonymous]
public string Ping() => "pong";

[HttpGet("me")]
[Authorize]
public object Me() => new {
    User.Identity!.Name,
    Roles = User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).ToArray()
};

[HttpGet("admin-check")]
[Authorize(Policy = "AdminOnly")]
public string AdminOnly() => "ok-admin";

    }
}
