using HotelOps.Api.Data.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace HotelOps.Api.Controllers;

[ApiController]
[Route("api/roles")]
[Authorize(Policy = "AdminOnly")]
public class RolesController : ControllerBase
{
    private readonly RoleManager<IdentityRole> _roles;
    private readonly UserManager<AppUser> _users;
    public RolesController(RoleManager<IdentityRole> roles, UserManager<AppUser> users)
    { _roles = roles; _users = users; }

    [HttpGet]
    public IEnumerable<string> ListRoles() => _roles.Roles.Select(r => r.Name!).OrderBy(x => x);

    [HttpGet("{role}/users")]
    public async Task<IEnumerable<object>> UsersInRole(string role)
    {
        var all = _users.Users.ToList();
        var result = new List<object>();
        foreach (var u in all)
            if (await _users.IsInRoleAsync(u, role))
                result.Add(new { u.Id, u.Email, u.DisplayName });
        return result.OrderBy(x => ((string?)x.GetType().GetProperty("Email")?.GetValue(x)) ?? "");
    }
}
