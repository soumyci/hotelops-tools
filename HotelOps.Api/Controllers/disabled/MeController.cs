using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using HotelOps.Api.Contracts;
namespace HotelOps.Api.Controllers;

[ApiController]
public class MeController : ControllerBase
{
    [HttpGet("api/me")]
    public IActionResult Me()
    {
        var isAuth = User?.Identity?.IsAuthenticated == true;
        var name = isAuth ? (User.Identity!.Name ?? User.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Email)?.Value) : null;
        var roles = isAuth ? User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value).Distinct().ToArray() : Array.Empty<string>();

        // Return something simple for the client
        return Ok(new { authenticated = isAuth, name, roles });
    }
}