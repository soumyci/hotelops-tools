// Controllers/AdminUsersController.cs
using HotelOps.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace HotelOps.Api.Controllers;

[ApiController]
[Route("api/admin/users")]
[Authorize(Policy = "AdminOnly")]
public class AdminUsersController : ControllerBase
{
    private readonly UserManager<AppUser> _users;
    private readonly RoleManager<IdentityRole> _roles;

    public AdminUsersController(UserManager<AppUser> users, RoleManager<IdentityRole> roles)
    {
        _users = users; _roles = roles;
    }

    [HttpGet]
    public async Task<IActionResult> List()
    {
        var list = await _users.Users
            .Select(u => new { u.Id, u.UserName, u.Email, u.TenantId })
            .ToListAsync();

        // roles per user
        var result = new List<object>();
        foreach (var u in list)
        {
            var user = await _users.FindByIdAsync(u.Id);
            var rs = await _users.GetRolesAsync(user!);
            result.Add(new { u.Id, u.UserName, u.Email, u.TenantId, roles = rs });
        }
        return Ok(result);
    }

    public record CreateUserDto(string UserName, string Email, string Password, string[] Roles, string TenantId);
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateUserDto dto)
    {
        var user = new AppUser { UserName = dto.UserName, Email = dto.Email, TenantId = dto.TenantId };
        var res = await _users.CreateAsync(user, dto.Password);
        if (!res.Succeeded) return BadRequest(res.Errors);

        foreach (var r in dto.Roles ?? Array.Empty<string>())
            if (await _roles.RoleExistsAsync(r)) await _users.AddToRoleAsync(user, r);

        return CreatedAtAction(nameof(Get), new { id = user.Id }, new { user.Id, user.UserName, user.Email });
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(string id)
    {
        var u = await _users.FindByIdAsync(id);
        if (u is null) return NotFound();
        var roles = await _users.GetRolesAsync(u);
        return Ok(new { u.Id, u.UserName, u.Email, u.TenantId, roles });
    }

    public record UpdateRolesDto(string[] Roles);
    [HttpPut("{id}/roles")]
    public async Task<IActionResult> SetRoles(string id, [FromBody] UpdateRolesDto dto)
    {
        var u = await _users.FindByIdAsync(id);
        if (u is null) return NotFound();

        var current = await _users.GetRolesAsync(u);
        await _users.RemoveFromRolesAsync(u, current);
        foreach (var r in dto.Roles ?? Array.Empty<string>())
            if (await _roles.RoleExistsAsync(r)) await _users.AddToRoleAsync(u, r);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(string id)
    {
        var u = await _users.FindByIdAsync(id);
        if (u is null) return NotFound();
        await _users.DeleteAsync(u);
        return NoContent();
    }
}
