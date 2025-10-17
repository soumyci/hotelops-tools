namespace HotelOps.Api.Data.Contracts.Accounts;

public record RegisterDto(string Email, string Password, string DisplayName);
public record LoginDto(string Email, string Password);
public record TokenResponse(string Token, string Email, string DisplayName, string[] Roles);
public record AssignRoleDto(string Email, string Role);
public record UserDto(string Id, string Email, string? DisplayName, string[] Roles);
public record ChangePasswordDto(string CurrentPassword, string NewPassword);
