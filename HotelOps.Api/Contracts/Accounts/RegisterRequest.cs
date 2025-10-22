using System.ComponentModel.DataAnnotations;

namespace HotelOps.Api.Contracts.Accounts;

public class RegisterRequest
{
    [Required, MaxLength(64)]
    public string UserName { get; set; } = default!;   // email or code

    [MaxLength(160)]
    public string? FullName { get; set; }

    [MaxLength(160)]
    public string? CompanyName { get; set; }          // label-only for now

    [Required, MaxLength(32)]
    public string Role { get; set; } = "staff";       // "admin" | "staff" | "corporate"

    [Required, MinLength(6), MaxLength(100)]
    public string Password { get; set; } = default!;

    [Required, Compare(nameof(Password), ErrorMessage = "Passwords do not match.")]
    public string ConfirmPassword { get; set; } = default!;
}
