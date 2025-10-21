using HotelOps.Api.Contracts.Accounts;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

// 👇 Import AppUser via an alias; DO NOT also `using HotelOps.Api.Data.Auth;`
using HotelOps.Api.Data.Auth;

namespace HotelOps.Api.Controllers
{
    [ApiController]
    [Route("api/admin/registration")]
    [Authorize(Roles = "admin")]
    public class RegistrationController : ControllerBase
    {
        private readonly UserManager<AppUser> _users;
        private readonly RoleManager<IdentityRole> _roles;

        public RegistrationController(UserManager<AppUser> users, RoleManager<IdentityRole> roles)
        {
            _users = users;
            _roles = roles;
        }

        [HttpPost]
        public async Task<ActionResult<RegisterResponse>> Register([FromBody] RegisterRequest dto)
        {
            if (!ModelState.IsValid) return ValidationProblem(ModelState);

            // ensure role exists
            if (!await _roles.RoleExistsAsync(dto.Role))
            {
                var roleCreate = await _roles.CreateAsync(new IdentityRole(dto.Role));
                if (!roleCreate.Succeeded) return BadRequest(roleCreate.Errors);
            }

            var user = new AppUser
            {
                UserName   = dto.UserName,
                Email      = dto.UserName.Contains('@') ? dto.UserName : null, // optional
                FullName   = dto.FullName,
                CompanyName= dto.CompanyName,
                // TenantId = 1, // optional placeholder if you want
            };

            var create = await _users.CreateAsync(user, dto.Password);
            if (!create.Succeeded) return BadRequest(create.Errors);

            await _users.AddToRoleAsync(user, dto.Role);
            return Ok(new RegisterResponse { UserName = user.UserName!, Role = dto.Role });
        }
    }
}


